// M3.1 — verbatim content lifted from oauth-mux source.
// Citations:
// - INSTALL_AND_PROBE: oauth-mux/docs/spec/product-adoption-sprint-2026-04-28.md:89-93
// - ZIG_LIVENESS_BLOCK: oauth-mux/src/types.zig:152-215
// - ZIG_DEAD_DEGRADED: oauth-mux/src/types.zig:224-240
// - ZIG_MUX_DECISION: oauth-mux/src/types.zig:245-261

export const INSTALL_AND_PROBE = `npm install -g oauth-mux
oauth-mux codex onboard
oauth-mux codex probe-all --capability codex-max --json`;

export const ZIG_LIVENESS_BLOCK = `// ── Credential Liveness ──
//
// Three distinct layers that the mux pipeline must reason about:
//
// 1. Authentication: Can the token prove identity to the provider?
//    (not expired, not revoked, parseable)
//
// 2. Operability: Is the account in a state where it can serve requests?
//    (not suspended, subscription active, tier sufficient)
//
// 3. Availability: Does the account have capacity right now?
//    (not rate-limited, quota not exhausted, not in cooldown)
//
// The mux response differs for each:
//   Auth failed    → mark dead, never retry automatically
//   Inoperable     → mark degraded, retry after long interval (hours)
//   Rate limited   → cooldown timer, retry same account after seconds
//   Quota exhausted → switch account, retry after window reset (hours/days)
//   Provider down  → switch provider entirely, not just account

pub const CredentialLiveness = union(enum) {
    live: LiveCredential,
    degraded: DegradedCredential,
    dead: DeadCredential,

    pub const LiveCredential = struct {
        availability: Availability,
    };

    pub const DegradedCredential = struct {
        reason: DegradedReason,
        since: i64,
        retry_at: ?i64 = null,
    };

    pub const DeadCredential = struct {
        reason: DeadReason,
        since: i64,
    };
};

pub const Availability = union(enum) {
    available,
    rate_limited: RateLimitInfo,
    quota_exhausted: QuotaInfo,
    cooldown: CooldownInfo,

    pub const RateLimitInfo = struct {
        retry_after_s: u32,
        limited_at: i64,
        window: RateLimitWindow,
    };

    pub const QuotaInfo = struct {
        window_resets_at: ?i64 = null,
        usage_pct: ?u8 = null,
        exhausted_at: i64,
    };

    pub const CooldownInfo = struct {
        until: i64,
        reason: []const u8,
    };
};`;

export const ZIG_DEAD_DEGRADED = `pub const DegradedReason = enum {
    tier_insufficient,
    subscription_paused,
    provider_degraded,
    scope_insufficient,
    schema_invalid,
    terms_required,
    step_up_required,
    pending_verification,
    unknown_4xx,
};

pub const DeadReason = enum {
    token_revoked,
    account_deleted,
    auth_permanently_failed,
};`;

export interface MuxDecisionRow {
	decision: string;
	httpStatus: string;
	semantics: string;
}

// Source: oauth-mux/src/types.zig:245-261 (MuxDecision enum + fromHttpStatus)
export const MUX_DECISION_ROWS: MuxDecisionRow[] = [
	{
		decision: 'use_this',
		httpStatus: '200–299',
		semantics: 'Probe succeeded; route to this credential.',
	},
	{
		decision: 'try_next_account',
		httpStatus: '401, 403 (and other 4xx fallthrough)',
		semantics: 'This account cannot serve the request; advance to the next account on the route.',
	},
	{
		decision: 'try_next_provider',
		httpStatus: '500–599',
		semantics: 'Upstream provider is degraded; advance to the next provider, not just account.',
	},
	{
		decision: 'wait_and_retry',
		httpStatus: '429',
		semantics: 'Rate-limited; wait the cooldown window and retry the same account.',
	},
	{
		decision: 'give_up',
		httpStatus: '—',
		semantics: 'Terminal: no recoverable path remains (`isRecoverable` returns false).',
	},
];
