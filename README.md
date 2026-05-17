# omux.xoxd.ai

Source for [https://omux.xoxd.ai](https://omux.xoxd.ai), the marketing and
devtool surface for [`oauth-mux`](https://github.com/Jesssullivan/oauth-mux) —
agent auth and session resilience for professional AI harness accounts.

This repo ships the website only. The product source, CLI, and provider
runtime live at [`Jesssullivan/oauth-mux`](https://github.com/Jesssullivan/oauth-mux).

## Why a separate repo

- **Site/product separation.** The website ships at GitHub Pages cadence,
  independent of `oauth-mux` releases. A bad copy edit cannot brick the CLI;
  a CLI release cannot block a docs fix.
- **Pages-deployable static surface.** SvelteKit `adapter-static` →
  `build/` → GitHub Pages. No server runtime, no Vercel, no edge functions.
- **Contributor-friendly without exposing internals.** Provider matrix and
  copy live here. Probe semantics, secret backends, and daemon boundaries
  stay in `oauth-mux` and are pulled at build time.

## Stack

SvelteKit static-first + Skeleton 4.15.2 + Svelte 5 runes + Tailwind 4 +
Effect 3.21 + Vite 8 native + Bazel module-catalog consumer of
[`tinyland-inc/bazel-registry`](https://github.com/tinyland-inc/bazel-registry)
from M0.

`pnpm run build` remains the canonical GitHub Pages build. Bazel now owns
the bounded GloriousFlywheel RBE candidate surface for remote proof work:
`//:build`, `//:unit_tests`, `//:playwright_chromium_smoke`, and
`//:puppeteer_chromium_smoke`. These targets are product evidence for
cache-backed and REAPI-backed acceleration; they are not yet the default
deploy path and do not claim broad repo-wide web RBE.

Pinned versions are deliberate. Skeleton `4.15.2` exact, pnpm `10.13.1`
exact, TypeScript `5.9.3` exact. Bumps are dedicated tickets.

## Dev quickstart

Prerequisites: Nix with flakes, [direnv](https://direnv.net/),
[just](https://github.com/casey/just). Everything else (Node 22, pnpm
10.13.1, bazelisk, gh, gitleaks) ships through the Nix dev shell.

```bash
direnv allow      # load the Nix flake-based shell
just setup        # corepack enables pnpm@10.13.1, then pnpm install --frozen-lockfile
just dev          # SvelteKit dev server (Vite)
just check        # lint + typecheck + unit tests
just build        # static build → build/
just bazel-graph  # mod-catalog smoke (registry resolution proof)
```

`just info` prints the resolved tool versions. `just --list` enumerates the
full operator surface.

## GloriousFlywheel RBE candidates

The browser smoke targets use the GloriousFlywheel browser-runtime contract:
Chromium is supplied by the worker image through an explicit executable path
such as `GF_RBE_CHROMIUM_EXECUTABLE=/bin/chromium`. The repo uses
`puppeteer-core` for the Puppeteer target so the proof does not depend on
browser downloads from npm lifecycle hooks.

Current boundaries:

- `//:playwright_chromium_smoke` proves a static SvelteKit/Vite build plus
  Playwright Chromium smoke.
- `//:puppeteer_chromium_smoke` proves the same static output through
  Puppeteer Chromium once a GF REAPI proof run captures worker evidence.
- `//:unit_tests` proves the Vitest unit-test target class.

These targets do not prove full hosted Playwright suites, all Puppeteer
patterns, all Vite/Svelte projects, or default repo-wide RBE.

## Deploy

GitHub Actions deploys to GitHub Pages on push-to-`main`
(`.github/workflows/deploy-pages.yml`, Pages source `actions`). Custom
domain `omux.xoxd.ai` is configured via the GitHub Pages REST API; the
`static/CNAME` file is a portability artifact, not the source of truth.

DNS lives at Cloudflare: a single CNAME record `omux` →
`tinyland-inc.github.io`, **gray-cloud (DNS-only)**. Orange-cloud proxy
breaks Let's Encrypt validation, so TLS is GitHub-managed and the record
must resolve directly.

`oauth-mux.xoxd.ai` redirects to `omux.xoxd.ai` via a Cloudflare Redirect
Rule rather than a multi-CNAME Pages config.

## Status

Frame the launch state honestly:

- **Live-proven**: managed Codex launch/resume, native session authority bridge,
  root-partitioned config passthrough, and installed-runtime quota handoff.
- **Strongest proof**:
  `oauth-mux/docs/evidence/codex-engineered-quota-handoff-20260509/`.
- **Version truth**: public GitHub Release, npm, Homebrew, curl, and
  deb/rpm lanes resolve to `0.1.7`; source dogfood is only for unreleased
  checkout behavior.
- **Schema-modeled**: Anthropic, MCP, GitHub, Linear, Vercel, Figma, FlakeHub.
  Modeled in the provider matrix; not yet live-proven for stay-afloat.
- **Planned**: Bedrock, Azure.

This page does not claim every `oauth-mux` provider is live-proven. It
also does not claim same-thread provider continuity, mid-turn streaming
recovery, or unmanaged bare-Codex daemon hot-swap. See
[`src/lib/components/SecurityPosture.svelte`](src/lib/components/SecurityPosture.svelte)
for the verbatim guarantees pulled from `oauth-mux`.

## Contributing

- **Linear is the execution source of truth.** Project: `oauth-mux Website
  Launch (omux.xoxd.ai)`. Parent ticket: `TIN-734` (M-1 → M5).
- **GitHub Project v2** mirrors Linear status for public visibility.
- **Provider matrix updates.** Edit `src/lib/content/providers.json` and
  run `just regen-providers` from a sibling `oauth-mux` checkout. Changes
  validate against the Effect Schema in `src/lib/content/providers.schema.ts`.
- **PR conventions, branch protection, and the agent contract** live in
  [AGENTS.md](AGENTS.md). Read it before opening a PR.

The bootstrap design record at
[`docs/spec/omux-website-bootstrap-2026-04-29.md`](docs/spec/omux-website-bootstrap-2026-04-29.md)
is the durable reference for stack, milestones, and SLAs.

## Project links

- Site: [https://omux.xoxd.ai](https://omux.xoxd.ai)
- Product source: [github.com/Jesssullivan/oauth-mux](https://github.com/Jesssullivan/oauth-mux)
- npm: [npmjs.com/package/oauth-mux](https://www.npmjs.com/package/oauth-mux)
- Bazel registry: [github.com/tinyland-inc/bazel-registry](https://github.com/tinyland-inc/bazel-registry)
- License: MIT — see [LICENSE](LICENSE)
- Third-party attributions: [NOTICE](NOTICE)
- Security policy: [SECURITY.md](SECURITY.md)

---

A Jess Sullivan FOSS project built with Tinyland release infrastructure.
