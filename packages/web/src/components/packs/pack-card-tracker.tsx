'use client';

interface PackCardTrackerProps {
  packSlug: string;
  skillCount: number;
  featured: boolean;
  children: React.ReactNode;
}

export function PackCardTracker({
  packSlug,
  skillCount,
  featured,
  children,
}: PackCardTrackerProps) {
  return (
    <div
      onClick={() => {
        window?.datafast?.('pack_viewed', {
          pack_name: packSlug,
          skill_count: String(skillCount),
          featured: String(featured),
        });
      }}
    >
      {children}
    </div>
  );
}
