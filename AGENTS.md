# omux.xoxd.ai — Agent Instructions

`omux.xoxd.ai` is the public marketing and devtool surface for the
`oauth-mux` FOSS project (canonical source: `Jesssullivan/oauth-mux`). It is
a static-first SvelteKit application targeting GitHub Pages with custom
domain `omux.xoxd.ai`. The repo lives at `tinyland-inc/omux.xoxd.ai` and is
GitHub `INTERNAL` pre-launch.

The site is a Bazel module-catalog consumer of `tinyland-inc/bazel-registry`
from M0. Bazel is registered for graph integrity proofs; `pnpm run build`
remains the canonical site build path until/unless Bazel owns a hermetic
build target.

## Source Of Truth Hierarchy

1. `docs/spec/omux-website-bootstrap-2026-04-29.md` — the authoritative
   bootstrap design record. Revise in place; new dated spec only when the
   topic genuinely changes.
2. `AGENTS.md` (this file) — the agent contract.
3. `Justfile` — operator entrypoint.
4. `flake.nix` + `.envrc` — reproducible dev shell.
5. `MODULE.bazel` + `.bazelrc` — Bazel consumer chain to the registry.
6. `package.json` — npm/pnpm dep manifest.
7. `src/` — implementation.

Linear ticket `TIN-734` is the umbrella for this work. The Linear project
"oauth-mux Website Launch (omux.xoxd.ai)" tracks M-1 through M5. Linear is
the execution source of truth; the GitHub Project v2 board is the public
contributor surface.

## Build

```bash
just setup     # pnpm install --frozen-lockfile
just dev       # vite dev
just build     # vite build → build/
just preview   # serve build/ locally
```

## Test

```bash
just check     # lint + typecheck + unit tests
just test      # unit + e2e
just test-unit # vitest run
just test-e2e  # playwright test
just ci        # full local CI parity
```

## Deploy

GitHub Pages with custom domain `omux.xoxd.ai`. CI lane lives at
`.github/workflows/deploy-pages.yml`. Pages source: `actions`. Custom
domain configured via the GitHub Pages REST API
(`gh api -X PUT repos/tinyland-inc/omux.xoxd.ai/pages -f cname=omux.xoxd.ai`).
DNS via Cloudflare — single CNAME record `omux` → `tinyland-inc.github.io`,
**gray-cloud (DNS-only — orange cloud breaks Let's Encrypt validation)**,
TTL 300. `static/CNAME` is a portability artifact only, not the source of
truth.

| Branch | Domain | Visibility | Notes |
|---|---|---|---|
| `main` | `https://omux.xoxd.ai` | public after M4 | PR builds verify; main pushes deploy |

`oauth-mux.xoxd.ai` redirects to `omux.xoxd.ai` via a Cloudflare Redirect
Rule (NOT a multi-CNAME GitHub Pages config) once the canonical domain is
healthy.

## Architecture

```
src/
  app.html, app.css, app.d.ts
  lib/
    components/   Svelte components (Skeleton 4 patterns)
    content/      build-time content + Effect Schema validation
    effect/       Effect 3.21 seed (runtime, schema)
    styles/       theme files (omux.css = Warm/Pragmatic OKLCH)
  routes/
    +layout.svelte, +layout.ts
    +page.svelte
docs/spec/        dated planning specs
static/           CNAME, .nojekyll, robots.txt
.github/          workflows, templates, CODEOWNERS
MODULE.bazel      Bazel consumer chain
.bazelrc          --registry chain (tinyland-inc → BCR)
flake.nix         Nix dev shell
Justfile          operator entrypoint
```

## Files Worth Knowing

- `docs/spec/omux-website-bootstrap-2026-04-29.md` — bootstrap design
  record, single source of truth for stack/milestone/SLA decisions.
- `MODULE.bazel`, `.bazelrc`, `BUILD.bazel`, `.bazelversion` — Bazel
  registry chain (`tinyland-inc/bazel-registry` → BCR).
- `flake.nix`, `.envrc` — Nix dev shell (Node 22, pnpm 10.13.1, just, gh,
  bazelisk, gitleaks).
- `Justfile` — operator entrypoint for every dev workflow.
- `vite.config.ts` — Vite 8 native + `skeletonTailwindV4Compat()` +
  `@tummycrypt/vite-plugin-skeleton-colors` + `@tailwindcss/vite`.
- `svelte.config.js` — `adapter-static` + Svelte 5 runes mode.
- `src/lib/styles/themes/omux.css` — Warm/Pragmatic OKLCH theme in
  Skeleton 4 house format.
- `src/lib/effect/{runtime,schema}.ts` — minimal Effect 3.21 seed
  (build-time only, never wraps Svelte runes state).
- `src/lib/content/providers.{json,schema.ts}` — provider matrix data +
  Effect Schema validation. Regen via `just regen-providers` from the
  oauth-mux source repo.

## House Pattern References

- `~/git/MassageIthaca` — Nix/just/Effect production reference.
- `~/git/jesssullivan.github.io-vite8` — Vite 8 + Skeleton 4 + Tailwind 4
  compatibility reference (the `skeletonTailwindV4Compat` shim + plugin
  pipeline).
- `~/git/jesssullivan.github.io` — canonical FOSS GitHub-Pages reference
  (deploy-pages.yml shape, Justfile structure).
- `~/git/elders.tinyland.dev` — canonical Bazel-registry consumer reference
  (`MODULE.bazel`, `.bazelrc` two-registry chain).
- `~/git/pkgs.tinyland.dev` — Pages-deploy precedent + Tinyland v4 brand
  theme reference.
- `~/git/ci-templates` — `tinyland-inc/ci-templates` reusable composite
  actions (`nix-setup`, `secrets-scan`).

## Guardrails

- Do not vendor `oauth-mux` source or duplicate provider lists; pull at
  build time via `just regen-providers`.
- Do not commit `.env`, `.env.local`, secrets, or credentials.
- Do not propose Skeleton v5, Effect 4-beta, or other prerelease upgrades
  as M0-M4 stack choices. The founding prompt names Skeleton 4.15.2 as the
  house baseline. v5 is a post-launch watch item only.
- Do not bypass the M-1 milestone (project management bootstrap) before
  scaffolding implementation work.
- Do not enable Cloudflare proxy (orange cloud) on `omux.xoxd.ai` —
  GitHub Pages TLS provisioning requires direct DNS resolution.
- Do not push directly to `main`; use feature branches and PRs. Branch
  protection enforced via the GitHub branch-protection API after the first
  green CI run, and verified via API readback.
- Do not claim every `oauth-mux` provider is live-proven; only Codex is.
  Schema-modeled / planned tiers must be distinguished per the
  `oauth-mux/docs/spec/product-adoption-sprint-2026-04-28.md` guardrails.
- Do not auto-bump pinned versions (Skeleton `4.15.2` exact, pnpm
  `10.13.1` exact, TS `5.9.3` exact). Bump deliberately with a dedicated
  ticket and a regression check.
- Do not include AI attribution in commit messages, PR descriptions, or
  generated content.
