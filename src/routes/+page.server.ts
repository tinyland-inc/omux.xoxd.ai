// M3.1 prerender load — pre-highlights all code blocks at build time.
// See docs/spec/omux-website-bootstrap-2026-04-29.md § Information Architecture
// for the constraint that no Shiki runtime ships to the client.
import type { PageServerLoad } from './$types';
import { highlight } from '$lib/content/highlight';
import { INSTALL_AND_PROBE, ZIG_LIVENESS_BLOCK, ZIG_DEAD_DEGRADED } from '$lib/content/cli-examples';
import liveAvailable from '$lib/content/probe-json/live-available.json';
import liveQuota from '$lib/content/probe-json/live-quota-exhausted.json';
import deadIllustration from '$lib/content/probe-json/dead-illustration.json';

export const prerender = true;

export const load: PageServerLoad = async () => {
	const [installHtml, livenessHtml, deadDegradedHtml, liveAvailHtml, liveQuotaHtml, deadIllusHtml] = await Promise.all([
		highlight(INSTALL_AND_PROBE, 'bash'),
		highlight(ZIG_LIVENESS_BLOCK, 'zig'),
		highlight(ZIG_DEAD_DEGRADED, 'zig'),
		highlight(JSON.stringify(liveAvailable, null, 2), 'json'),
		highlight(JSON.stringify(liveQuota, null, 2), 'json'),
		highlight(JSON.stringify(deadIllustration, null, 2), 'json'),
	]);
	return {
		installHtml,
		livenessHtml,
		deadDegradedHtml,
		liveAvailHtml,
		liveQuotaHtml,
		deadIllusHtml,
	};
};
