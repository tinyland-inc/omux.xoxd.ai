# Bazel Module Catalog Audit

Date: 2026-04-29

Issue context: Linear `TIN-763` (M-1.5 Audit Tinyland Bazel module catalog
and choose M0 catalog deps), child of `TIN-734`. GitHub
`tinyland-inc/omux.xoxd.ai`. Source registry: `tinyland-inc/bazel-registry`.

## Baseline

`omux.xoxd.ai` is a fresh static-first SvelteKit site under `tinyland-inc`,
bootstrapping as an independent Bazel module-catalog consumer of
`tinyland-inc/bazel-registry`. The founding prompt is explicit that Bazel
must be a real consumer from M0, not decorative. This audit answers the
M-1.5 question: which catalog modules should omux's `MODULE.bazel` declare?

The reference consumer is `elders.tinyland.dev`
(`/Users/jess/git/elders.tinyland.dev/MODULE.bazel`), which depends on
`tummycrypt_tinyland_auth@0.3.0`, `auth_pg@0.2.4` (declared as 0.2.3 in
elders, lock resolves to 0.2.2 — minor lockfile lag), `rate_limit@0.3.0`,
`security@0.3.1`, `tinyvectors@0.2.5` via the two-registry chain
`https://raw.githubusercontent.com/tinyland-inc/bazel-registry/main/` →
`https://bcr.bazel.build`. The elders pattern is the template; the picks
diverge because elders is a SSR/Node app with auth and rate-limit needs,
while omux is pure-static and front-end-only.

## Inventory Summary

The registry currently holds **58 active modules** under `modules/`,
all `tummycrypt_*` scoped, all `compatibility_level = 1`. Toolchain pinning
is consistent across nearly all modules: `aspect_bazel_lib 2.22.5`,
`aspect_rules_js 2.9.1`, `aspect_rules_ts 3.8.4`, `bazel_skylib 1.8.2`,
`platforms 1.0.0`, `rules_nodejs 6.7.3`, Node 22.13.1, pnpm 10.13.1,
TS 5.9.3.

**One toolchain skew**: `tummycrypt_tinyvectors@0.2.5` pins pnpm 9.15.9
(vs registry-wide 10.13.1). Single-module build is fine; mixing with a
pnpm-10 module in the same Bazel workspace works via per-module
`npm_translate_lock` repos.

## Verification Results

| Check | Pass | Fail | Notes |
|---|---|---|---|
| Source archive HEAD reachable (302 → 200) | **51 / 58** | 7 | Failures are PRIVATE GitHub repos under `tinyland-inc/*` |
| npm package published | **58 / 58** | 0 | All publish to `@tummycrypt/<repo-name>` scope |
| Bazel-latest == npm-latest | **58 / 58** | 0 | Perfect parity across the registry |
| `npm.npm_translate_lock(name = "npm")` collision | **0 / 58** | — | Zero collision risk; 27 use `<module>_npm`, 31 declare no `npm_translate_lock` |

The 7 modules whose archives 404 reference private `tinyland-inc/*`
repositories (verified via `gh api repos/tinyland-inc/<r>` returning
`private: true`). They are listed in the public registry but a Bazel build
that depends on them will fail at the source-fetch step. They cannot be
M0 picks for a public/CI consumer like omux. See § Registry Hygiene
Findings below.

## Candidate Deep Dive

Eight candidates were deep-walked for omux M0 fit. Compatibility is
checked against the omux stack: Skeleton 4.15.2 + Tailwind 4 + Svelte 5.55+
+ Vite 8 + Effect 3.21 + adapter-static (no SSR runtime).

### 1. `tummycrypt_tinyland_color_utils@0.2.3` — RECOMMENDED PRIMARY

- **Source**: `https://github.com/tinyland-inc/tinyland-color-utils/archive/refs/tags/v0.2.3.tar.gz`
  (sha256 `DgMPy3AkDSYp4O8faNhKDK+aylsRSAaLKsFnPIXiYQs=`). Archive 302→200.
- **npm**: `@tummycrypt/tinyland-color-utils@0.2.3` published 2026-04-28.
  **Zero runtime deps, zero peer deps.** Three exports: `.`, `./types`,
  `./cache`. Property-based test coverage via `fast-check`.
- **Surface**: `parseColor`, `parseHex/Rgb/Hsl/Oklch/Oklab`, conversions
  (`rgbToOklch`, `oklchToRgb`, `oklchToOklab`, etc.), contrast utilities
  (`getContrastRatio`, `WCAGLevel`, `ContrastResult`), pure types. No DOM,
  no Svelte, no Vite, no Skeleton coupling.
- **`@npm` naming**: `tummycrypt_tinyland_color_utils_npm` ✓ safe.
- **Compat**: Skeleton 4 ✓, Tailwind 4 ✓, Svelte 5 ✓, Vite 8 ✓, Effect ✓
  (orthogonal), Static ✓.
- **Effort**: ~0.5 hour. `bazel_dep` + npm dep + import in
  `src/lib/theme/contrast-check.ts` (or wherever omux wants a brand-color
  contrast badge / build-time assertion).
- **Verdict**: **GO.** Lowest-risk leaf module in the catalog. Acts as
  the **runtime** dep that proves omux actually consumes a registry module
  rather than just declaring a build-tool plugin.

### 2. `tummycrypt_vite_plugin_a11y@0.2.2` — RECOMMENDED SECONDARY (build-tool)

- **Source**: `https://github.com/tinyland-inc/vite-plugin-a11y/archive/refs/tags/v0.2.2.tar.gz`
  (sha256 `7Ek2comJXMzKJGb+u9HIXSN6PgRWLbfzC61Ql/xL35g=`). Archive 302→200.
- **npm**: `@tummycrypt/vite-plugin-a11y@0.2.2` published 2026-04-21.
  Runtime dep: `magic-string ^0.30.0`. Peer deps: `svelte ^4 || ^5`,
  `vite ^5 || ^6 || ^7 || ^8`. **Vite 8 + Svelte 5 explicitly covered.**
- **Surface**: Vite plugin (`enforce: 'pre'`) with a `transform()` hook on
  `.svelte` files. Build-time WCAG contrast check on every Svelte component.
  Default config gates on `process.env.NODE_ENV === 'production'`.
- **`@npm` naming**: N/A (no `npm.npm_translate_lock` block — module
  produces no node_modules tree of its own).
- **Compat**: Build-time only. Skeleton 4 orthogonal. All omux stack ✓.
- **Effort**: ~1 hour. `bazel_dep` + npm dep + add to
  `vite.config.ts` plugins array.
- **Verdict**: **GO.** Best-in-class build-time M0 candidate. Exercises
  the registry, ships build-time value (a11y safety net on every
  component), zero runtime weight.

### 3. `tummycrypt_vite_plugin_skeleton_colors@0.2.2` — RECOMMENDED TERTIARY (Skeleton-specific)

- **Source**: `https://github.com/tinyland-inc/vite-plugin-skeleton-colors/archive/refs/tags/v0.2.2.tar.gz`
  (sha256 `2FvyYqRyJ2wnJHmCHqLBej81W2I7ebE8KMhriWRPmFM=`). Archive 302→200.
- **npm**: `@tummycrypt/vite-plugin-skeleton-colors@0.2.2` published
  2026-04-21. **Zero runtime deps.** Peer dep: `vite ^5 || ^6 || ^7 || ^8`.
  Description: *"Vite plugin for Skeleton v4 color pairing utilities"*.
- **Surface**: Vite plugin (`enforce: 'pre'`) + virtual module
  (`virtual:skeleton-colors`) that scans `.svelte/.html/.jsx/.tsx` source
  files for color-pair utility classes (`bg-surface-200-800`, etc.) and
  generates the corresponding CSS on-demand. **Skeleton-v4-specific** by
  design.
- **`@npm` naming**: N/A (no `npm_translate_lock`).
- **Compat**: Skeleton 4.15.2 ✓ (designed for it), Tailwind 4 ✓, Vite 8 ✓.
  Note: this plugin is Skeleton-v4-aware; **omux's choice to ship on
  Skeleton 4.15.2 (not v5) makes the plugin directly relevant**. Skeleton v5
  ships color-pair tokens natively via `light-dark()`, which would
  obsolete this plugin — but omux is on v4, so it is in the sweet spot.
- **Effort**: ~1.5 hours. `bazel_dep` + npm dep + register plugin in
  `vite.config.ts` + import virtual module from `src/app.css`.
- **Verdict**: **GO.** Direct precedent in `elders.tinyland.dev` (already
  using `^0.2.1`). Already named in the bootstrap spec § Stack Decision as
  part of the Skeleton-v4 + Tailwind-4 compatibility pattern.

### 4. `tummycrypt_tinyland_a11y_engine@0.2.3` — NO-GO M0

Runtime a11y orchestrator (`AccessibilityOrchestrator`,
`AccessibilityStream` with `EventEmitter`, sampling intervals). Requires a
live DOM and a streaming endpoint. Overkill for a static landing page;
defer to M1+ if omux grows into an authoring surface.

### 5. `tummycrypt_tinyland_a11y_logger@0.2.2` — NO-GO M0

Loki batch logger for a11y violations. Operationally coupled to
`a11y_engine` + a Grafana Loki endpoint omux doesn't have. Pointless
without the engine.

### 6. `tummycrypt_tinyland_types@0.2.3` — NO-GO M0

Pure type definitions for the Tinyland.dev platform's content surfaces
(blog, event, product, profile, ActivityPub UI, etc.). 22 deep exports.
omux has no overlapping domain types at M0 — would be a vanity import.

### 7. `tummycrypt_tinyland_schemas@0.2.3` — BLOCKED (private upstream)

Would be HIGH relevance (zod schemas for content/auth surfaces) but the
source repo `tinyland-inc/tinyland-schemas` is **private**, returning 404
unauthenticated. Bazel would fail the source-fetch step for any consumer.
Tracked under § Registry Hygiene Findings.

### 8. `tummycrypt_tinyland_composables@0.2.4` — SOFT NO-GO M0

Svelte 5 runes composables. Most are editor/authoring-oriented
(`useEditorQueue`, `useDraftPersistence`, `useViewportTextScanner`).
`useConsentState` could fit if omux ships a consent banner; otherwise
defer.

## Module Picks

omux M0 will declare three catalog modules:

```python
# in MODULE.bazel
bazel_dep(name = "tummycrypt_tinyland_color_utils",        version = "0.2.3")
bazel_dep(name = "tummycrypt_vite_plugin_a11y",            version = "0.2.2")
bazel_dep(name = "tummycrypt_vite_plugin_skeleton_colors", version = "0.2.2")
```

Cross-listed in `package.json` (so pnpm/Vite resolve the npm tarballs):

```json
{
  "dependencies": {
    "@tummycrypt/tinyland-color-utils": "0.2.3"
  },
  "devDependencies": {
    "@tummycrypt/vite-plugin-a11y": "0.2.2",
    "@tummycrypt/vite-plugin-skeleton-colors": "0.2.2"
  }
}
```

Pinned exact, no caret. Imports use the npm path
(`import { getContrastRatio } from '@tummycrypt/tinyland-color-utils'`),
never a Bazel label, matching the elders pattern.

**M0 acceptance** — TIN-763 closes when:
- All three modules declared in `MODULE.bazel`.
- All three cross-listed with exact versions in `package.json`.
- `bazel mod graph` succeeds with the registry chain
  (`https://raw.githubusercontent.com/tinyland-inc/bazel-registry/main/`
  → BCR).
- `color_utils` is imported in at least one `src/` location (smoke
  consumption — likely a brand-color contrast guard or theme-token
  validation).
- Both Vite plugins are wired into `vite.config.ts`.

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| pnpm version skew if mixing color_utils (10.13.1) with tinyvectors (9.15.9) | Low | Low | Skip tinyvectors at M0; per-module `_npm` repos isolate skew if needed later |
| `vite_plugin_a11y` runtime dep `magic-string` minor bumps | Low | Low | pnpm-locked at install time; dependabot will surface bumps |
| Skeleton v5 obsoletes `vite_plugin_skeleton_colors` natively | Medium (deferred) | Low | omux pins Skeleton 4.15.2 through M4; v5 upgrade is post-launch (TIN-788) |
| Module versions on registry advance before omux merges M0 | Medium | Low | All three pinned exact; bumps go through dedicated tickets |
| One of the three picks gets retracted from the registry | Very Low | High | Picks mirror or extend `elders.tinyland.dev`'s production usage; retraction would affect elders too |
| Registry chain unreachable from CI | Low | High | `bazel mod graph` is the M0.3 smoke gate; failures surface immediately |

## Registry Hygiene Findings

**Seven modules in the public registry have private upstream source
repos** that 404 unauthenticated. They are unbuildable from any
public/CI consumer:

| Module | Latest | Source repo (private) |
|---|---|---|
| `tummycrypt_tinyland_file_logger` | 0.2.2 | `tinyland-inc/tinyland-file-logger` |
| `tummycrypt_tinyland_publishing_hooks` | 0.2.2 | `tinyland-inc/tinyland-publishing-hooks` |
| `tummycrypt_tinyland_scheduled_publishing` | 0.2.2 | `tinyland-inc/tinyland-scheduled-publishing` |
| `tummycrypt_tinyland_schemas` | 0.2.3 | `tinyland-inc/tinyland-schemas` |
| `tummycrypt_tinyland_server_config` | 0.2.2 | `tinyland-inc/tinyland-server-config` |
| `tummycrypt_tinyland_server_utils` | 0.2.2 | `tinyland-inc/tinyland-server-utils` |
| `tummycrypt_tinyland_tracing_middleware` | 0.2.2 | `tinyland-inc/tinyland-tracing-middleware` |

This is a registry-side hygiene gap, not an omux concern. The npm
packages are published normally (so JS/TS consumers via pnpm work
fine), but the Bazel registry advertises tarball URLs that don't
resolve. Recommended follow-up:

- File a follow-up Linear ticket (separate from M-1.5) tracking the
  upstream repo visibility decision: either flip the seven repos
  public, or remove them from the public Bazel registry until they
  are.
- `_schemas` is the most painful loss for omux's potential M1+ work
  (would unlock zod schema reuse for any future authored content).

## Stage-1 Blessed Modules — Note

Round 1 found that the registry's own
`scripts/smoke-stage1-consumer-targets.mjs` blesses four modules:
`auth@0.3.0`, `auth_pg@0.2.4`, `security@0.3.1`, `rate_limit@0.3.0`. All
four are auth/rate-limit/backend-flavored and out of scope for omux M0.
elders.tinyland.dev consumes them directly. omux remains a fresh test of
*non*-Stage-1-blessed modules (color_utils, vite_plugin_a11y,
vite_plugin_skeleton_colors), which is itself useful evidence for the
registry's broader maturity.

## Follow-Up Work

1. Keep `docs/spec/omux-website-bootstrap-2026-04-29.md` § Bazel Consumer
   Pattern aligned with the locked-in three-module pick.
2. M0.3 (`TIN-766`) implementation can now proceed: write `MODULE.bazel`
   with the three `bazel_dep` lines + cross-list in `package.json`.
3. Add `bazel mod graph` smoke step to CI (M1.1, `TIN-770`).
4. File a separate Linear ticket for the seven-module registry hygiene
   gap. Recommended: a `TIN-7xx` issue under the Tinyland team labeled
   `internal` + `someday`.
5. Re-evaluate `_composables`, `_a11y_engine`, `_a11y_logger`, `_schemas`
   (if/when made public) at M5 dynamic-ready scaffolding.

## Sources To Keep Current

- This audit: `docs/spec/bazel-catalog-audit-2026-04-29.md` (revise in
  place if module picks change pre-M0; new dated audit if omux later
  adds material new modules).
- Bootstrap spec: `docs/spec/omux-website-bootstrap-2026-04-29.md` § Bazel
  Consumer Pattern (must be updated with the locked-in picks; this PR
  does that).
- Registry: `https://github.com/tinyland-inc/bazel-registry`.
- Reference consumer: `/Users/jess/git/elders.tinyland.dev/MODULE.bazel`,
  `/Users/jess/git/elders.tinyland.dev/.bazelrc`.
- Linear `TIN-763` (this audit), `TIN-766` (M0.3 — MODULE.bazel
  implementation), `TIN-770` (M1.1 — CI with `bazel mod graph` smoke).
