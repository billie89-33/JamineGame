import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as { paths?: unknown } | null;
    const paths = Array.isArray(body?.paths)
      ? body.paths.filter((p): p is string => typeof p === 'string' && p.startsWith('/'))
      : ['/'];

    const uniquePaths = Array.from(new Set(paths));
    for (const path of uniquePaths) {
      revalidatePath(path);
    }

    return NextResponse.json({ revalidated: true, paths: uniquePaths });
  } catch (error) {
    console.error('Revalidate API error:', error);
    return NextResponse.json({ revalidated: false }, { status: 500 });
  }
}
