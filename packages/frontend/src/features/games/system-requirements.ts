export interface SystemSpecTier {
  os: string;
  cpu: string;
  ram: string;
  gpu: string;
  storage: string;
  notes: string;
}

export interface StructuredSystemRequirements {
  minimum: SystemSpecTier;
  recommended: SystemSpecTier;
}

export type SpecFieldKey = keyof SystemSpecTier;

export const EMPTY_SPEC_TIER: SystemSpecTier = {
  os: '',
  cpu: '',
  ram: '',
  gpu: '',
  storage: '',
  notes: '',
};

export const SPEC_FIELDS: {
  key: SpecFieldKey;
  label: string;
  shortLabel: string;
  placeholder: string;
}[] = [
  {
    key: 'os',
    label: 'ระบบปฏิบัติการ (OS)',
    shortLabel: 'OS',
    placeholder: 'เช่น Windows 10 / 11 (64-bit) หรือ Android 10+',
  },
  {
    key: 'cpu',
    label: 'ซีพียู (CPU)',
    shortLabel: 'CPU',
    placeholder: 'เช่น Intel Core i5-10400 / AMD Ryzen 5 3600',
  },
  {
    key: 'ram',
    label: 'หน่วยความจำ (RAM)',
    shortLabel: 'RAM',
    placeholder: 'เช่น 8 GB RAM',
  },
  {
    key: 'gpu',
    label: 'การ์ดจอ (GPU)',
    shortLabel: 'GPU',
    placeholder: 'เช่น NVIDIA GTX 1660 / AMD RX 580',
  },
  {
    key: 'storage',
    label: 'พื้นที่จัดเก็บ (Storage)',
    shortLabel: 'Storage',
    placeholder: 'เช่น 20 GB พื้นที่ว่าง (แนะนำ SSD)',
  },
  {
    key: 'notes',
    label: 'หมายเหตุเพิ่มเติม',
    shortLabel: 'เพิ่มเติม',
    placeholder: 'เช่น DirectX 12, รองรับการเปิด VT, อินเทอร์เน็ตความเร็วสูง',
  },
];

export function createEmptyRequirements(): StructuredSystemRequirements {
  return {
    minimum: { ...EMPTY_SPEC_TIER },
    recommended: { ...EMPTY_SPEC_TIER },
  };
}

export function hasAnySpec(tier: SystemSpecTier): boolean {
  return Object.values(tier).some((val) => val.trim().length > 0);
}

export function hasAnyRequirements(reqs: StructuredSystemRequirements): boolean {
  return hasAnySpec(reqs.minimum) || hasAnySpec(reqs.recommended);
}

function normalizeTier(raw: unknown): SystemSpecTier {
  if (!raw || typeof raw !== 'object') return { ...EMPTY_SPEC_TIER };
  const obj = raw as Record<string, unknown>;
  return {
    os: typeof obj.os === 'string' ? obj.os.trim() : '',
    cpu: typeof obj.cpu === 'string' ? obj.cpu.trim() : '',
    ram: typeof obj.ram === 'string' ? obj.ram.trim() : '',
    gpu: typeof obj.gpu === 'string' ? obj.gpu.trim() : '',
    storage: typeof obj.storage === 'string' ? obj.storage.trim() : '',
    notes: typeof obj.notes === 'string' ? obj.notes.trim() : '',
  };
}

const KEY_ALIASES: { pattern: RegExp; target: SpecFieldKey }[] = [
  { pattern: /^(?:OS|ระบบปฏิบัติการ)\s*:/i, target: 'os' },
  { pattern: /^(?:CPU|Processor|หน่วยประมวลผล|ซีพียู)\s*:/i, target: 'cpu' },
  { pattern: /^(?:RAM|Memory|หน่วยความจำ|แรม)\s*:/i, target: 'ram' },
  { pattern: /^(?:GPU|Graphics|Video Card|การ์ดจอ)\s*:/i, target: 'gpu' },
  { pattern: /^(?:Storage|Disk|HDD|SSD|พื้นที่ว่างฮาร์ดดิสก์|พื้นที่จัดเก็บ|พื้นที่ว่าง)\s*:/i, target: 'storage' },
  { pattern: /^(?:Notes?|DirectX|Network|เพิ่มเติม|หมายเหตุ)\s*:/i, target: 'notes' },
];

const INLINE_KEY_SPLIT_REGEX =
  /(?=(?:OS|ระบบปฏิบัติการ|CPU|Processor|หน่วยประมวลผล|ซีพียู|RAM|Memory|หน่วยความจำ|แรม|GPU|Graphics|Video Card|การ์ดจอ|Storage|Disk|HDD|SSD|พื้นที่ว่างฮาร์ดดิสก์|พื้นที่จัดเก็บ|พื้นที่ว่าง|DirectX|Notes?|หมายเหตุ)\s*:)/gi;

function parseLegacyBlock(text: string): SystemSpecTier {
  const tier: SystemSpecTier = { ...EMPTY_SPEC_TIER };
  const cleaned = text.replace(/\*\*/g, '').trim();
  if (!cleaned) return tier;

  // Split by newlines first, then split inline concatenated keys (e.g., "Windows 11CPU: Intel")
  const chunks = cleaned
    .split(/\r?\n/)
    .flatMap((line) => line.split(INLINE_KEY_SPLIT_REGEX))
    .map((s) => s.trim())
    .filter(Boolean);

  const extraNotes: string[] = [];

  for (const chunk of chunks) {
    let matched = false;
    for (const { pattern, target } of KEY_ALIASES) {
      if (pattern.test(chunk)) {
        const value = chunk.replace(pattern, '').trim();
        if (value) {
          if (target === 'notes') {
            extraNotes.push(chunk);
          } else if (!tier[target]) {
            tier[target] = value;
          } else {
            extraNotes.push(chunk);
          }
        }
        matched = true;
        break;
      }
    }
    if (!matched) {
      extraNotes.push(chunk);
    }
  }

  if (extraNotes.length > 0) {
    tier.notes = tier.notes
      ? `${tier.notes}\n${extraNotes.join('\n')}`
      : extraNotes.join('\n');
  }

  return tier;
}

/**
 * Parses either structured JSON or legacy markdown/plain-text system requirements
 * (including concatenated single-line legacy entries) into two clean tiers.
 */
export function parseSystemRequirements(raw?: string | null): StructuredSystemRequirements {
  const empty = createEmptyRequirements();
  if (!raw) return empty;

  const trimmed = raw.trim();
  if (!trimmed || trimmed === '**แนะนำ (Recommended):**') {
    return empty;
  }

  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed) as { minimum?: unknown; recommended?: unknown };
      return {
        minimum: normalizeTier(parsed.minimum),
        recommended: normalizeTier(parsed.recommended),
      };
    } catch {
      // Fall through to legacy text parser if not valid JSON
    }
  }

  const stripped = trimmed.replace(/\*\*/g, '');
  const minHeaderRegex = /(?:^|\n)\s*(?:ขั้นต่ำ|Minimum)(?:\s*\([^)]*\))?\s*:?\s*/i;
  const recHeaderRegex = /(?:^|\n)\s*(?:แนะนำ|Recommended)(?:\s*\([^)]*\))?\s*:?\s*/i;

  const minMatch = minHeaderRegex.exec(stripped);
  const recMatch = recHeaderRegex.exec(stripped);

  if (minMatch && recMatch) {
    if (minMatch.index < recMatch.index) {
      const minText = stripped.slice(minMatch.index + minMatch[0].length, recMatch.index);
      const recText = stripped.slice(recMatch.index + recMatch[0].length);
      return {
        minimum: parseLegacyBlock(minText),
        recommended: parseLegacyBlock(recText),
      };
    }
    const recText = stripped.slice(recMatch.index + recMatch[0].length, minMatch.index);
    const minText = stripped.slice(minMatch.index + minMatch[0].length);
    return {
      minimum: parseLegacyBlock(minText),
      recommended: parseLegacyBlock(recText),
    };
  }

  if (recMatch) {
    const recText = stripped.slice(recMatch.index + recMatch[0].length);
    return {
      minimum: { ...EMPTY_SPEC_TIER },
      recommended: parseLegacyBlock(recText),
    };
  }

  if (minMatch) {
    const minText = stripped.slice(minMatch.index + minMatch[0].length);
    return {
      minimum: parseLegacyBlock(minText),
      recommended: { ...EMPTY_SPEC_TIER },
    };
  }

  return {
    minimum: parseLegacyBlock(stripped),
    recommended: { ...EMPTY_SPEC_TIER },
  };
}

export function serializeSystemRequirements(reqs: StructuredSystemRequirements): string {
  if (!hasAnyRequirements(reqs)) {
    return '';
  }

  return JSON.stringify({
    minimum: normalizeTier(reqs.minimum),
    recommended: normalizeTier(reqs.recommended),
  });
}
