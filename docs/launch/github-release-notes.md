# oauth-mux release notes (soft-launch draft)

> Draft for the next upstream `Jesssullivan/oauth-mux` release. Uses the
> website launch as the primary CTA. Content is intentionally narrow and
> matches the voice on https://omux.xoxd.ai.

## What's new

This release pairs with the launch of the project site at
**https://omux.xoxd.ai** — the canonical place to read the agent auth and
session-resilience story, the managed Codex lifecycle, the provider matrix,
the security posture, and the first-run flows in one continuous page.

oauth-mux wraps supported harnesses with route-state diagnostics, managed
auth/config overlays, and labeled fallback decisions. It still models
credential health as authentication, operability, and availability, but the
operator-facing goal is simple: keep the harness usable when auth, quota, tier,
or local runtime state changes, and leave a redacted artifact trail.

Discovery (`oauth-mux discover --json`) is redacted by default: it
reports config path, providers, account names, secret backend names,
tags, profiles, and safe command templates. It does not include token
material.

## Provider scope (read this before filing issues)

- **Live-proven: Codex.** Current evidence includes installed-runtime managed
  resume quota handoff: `codex:max-2` served successful traffic, then returned
  `usage_limit_reached`; oauth-mux retried the same buffered request on
  `codex:max-3`, and the fallback account returned `200`. Same-thread provider
  continuity and mid-turn streaming recovery remain separate proof lanes.
- **Schema-modeled: GPT5, Anthropic (Claude Code subscription, Anthropic
  API key), MCP servers (HTTP and stdio), GitHub, Linear, Vercel, Figma,
  FlakeHub.** Probe shapes and admission status are typed; live route
  proofs are pending.
- **Planned: Bedrock, Azure.**

Background-daemon refresh is not a production dependency in this release. The
current Codex path is managed launch/resume plus redacted status evidence.

Public install lanes remain `0.1.6`; source and local dogfood are `0.1.7`
candidate until the next release is published.

## Try it

```sh
npm install -g oauth-mux
oauth-mux init --codex-max
oauth-mux doctor
oauth-mux route explain --profile codex-max --capability codex-max
oauth-mux codex resume
```

Read the site for the full first-run walkthrough, the provider matrix,
and the security posture: **https://omux.xoxd.ai**.
