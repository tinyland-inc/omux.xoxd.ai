# oauth-mux: agent auth and session resilience for AI harnesses

Most developers I know now carry multiple AI identities — a personal
ChatGPT/Codex, a work seat on someone's enterprise plan, a Claude
subscription, an Anthropic API key for prototypes, plus whatever MCP
servers their team has stood up. The CLIs that ship with these tools
mostly assume one active account at a time. Switching is manual:
log out, log in, copy a profile, hope nothing has cached the old token.

When something fails, you get an opaque 401 or 429 and have to guess
whether the credential is dead, the subscription is rate-limited, the
quota window has rolled over, or the provider itself is degraded. The
guess is almost always wrong on the first try.

**oauth-mux** is a small CLI that tries to fix this. It is FOSS, MIT,
and the project site is at [omux.xoxd.ai](https://omux.xoxd.ai).

## The broker idea, in one paragraph

oauth-mux wraps supported harnesses with route-state diagnostics,
managed auth/config overlays, and labeled fallback decisions. It still
models credential health as authentication, operability, and availability,
but the product point is simpler: keep the managed harness usable when
auth, quota, tier, or local runtime state changes, and leave a redacted
artifact trail an operator or agent can inspect.

## What's actually proven

Being honest about scope matters here, because the AI tools space is
saturated with "supports everything" claims that fall apart under load.

- **Live-proven: Codex.** Current evidence includes installed-runtime managed
  resume quota handoff: `codex:max-2` served successful traffic, then returned
  `usage_limit_reached`; oauth-mux retried the same buffered request on
  `codex:max-3`, and the fallback account returned `200`. Same-thread provider
  continuity and mid-turn streaming recovery remain separate proof lanes.
- **Schema-modeled: GPT5, Anthropic, MCP servers, GitHub, Linear,
  Vercel, Figma, FlakeHub.** Typed admission status and probe shapes
  are in the source; live route proofs are pending.
- **Planned: Bedrock, Azure.**

Discovery is redacted by default. `oauth-mux discover --json` returns
config path, providers, account names, backend names, tags, and safe
command templates — no token material. Seven secret backends are
allowed (env, file, keychain, sops, age, command, stdin);
anything else is rejected at config validation.

## Where it goes next

The schema-modeled tier is the contributor surface. If you have a live
subscription for one of the modeled providers and can capture a probe
artifact, the path from `schema-modeled` → `live-proven` is short and
documented. The provider authoring checklist on the site walks through
it.

If the multi-account harness pain is something you live with, the site
is the best place to start: **[omux.xoxd.ai](https://omux.xoxd.ai)**.
