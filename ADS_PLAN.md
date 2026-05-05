# Google AdSense Implementation Plan

Plan for adding Google AdSense to the Indonesian salary calculator. Follow
top-to-bottom; each section's checkboxes are gating for the next.

> Branch: `feat/adsense` (create from `main` before starting).

---

## 0. Decisions to lock in first

- [ ] **Deploy target chosen** (Vercel / Netlify / Cloudflare Pages / GitHub Pages).
- [ ] **Custom domain registered and pointed at the deploy target.**
      AdSense approval is materially smoother on a real domain than on a
      `*.vercel.app` / `*.github.io` subdomain.
- [ ] **CMP (Consent Management Platform) chosen** for EEA/UK/Swiss traffic.
      Default recommendation: Google's own **Funding Choices** (free, integrates
      directly with AdSense). Alternative: Cookiebot, Iubenda.
- [ ] **AdSense publisher ID obtained** (`ca-pub-XXXXXXXXXXXXXXXX`) by signing up
      at https://adsense.google.com.

Do not start section 1 until all four boxes are ticked. Code without a domain
and a publisher ID is wasted code.

---

## 1. Content & policy prep (required for approval)

AdSense rejects "low-value content" sites. The current app is a single-screen
calculator; we need to thicken it before submitting for review.

- [ ] **Privacy Policy page.** New route or static `/privacy` page disclosing:
      AdSense usage, third-party cookies, DoubleClick DART cookie, IP-based
      ad targeting, opt-out links (`https://www.google.com/settings/ads`,
      `http://www.aboutads.info`).
- [ ] **About / Methodology page** explaining the TER calculation, PMK 168/2023
      categories, and BPJS rates. Repurpose `SPEC.md` content. Target ~600+ words.
- [ ] **Footer disclaimer copy update** (`src/components/Footer.tsx`,
      `src/i18n/translations.ts`):
  - [ ] Remove or qualify the "No data leaves the browser" line in `README.md`
        — once AdSense loads, that's no longer strictly true.
  - [ ] Add Privacy Policy link in both `id` and `en` translations.
- [ ] **`ads.txt` file** at site root. Create `public/ads.txt` so Vite copies it
      to `dist/ads.txt`. Contents:
      ```
      google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
      ```

---

## 2. AdSense loader & verification

- [ ] **Add loader script to `index.html` `<head>`:**
      ```html
      <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossorigin>
      <meta name="google-adsense-account" content="ca-pub-XXXXXXXXXXXXXXXX">
      <script async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
        crossorigin="anonymous"></script>
      ```
- [ ] **Move the publisher ID to an env var** so the dev build doesn't load real
      ads. Use `import.meta.env.VITE_ADSENSE_CLIENT` and inject via a small
      script in `main.tsx`, or use a Vite HTML transform plugin. Keep dev empty.
- [ ] **Deploy to production.** AdSense's crawler must reach the live URL with
      the script tag present.
- [ ] **Submit site for review** in the AdSense console. Wait for verdict
      (days to weeks). All work below this line can ship before approval — the
      `<ins>` tags will simply render empty until the account is live.

---

## 3. CMP integration (EEA/UK/Swiss compliance)

Google requires a certified CMP for these regions. Without it, EU traffic
serves no personalised ads and may serve none at all.

- [ ] **Enable Funding Choices** in the AdSense console (or install chosen CMP).
- [ ] **Add CMP loader snippet** to `index.html`. Funding Choices ships its own
      `<script>` tag; paste it before the AdSense loader.
- [ ] **Verify** that the consent banner shows for EEA IPs (use a VPN) and that
      consent state persists across reloads.
- [ ] **TCF v2.2 signal** is sent to AdSense automatically by Funding Choices —
      no extra code needed, just verify in browser DevTools that
      `window.__tcfapi` exists post-consent.

---

## 4. `<AdSlot>` component

Single reusable component, manual placement (no Auto Ads — Auto Ads inject
slots without our control and can break the calculator's layout).

- [ ] **Add type declaration** `src/types/ads.d.ts`:
      ```ts
      declare global {
        interface Window {
          adsbygoogle: unknown[];
        }
      }
      export {};
      ```
- [ ] **Create `src/components/AdSlot.tsx`:**
      ```tsx
      import { useEffect, useRef } from 'react';

      interface AdSlotProps {
        slot: string;            // ad unit ID from AdSense console
        format?: string;         // e.g. 'auto', 'fluid'
        layout?: string;         // for in-article/in-feed
        className?: string;
        responsive?: boolean;
      }

      const CLIENT = import.meta.env.VITE_ADSENSE_CLIENT;

      export function AdSlot({ slot, format = 'auto', layout, className, responsive = true }: AdSlotProps) {
        const pushed = useRef(false);

        useEffect(() => {
          if (pushed.current) return;
          if (!CLIENT) return;             // dev / no client id
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            pushed.current = true;
          } catch {
            // adsbygoogle not loaded yet (adblock, network) — fail silent
          }
        }, []);

        if (!CLIENT) return null;

        return (
          <ins
            className={`adsbygoogle block ${className ?? ''}`}
            style={{ display: 'block' }}
            data-ad-client={CLIENT}
            data-ad-slot={slot}
            data-ad-format={format}
            {...(layout ? { 'data-ad-layout': layout } : {})}
            {...(responsive ? { 'data-full-width-responsive': 'true' } : {})}
          />
        );
      }
      ```
- [ ] **Strict-mode safety:** the `pushed` ref guards against React 18's double
      `useEffect` invocation, which would otherwise log "All ins tags must have
      data-ad-client and data-ad-slot" warnings.

---

## 5. Placements in `App.tsx`

Goal: revenue without disrupting the calculator. Layout shift on every
keystroke would be both bad UX and an AdSense policy risk.

- [ ] **Slot 1 — below the calculator card, above the footer.** Horizontal
      responsive unit. Renders once, doesn't shift on input.
      ```tsx
      <AdSlot slot="1111111111" />
      ```
- [ ] **Slot 2 — empty-state panel.** When `gross === 0`, the right column is a
      grey "enter a salary" placeholder. Replace or augment with an ad.
      Disappears once results render — acceptable, the user is now engaged.
      ```tsx
      {gross === 0 ? (
        <>
          <div className="bg-gray-100 ...">{t('emptyState')}</div>
          <AdSlot slot="2222222222" className="mt-4" />
        </>
      ) : (
        <BreakdownDisplay ... />
      )}
      ```
- [ ] **Do NOT place ads inside `<BreakdownDisplay />`** — it re-renders on every
      `gross` change, and ads inside reactive panels both look broken and risk
      a "ads in unexpected places" policy strike.
- [ ] **Mobile check:** on the `md:` breakpoint, the two-column grid stacks.
      Verify both slots still render without overlap and that ads don't push
      the form below the fold on a 375px viewport.

---

## 6. Performance & hygiene

- [ ] **Lighthouse before/after.** Capture `npm run build && npm run preview`
      Lighthouse scores pre- and post-AdSense. AdSense typically costs 5–15
      points on Performance; budget for it.
- [ ] **Lazy-mount option:** if Lighthouse drops too far, wrap `<AdSlot>` in an
      `IntersectionObserver` so the script only initialises when the slot
      scrolls into view. Skip for now; revisit only if scores tank.
- [ ] **CLS:** give every slot a `min-height` matching the typical fill size
      (e.g. 100px for horizontal, 250px for medium rectangle) to prevent
      cumulative layout shift when the ad finally loads.

---

## 7. Verification & launch

- [ ] **Test mode first:** add `data-adtest="on"` to `<ins>` while developing
      against a live (approved) account to avoid invalid-traffic strikes.
      Remove before final deploy.
- [ ] **Never click your own ads.** AdSense bans accounts for self-clicks,
      including accidental dev-tool clicks.
- [ ] **Verify `ads.txt`** is reachable at `https://yourdomain.tld/ads.txt`
      after deploy. AdSense console will warn if missing.
- [ ] **Verify CMP banner** appears for an EEA IP and that consent choice is
      respected by AdSense (check Network tab for personalised vs
      non-personalised ad requests).
- [ ] **Confirm Privacy Policy** is linked from the footer on every page and
      mentions AdSense by name.

---

## 8. Out of scope (for now)

- **Auto Ads** — gives Google free rein to inject; revisit only if manual
      placements underperform.
- **Header bidding / Ad Manager** — premium-publisher tooling, not worth it
      for expected traffic.
- **AMP** — not worth introducing; the SPA already loads fast enough.
- **A/B testing slot positions** — defer until there's enough traffic to draw
      conclusions (>10k sessions/month).

---

## 9. Risks & open questions

- **Approval risk.** If AdSense rejects for "low-value content," the fix is
  more written content (About, methodology, blog posts on Indonesian payroll
  topics), not more code.
- **Brand tension.** README's privacy framing weakens once ads load. Decide
  whether to lean into "free because ad-supported" or quietly soften the
  language.
- **Adblock prevalence.** Tech-savvy Indonesian users have high adblock
  adoption; expected fill rate may be lower than the global average. Don't
  build revenue projections on this alone.
- **Revenue floor.** A niche calculator at modest traffic likely earns
  single-digit USD/month. If that's not worth the privacy/UX cost, scrap the
  plan and add a "Buy me a coffee" button instead.
