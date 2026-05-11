# oauth-mux

Agent auth and session resilience for professional AI harness accounts.

Project site: **https://omux.xoxd.ai** — the canonical reference for the
fallback algebra, provider matrix, security posture, and first-run
flows.

Source: https://github.com/Jesssullivan/oauth-mux

## What it is

Developers increasingly carry multiple personal, work, team,
subscription, and on-prem AI identities. Current CLIs often expose one
active account path. Losing focus to manual login/logout, profile
copying, and ambiguous 401/429 failures is the product pain.

oauth-mux wraps supported harnesses with route-state diagnostics,
managed auth/config overlays, and labeled fallback decisions. The goal
is to keep a harness session usable when auth, quota, tier, or local
runtime state changes, without hiding the evidence from operators.

## Install

```sh
npm install -g oauth-mux
```

Public npm, GitHub Release, Homebrew, curl, and package lanes currently
publish `0.1.6`. Source and local dogfood are `0.1.7` candidate.

## Codex first run

```sh
oauth-mux init --codex-max
oauth-mux doctor
oauth-mux route explain --profile codex-max --capability codex-max
oauth-mux codex resume
```

If upstream auth is stale, run the labeled handoff reported by route
explanation, such as `oauth-mux codex login-device max-3`.

## Provider availability

- **Live-proven: Codex.** Current evidence includes installed-runtime managed
  resume quota handoff: `codex:max-2` served successful traffic, then returned
  `usage_limit_reached`; oauth-mux retried the same buffered request on
  `codex:max-3`, and the fallback account returned `200`. Decision rows cover
  `live.available`, `live.quota_exhausted`, and the dead/degraded shapes.
  Same-thread provider continuity and mid-turn streaming recovery remain
  separate proof lanes.
- **Schema-modeled: GPT5, Anthropic (Claude Code subscription,
  Anthropic API key), MCP servers (HTTP and stdio), GitHub, Linear,
  Vercel, Figma (REST + Remote MCP), FlakeHub / Determinate.** Each has
  a typed admission status (`admitted_command`, `admitted_http`,
  `mcp_profile`, or `unadmitted`) and a probe shape. Live route proofs
  are pending.
- **Planned: Bedrock, Azure.**

The full table (with admission status, probe shape, and per-provider
citations) lives on https://omux.xoxd.ai.

## Security posture

Four hard guarantees:

- no `.env` token dumping;
- no committed credential stores;
- no raw token output in discovery/health;
- explicit live probes only when they may spend calls.

**File permission enforcement.** Config and state files are validated at
load time; loose permissions are rejected.

**Redacted discovery.** `oauth-mux discover --json` reports config path,
state path, providers, account names, secret backend names, tags,
profiles, and safe command templates. It does not include token
material.

**No hidden daemon dependency.** A daemon exists, but it is not a production
dependency. The default Codex path is managed launch/resume with redacted
status evidence. Background polling, automatic
subscription-spending checks, silent token refresh for upstream-CLI-owned
refresh semantics, and any release gate that depends on a long-running
daemon are explicitly not allowed yet.

**Seven secret backends.** The backend stores or returns raw secret
material; it does not define provider logic. Allowed:

- `env` — read from a process environment variable.
- `file` — read from a file path on disk.
- `keychain` — read from the OS keychain / secret service.
- `sops` — read decrypted through a sops-managed file.
- `age` — read decrypted through an age-managed file.
- `command` — read from the stdout of an explicit command.
- `stdin` — read from stdin at the moment of use.

Anything else is rejected at config validation time.

## Status

oauth-mux is FOSS (MIT). Codex is the live-proven provider, with
capability-scoped route evidence and explicit proof boundaries. Other
providers are schema-modeled — admitted, typed, and runnable, but not yet
exercised against live subscriptions on every route. Filing an issue with
a probe artifact is the fastest way to promote a provider out of
`schema-modeled`.

## Links

- Site: https://omux.xoxd.ai
- Source: https://github.com/Jesssullivan/oauth-mux
- Issues / discussions: GitHub
- License: MIT
