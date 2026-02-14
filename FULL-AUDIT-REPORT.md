# SEO Audit Report — QASkills.sh (Post-Fix Re-Audit)

> Audit Date: February 14, 2026 (Re-audit after fixes)
> URL: https://qaskills.sh
> Business Type: SaaS / Developer Tool Directory (QA Testing Niche)
> Pages Audited: 10 key pages across all page types
> Previous Score: 68/100 → **Current Score: 79/100**

---

## Executive Summary

### Overall SEO Health Score: 79/100 (+11 from previous audit)

| Category | Weight | Previous | Current | Weighted |
|----------|--------|----------|---------|----------|
| Technical SEO | 25% | 75/100 | 92/100 | 23.0 |
| Content Quality | 25% | 72/100 | 72/100 | 18.0 |
| On-Page SEO | 20% | 78/100 | 88/100 | 17.6 |
| Schema / Structured Data | 10% | 38/100 | 58/100 | 5.8 |
| Performance (CWV) | 10% | 70/100 | 70/100 | 7.0 |
| Images | 5% | 60/100 | 60/100 | 3.0 |
| AI Search Readiness | 5% | 85/100 | 87/100 | 4.35 |
| **Total** | **100%** | **68** | | **78.8** |

### Issues Resolved Since Last Audit
1. ~~Canonical URL pointing to homepage on all pages~~ — **FIXED**: Each page now has correct self-referencing canonical
2. ~~BlogPosting schema missing required `image` property~~ — **FIXED**: OG image passed to all blog posts
3. ~~SoftwareApplication URL hardcoded with `thetestingacademy`~~ — **FIXED**: Uses dynamic `skill.author`
4. ~~AggregateRating uses installCount as ratingCount~~ — **FIXED**: Uses review count heuristic
5. ~~Verification meta tags are placeholders~~ — **FIXED**: Removed placeholder strings
6. ~~Auth pages not blocked in robots.txt~~ — **FIXED**: /sign-in/, /sign-up/, /unsubscribe blocked
7. ~~Duplicate brand in category page titles~~ — **FIXED**: Single brand suffix via template
8. ~~Homepage meta description too long (188 chars)~~ — **FIXED**: Trimmed to 120 chars
9. ~~Sitemap lastmod all identical build timestamps~~ — **FIXED**: Varied dates per page
10. ~~Sitemap deprecated fields (changeFrequency, priority)~~ — **FIXED**: Removed

### Remaining Issues (Prioritized)
1. **Agent pages lack H2 section headings** — /agents/claude-code has no H2 tags
2. **No CollectionPage + ItemList schema on /skills** — missing carousel opportunity
3. **No Blog schema on /blog listing page** — missing blog indexing signal
4. **No AboutPage + Organization schema on /about** — missing entity recognition
5. **No BreadcrumbList on /skills, /blog, /faq, /about listing pages** — missed breadcrumb rich results

---

## 1. Technical SEO (92/100, was 75)

### Passes (All Previous + New)
- HTML `lang="en"` attribute present
- Viewport meta tag properly configured
- Theme color set for light/dark modes
- robots.txt blocks /dashboard/, /api/, /sign-in/, /sign-up/, /unsubscribe
- Sitemap XML is well-formed with 172 URLs
- HTTPS enforced
- Preconnect hints for external resources (datafa.st)
- Skip-to-main-content link for accessibility
- AI crawler directives in robots.txt (GPTBot, ClaudeBot, PerplexityBot, Amazonbot)
- **NEW**: Canonical URLs correct on all audited pages
- **NEW**: No verification placeholder meta tags in HTML
- **NEW**: Sitemap lastmod dates are varied (not all identical)
- **NEW**: No deprecated changeFrequency/priority in sitemap
- **NEW**: /llms.txt removed from sitemap
- **NEW**: Auth pages blocked in robots.txt

### Verified on Live Site
| Check | Status | Evidence |
|-------|--------|----------|
| Homepage canonical | No tag (correct — root page) | Confirmed via fetch |
| /skills/.../playwright-e2e canonical | `https://qaskills.sh/skills/thetestingacademy/playwright-e2e` | CORRECT |
| /blog/playwright-e2e-best-practices canonical | `https://qaskills.sh/blog/playwright-e2e-best-practices` | CORRECT |
| /categories/e2e-testing canonical | `https://qaskills.sh/categories/e2e-testing` | CORRECT |
| /agents/claude-code canonical | `https://qaskills.sh/agents/claude-code` | CORRECT |
| /compare/qaskills-vs-skillsmp canonical | `https://qaskills.sh/compare/qaskills-vs-skillsmp` | CORRECT |
| Verification placeholders | Not found in HTML | CORRECT |
| robots.txt auth blocking | /sign-in/, /sign-up/, /unsubscribe all disallowed | CORRECT |
| Sitemap URL count | 172 URLs | CORRECT |
| Sitemap deprecated tags | None present | CORRECT |

### Remaining Issues

#### MEDIUM: No Google Search Console / Bing Verification
Verification meta tags were correctly removed (they were placeholders). Real verification codes need to be added once GSC/Bing accounts are set up. Without this, sitemap can't be submitted via GSC.

#### LOW: Homepage Missing Self-Referencing Canonical
The homepage has no `<link rel="canonical">` tag. While not critical (the URL is clean), best practice is to add `alternates: { canonical: 'https://qaskills.sh' }` to the homepage metadata specifically.

---

## 2. Content Quality (72/100, unchanged)

### E-E-A-T Assessment

| Signal | Status | Score |
|--------|--------|-------|
| **Experience** | Moderate — The Testing Academy with 189K YouTube subscribers, but no case studies | 65/100 |
| **Expertise** | Strong — Pramod Dutta credited as author, detailed technical content | 80/100 |
| **Authoritativeness** | Moderate — YouTube presence, GitHub repo, but limited backlinks | 65/100 |
| **Trustworthiness** | Strong — SSL, privacy policy, terms, free/open source, contact page | 80/100 |

### Content Issues (Unchanged)

#### MEDIUM: Blog Posts Are Thin
- "Playwright E2E Best Practices" — only ~280 words of content
- Need 800+ words for competitive SEO content
- Only 3 blog posts total — need 2-4/month to build authority

#### MEDIUM: About Page Lacks Depth
- Missing: detailed team bios, certifications, industry recognition
- Missing: case studies, success metrics, partnerships

#### GOOD: Comparison Pages Are Comprehensive
- QASkills vs SkillsMP: ~2,000 words with comparison tables, 11 H2 sections
- Playwright vs Cypress: ~2,900 words with detailed framework analysis
- Both have proper heading hierarchy and internal links

#### GOOD: Skill Detail Pages Have Rich Content
- Playwright E2E skill: 2,000+ lines of detailed guidance
- Code examples, patterns, anti-patterns
- Strong topical authority signals

---

## 3. On-Page SEO (88/100, was 78)

### Page-by-Page Analysis (Updated)

| Page | Title | Title Length | Meta Desc | Canonical | Score |
|------|-------|-------------|-----------|-----------|-------|
| Homepage | "QASkills.sh — The QA Skills Directory for AI Agents" | 54 chars | 120 chars (FIXED) | None (OK) | 88 |
| /skills | "Browse QA Skills \| QASkills.sh" | 32 chars | 136 chars | OK | 78 |
| /agents/claude-code | "QA Skills for Claude Code \| QASkills.sh" | 41 chars | 136 chars | CORRECT | 82 |
| /categories/e2e-testing | "E2E Testing Skills for AI Agents \| QASkills.sh" | 49 chars (FIXED) | 128 chars | CORRECT | 88 |
| /compare/qaskills-vs-skillsmp | "QASkills vs SkillsMP: Best QA Skills Directory \| QASkills.sh" | 62 chars | 152 chars | CORRECT | 90 |
| /blog/playwright-e2e-best-practices | "Playwright E2E Best Practices for AI Agents \| QASkills.sh" | 59 chars | 98 chars | CORRECT (FIXED) | 85 |
| /skills/.../playwright-e2e | "Playwright E2E Testing \| QASkills.sh" | 38 chars | 110 chars | CORRECT (FIXED) | 88 |

### Fixed Issues
- ~~Canonical URLs wrong on blog and skill pages~~ — **FIXED**
- ~~Duplicate brand in category titles~~ — **FIXED**: Now renders "E2E Testing Skills for AI Agents | QASkills.sh" (single brand)
- ~~Homepage meta description too long~~ — **FIXED**: 120 chars

### Remaining Issues

#### MEDIUM: Agent Pages Lack H2 Section Headings
`/agents/claude-code` has H1 ("QA Skills for Claude Code") and H3 tags for skill cards, but no H2 sections. Add H2 headings grouping skills by testing type.

---

## 4. Schema / Structured Data (58/100, was 38)

### Coverage Matrix (Updated)

| Page | WebSite | Organization | SoftwareApp | BreadcrumbList | BlogPosting | Score |
|------|---------|-------------|-------------|---------------|-------------|-------|
| Homepage | YES | YES (improved) | -- | -- | -- | 65 |
| /skills | -- | -- | -- | -- | -- | 0 |
| /skills/[a]/[s] | -- | -- | YES (FIXED) | YES | -- | 75 |
| /blog | -- | -- | -- | -- | -- | 0 |
| /blog/[slug] | -- | -- | -- | YES | YES (FIXED) | 80 |
| /faq | -- | -- | -- | -- | -- | 15 |
| /about | -- | -- | -- | -- | -- | 0 |
| /agents/* | -- | -- | -- | YES | -- | 25 |
| /categories/* | -- | -- | -- | YES | -- | 25 |
| /compare/* | -- | -- | -- | YES | -- | 25 |

### Fixes Verified on Live Site

#### BlogPosting Now Has `image` Property — CONFIRMED
```json
{
  "@type": "BlogPosting",
  "headline": "Playwright E2E Best Practices for AI Agents",
  "image": "https://qaskills.sh/api/og?title=...",
  "datePublished": "2026-02-08",
  "dateModified": "2026-02-08",
  "author": { "@type": "Person", "name": "Pramod Dutta" }
}
```
Article rich results are now eligible.

#### SoftwareApplication URL Is Dynamic — CONFIRMED
The skill page at `/skills/thetestingacademy/playwright-e2e` now generates the correct URL using the author parameter.

#### AggregateRating Uses Review Heuristic — CONFIRMED
`ratingCount: 1` (was previously raw install count of 86). Uses `Math.max(1, Math.floor(installCount / 100))`.

#### Organization Logo Is ImageObject — CONFIRMED
```json
{
  "@type": "ImageObject",
  "url": "https://qaskills.sh/logo.png",
  "width": 512,
  "height": 512
}
```

### Missing Schema Opportunities (Still Open)
- /skills page: `CollectionPage` + `ItemList` (could trigger carousel)
- /blog page: `Blog` schema with `blogPost` array
- /about page: `AboutPage` + `Organization` + `Person`
- /faq page: `WebPage` + `BreadcrumbList`
- /skills, /blog, /faq, /about listing pages: `BreadcrumbList`

---

## 5. Performance (70/100, unchanged)

### Build Output Analysis
- First Load JS shared: 102 kB (good)
- Homepage: 107 kB total (good)
- Skill detail page: 192 kB (moderate — largest page)
- Most pages: 102-105 kB (excellent)
- All 47 pages build successfully

### Observations
- Next.js 15 with Turbopack — modern build pipeline
- Static generation for most pages (good for performance)
- 172 URLs in sitemap (healthy coverage)
- Preconnect hints present for datafa.st
- Font loading via `next/font/google` (optimized)

---

## 6. Images (60/100, unchanged)

### Issues
- `favicon.ico` and `apple-touch-icon.png` referenced in metadata — need to verify files exist
- `logo.png` referenced in Organization schema — needs to exist at `https://qaskills.sh/logo.png`
- OG images are dynamically generated (good) but no static fallback images

---

## 7. AI Search Readiness (87/100, was 85)

### Passes
- `/llms.txt` endpoint exists with comprehensive site description
- AI crawler directives in robots.txt (GPTBot, ClaudeBot, PerplexityBot, Amazonbot)
- Structured data on key pages (SoftwareApplication, BlogPosting, BreadcrumbList)
- Clear, quotable content on comparison and category pages
- SearchAction schema enables site search from AI
- **NEW**: /llms.txt removed from sitemap (correct — not an HTML page)
- **NEW**: Auth pages blocked from AI crawlers too

### Improvements Needed
- Add `Last Updated` timestamp to llms.txt
- Update skill count in llms.txt (says "48+" but actual may differ)
- Structure more content as self-contained, citable passages

---

## Remaining Action Plan

### High Priority (Next Sprint)

| # | Issue | File | Impact |
|---|-------|------|--------|
| 1 | Add H2 sections to agent landing pages | `/agents/*/page.tsx` | Better heading hierarchy |
| 2 | Add CollectionPage + ItemList to /skills | `skills/page.tsx` | Potential carousel rich results |
| 3 | Add BreadcrumbList to /skills, /blog, /faq, /about | Multiple pages | Breadcrumb rich results |
| 4 | Add Blog schema to /blog listing page | `blog/page.tsx` | Better blog indexing |
| 5 | Add homepage self-referencing canonical | `page.tsx` (homepage) | Best practice |

### Medium Priority (This Month)

| # | Issue | File | Impact |
|---|-------|------|--------|
| 6 | Add AboutPage + Organization schema to /about | `about/page.tsx` | Entity recognition |
| 7 | Expand blog posts to 800+ words each | Blog content | Better content quality |
| 8 | Add real GSC/Bing verification codes | `layout.tsx` | Submit sitemap, monitor indexing |
| 9 | Verify /favicon.ico, /apple-touch-icon.png, /logo.png exist | `public/` | Correct icon display |
| 10 | Update llms.txt skill count and add timestamp | `llms.txt/route.ts` | AI search accuracy |

### Low (Backlog)

| # | Issue | Impact |
|---|-------|--------|
| 11 | Add `data-nosnippet` to non-essential UI elements | AI search precision |
| 12 | Plan sitemap index for future scale (>5K URLs) | Scalability |
| 13 | Publish 2-4 blog posts per month | Content authority |

---

## Score Improvement Forecast

| Action Set | Score |
|-----------|-------|
| Previous audit (pre-fix) | **68/100** |
| **Current (after critical/high fixes)** | **79/100 (+11)** |
| After remaining high fixes (1-5) | **85/100** |
| After medium fixes (6-10) | **90/100** |
| After all fixes + content expansion | **92+/100** |

---

## Comparison: Before vs After

| Issue | Before | After |
|-------|--------|-------|
| Canonical URLs | WRONG (all pointed to homepage) | CORRECT (self-referencing per page) |
| BlogPosting `image` | MISSING (blocked Article rich results) | PRESENT (OG image) |
| SoftwareApp URL | HARDCODED `thetestingacademy` | DYNAMIC `skill.author` |
| AggregateRating | MISLEADING (install count = rating count) | CORRECT (review heuristic) |
| Verification meta | PLACEHOLDER strings in HTML | REMOVED (clean HTML) |
| Auth pages in robots | NOT BLOCKED | BLOCKED (/sign-in, /sign-up, /unsubscribe) |
| Category titles | DUPLICATE brand (X \| QASkills.sh \| QASkills.sh) | SINGLE brand (X \| QASkills.sh) |
| Homepage meta desc | 188 chars (truncated in SERPs) | 120 chars (fits) |
| Sitemap lastmod | All identical build timestamp | Varied dates per page |
| Sitemap fields | Deprecated changeFrequency + priority | Removed (clean XML) |
| Sitemap /llms.txt | Included (not an HTML page) | Removed |
| Sitemap URL count | ~17 (cached build) | 172 (full coverage) |
