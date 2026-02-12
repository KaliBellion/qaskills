'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AgentSelector } from './agent-selector';

const starterSkills = [
  { slug: 'playwright-e2e', name: 'Playwright E2E', types: ['e2e', 'web'], installs: '2.5K+' },
  { slug: 'cypress-e2e', name: 'Cypress E2E', types: ['e2e', 'web'], installs: '1.8K+' },
  { slug: 'playwright-api', name: 'Playwright API', types: ['api'], installs: '1.2K+' },
  { slug: 'axe-accessibility', name: 'Axe Accessibility', types: ['a11y'], installs: '950+' },
  { slug: 'k6-performance', name: 'K6 Performance', types: ['performance'], installs: '800+' },
  { slug: 'owasp-security', name: 'OWASP Security', types: ['security'], installs: '650+' },
];

export function SkillPicker() {
  const [selectedSkill, setSelectedSkill] = useState(starterSkills[0]);

  return (
    <div className="space-y-8">
      {/* Skill selection */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {starterSkills.map((skill) => (
          <button
            key={skill.slug}
            onClick={() => setSelectedSkill(skill)}
            className={cn(
              'rounded-lg border p-4 text-left transition-all duration-200',
              selectedSkill.slug === skill.slug
                ? 'border-primary bg-primary/10'
                : 'border-border bg-card hover:border-primary/30',
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <p className="font-medium">{skill.name}</p>
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{skill.installs}</span>
            </div>
            <div className="flex gap-1 flex-wrap">
              {skill.types.map((type) => (
                <Badge key={type} variant="secondary" className="text-xs">
                  {type}
                </Badge>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Agent selector with the chosen skill */}
      <AgentSelector selectedSkill={selectedSkill.slug} />
    </div>
  );
}
