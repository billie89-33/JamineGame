import React from 'react';
import { Monitor, Cpu, MemoryStick, HardDrive, Tv, Info } from 'lucide-react';
import {
  SPEC_FIELDS,
  SpecFieldKey,
  SystemSpecTier,
  hasAnyRequirements,
  hasAnySpec,
  parseSystemRequirements,
} from '../system-requirements';

const FIELD_ICONS: Record<SpecFieldKey, React.ComponentType<{ className?: string }>> = {
  os: Monitor,
  cpu: Cpu,
  ram: MemoryStick,
  gpu: Tv,
  storage: HardDrive,
  notes: Info,
};

function SpecTierCard({
  title,
  badge,
  accentClass,
  tier,
}: {
  title: string;
  badge: string;
  accentClass: string;
  tier: SystemSpecTier;
}) {
  const activeFields = SPEC_FIELDS.filter((f) => tier[f.key].trim().length > 0);
  if (activeFields.length === 0) return null;

  return (
    <div className="bg-[#141c15] border border-[#2e3b2c] rounded-2xl overflow-hidden shadow-lg flex flex-col">
      <div className="px-6 py-4 bg-[#1a241b] border-b border-[#2e3b2c] flex items-center justify-between">
        <h4 className="text-lg font-black text-[#f7ebc6] tracking-wide">{title}</h4>
        <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${accentClass}`}>
          {badge}
        </span>
      </div>

      <dl className="divide-y divide-[#2e3b2c]/60 px-6 py-2">
        {activeFields.map(({ key, label }) => {
          const Icon = FIELD_ICONS[key];
          return (
            <div key={key} className="py-3.5 flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-4">
              <dt className="sm:w-44 shrink-0 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#d4c38d]">
                <Icon className="w-4 h-4 text-lime-400 shrink-0" />
                <span>{label}</span>
              </dt>
              <dd className="text-sm text-[#e6efe7] leading-relaxed whitespace-pre-line break-words flex-1">
                {tier[key]}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

export function SystemRequirementsCard({ raw }: { raw?: string | null }) {
  const parsed = parseSystemRequirements(raw);
  if (!hasAnyRequirements(parsed)) {
    return null;
  }

  const showMin = hasAnySpec(parsed.minimum);
  const showRec = hasAnySpec(parsed.recommended);
  const gridCols = showMin && showRec ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1';

  return (
    <section className="mt-12">
      <hr className="border-[#2e3b2c] mb-8" />
      <h3 className="text-2xl font-bold text-[#f7ebc6] mb-6 flex items-center gap-3">
        <Monitor className="w-6 h-6 text-lime-400" />
        ความต้องการระบบ (System Requirements)
      </h3>

      <div className={`grid ${gridCols} gap-6`}>
        {showMin && (
          <SpecTierCard
            title="ขั้นต่ำ"
            badge="Minimum"
            accentClass="bg-amber-400/15 text-amber-300 border border-amber-400/30"
            tier={parsed.minimum}
          />
        )}
        {showRec && (
          <SpecTierCard
            title="แนะนำ"
            badge="Recommended"
            accentClass="bg-lime-400/15 text-lime-300 border border-lime-400/30"
            tier={parsed.recommended}
          />
        )}
      </div>
    </section>
  );
}
