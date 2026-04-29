// M3.1 + M3.2 prerender load — pre-highlights all code blocks at build time.
// See docs/spec/omux-website-bootstrap-2026-04-29.md § Information Architecture
// for the constraint that no Shiki runtime ships to the client.
import type { PageServerLoad } from './$types';
import { highlight } from '$lib/content/highlight';
import {
	INSTALL_AND_PROBE,
	ZIG_LIVENESS_BLOCK,
	ZIG_DEAD_DEGRADED,
	INSTALL_NPM,
	INSTALL_TARBALLS,
	INSTALL_BREW,
	INSTALL_DEB_RPM,
	INSTALL_CURL,
	INSTALL_CURL_OVERRIDE,
	CODEX_HAPPY_PATH,
	GENERIC_AUTHOR_VALIDATE,
	AGENT_DISCOVERY,
} from '$lib/content/cli-examples';
import liveAvailable from '$lib/content/probe-json/live-available.json';
import liveQuota from '$lib/content/probe-json/live-quota-exhausted.json';
import deadIllustration from '$lib/content/probe-json/dead-illustration.json';
import providersJson from '$lib/content/providers.json';
import { ProviderMatrix } from '$lib/content/providers.schema';
import { decodeOrThrow } from '$lib/effect/schema';

export const prerender = true;

// Validate the provider matrix at build time. Schema failure halts the build,
// matching the M0.6 contract: malformed providers.json must not reach prerender.
const providerMatrix = decodeOrThrow(ProviderMatrix)(providersJson);

export const load: PageServerLoad = async () => {
	const [
		installHtml,
		livenessHtml,
		deadDegradedHtml,
		liveAvailHtml,
		liveQuotaHtml,
		deadIllusHtml,
		npmHtml,
		tarballsHtml,
		brewHtml,
		debRpmHtml,
		curlHtml,
		curlOverrideHtml,
		codexHappyHtml,
		genericValidateHtml,
		agentDiscoveryHtml,
	] = await Promise.all([
		highlight(INSTALL_AND_PROBE, 'bash'),
		highlight(ZIG_LIVENESS_BLOCK, 'zig'),
		highlight(ZIG_DEAD_DEGRADED, 'zig'),
		highlight(JSON.stringify(liveAvailable, null, 2), 'json'),
		highlight(JSON.stringify(liveQuota, null, 2), 'json'),
		highlight(JSON.stringify(deadIllustration, null, 2), 'json'),
		highlight(INSTALL_NPM, 'bash'),
		highlight(INSTALL_TARBALLS, 'bash'),
		highlight(INSTALL_BREW, 'bash'),
		highlight(INSTALL_DEB_RPM, 'bash'),
		highlight(INSTALL_CURL, 'bash'),
		highlight(INSTALL_CURL_OVERRIDE, 'bash'),
		highlight(CODEX_HAPPY_PATH, 'bash'),
		highlight(GENERIC_AUTHOR_VALIDATE, 'bash'),
		highlight(AGENT_DISCOVERY, 'bash'),
	]);
	return {
		installHtml,
		livenessHtml,
		deadDegradedHtml,
		liveAvailHtml,
		liveQuotaHtml,
		deadIllusHtml,
		npmHtml,
		tarballsHtml,
		brewHtml,
		debRpmHtml,
		curlHtml,
		curlOverrideHtml,
		codexHappyHtml,
		genericValidateHtml,
		agentDiscoveryHtml,
		providerMatrix,
	};
};
