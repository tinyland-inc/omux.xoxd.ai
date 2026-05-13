import { createServer } from 'node:http';
import {
	accessSync,
	constants,
	createReadStream,
	existsSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	statSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const buildDir = findBuildDir();
const chromiumRuntimeDir = mkdtempSync(join(tmpdir(), 'omux-playwright-chromium-'));
ensureWritableEnvDir('HOME', join(chromiumRuntimeDir, 'home'));
ensureWritableEnvDir('XDG_CONFIG_HOME', join(chromiumRuntimeDir, 'xdg-config'));
ensureWritableEnvDir('XDG_CACHE_HOME', join(chromiumRuntimeDir, 'xdg-cache'));
const chromiumPath = findChromiumExecutable();

const indexPath = join(buildDir, 'index.html');
const indexHtml = readFileSync(indexPath, 'utf8');
assertContains(indexHtml, 'oauth-mux', 'static HTML');
assertContains(indexHtml, 'Install', 'static HTML');
assertContains(indexHtml, 'View on GitHub', 'static HTML');

if (!chromiumPath) {
	console.error(
		'set GF_RBE_CHROMIUM_EXECUTABLE, GF_CHROMIUM_EXECUTABLE_PATH, PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, PUPPETEER_EXECUTABLE_PATH, or CHROME_BIN',
	);
	process.exit(1);
}

const server = createServer((request, response) => {
	const url = new URL(request.url ?? '/', 'http://127.0.0.1');
	const filePath = resolvePath(url.pathname);
	if (!filePath) {
		response.writeHead(403);
		response.end('forbidden');
		return;
	}

	const pathToRead = existsSync(filePath) ? filePath : join(buildDir, 'index.html');
	response.setHeader('content-type', contentType(pathToRead));
	createReadStream(pathToRead).pipe(response);
});

await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen));

const address = server.address();
const baseURL = `http://127.0.0.1:${address.port}`;
let browser;

try {
	browser = await chromium.launch({
		executablePath: chromiumPath,
		headless: true,
		args: ['--disable-dev-shm-usage', '--disable-gpu', '--no-sandbox'],
	});
	const page = await browser.newPage();
	const failedRequests = [];
	page.on('requestfailed', (request) => {
		failedRequests.push(`${request.url()} :: ${request.failure()?.errorText ?? 'unknown error'}`);
	});

	await page.goto(baseURL, { waitUntil: 'networkidle' });
	const main = page.locator('main');
	await main.waitFor({ state: 'attached', timeout: 10_000 });

	const title = await page.title();
	if (!title.includes('oauth-mux')) {
		throw new Error(`unexpected page title: ${title}`);
	}

	const mainText = await main.evaluate((node) => node.textContent ?? '');
	for (const term of ['oauth-mux', 'Install', 'View on GitHub']) {
		if (!mainText.includes(term)) {
			throw new Error(smokeError(page, title, mainText, failedRequests, `main content: ${term}`));
		}
	}

	await page.goto(`${baseURL}/#install`, { waitUntil: 'networkidle' });
	const installText = await page.locator('#install').evaluate((node) => node.textContent ?? '');
	if (!installText.includes('Install')) {
		throw new Error(smokeError(page, title, installText, failedRequests, 'install section'));
	}
} finally {
	await browser?.close();
	await new Promise((resolveClose) => server.close(resolveClose));
}

function resolvePath(pathname) {
	const candidate = normalize(decodeURIComponent(pathname)).replace(/^\/+/, '');
	const target = resolve(buildDir, candidate || 'index.html');
	if (target !== buildDir && !target.startsWith(`${buildDir}${sep}`)) {
		return undefined;
	}
	return target;
}

function contentType(path) {
	switch (extname(path)) {
		case '.css':
			return 'text/css; charset=utf-8';
		case '.html':
			return 'text/html; charset=utf-8';
		case '.js':
			return 'text/javascript; charset=utf-8';
		case '.json':
			return 'application/json; charset=utf-8';
		case '.svg':
			return 'image/svg+xml';
		default:
			return 'application/octet-stream';
	}
}

function findBuildDir() {
	const runfilesDir = process.env.RUNFILES_DIR;
	const testSrcDir = process.env.TEST_SRCDIR;
	const workspaceName = process.env.TEST_WORKSPACE;
	const candidates = [
		process.env.OMUX_BUILD_DIR,
		resolve('build'),
		join(scriptDir, 'build'),
		runfilesDir && workspaceName ? join(runfilesDir, workspaceName, 'build') : undefined,
		runfilesDir ? join(runfilesDir, '_main', 'build') : undefined,
		testSrcDir && workspaceName ? join(testSrcDir, workspaceName, 'build') : undefined,
		testSrcDir ? join(testSrcDir, '_main', 'build') : undefined,
	].filter(Boolean);

	for (const candidate of candidates) {
		if (existsSync(join(candidate, 'index.html'))) {
			return candidate;
		}
	}

	console.error('omux Playwright smoke requires build/index.html');
	console.error(`checked: ${candidates.join(', ')}`);
	process.exit(1);
}

function assertContains(text, term, context) {
	if (!text.includes(term)) {
		throw new Error(`missing omux smoke text in ${context}: ${term}`);
	}
}

function smokeError(page, title, text, failedRequests, missing) {
	return [
		`missing omux smoke text: ${missing}`,
		`url: ${page.url()}`,
		`build_dir: ${buildDir}`,
		`title: ${title}`,
		`text_preview: ${compactPreview(text)}`,
		`failed_requests: ${failedRequests.slice(0, 5).join(' | ') || 'none'}`,
	].join('\n');
}

function compactPreview(text) {
	return text.replace(/\s+/g, ' ').trim().slice(0, 800);
}

function findChromiumExecutable() {
	const candidates = [
		process.env.GF_RBE_CHROMIUM_EXECUTABLE,
		process.env.GF_CHROMIUM_EXECUTABLE_PATH,
		process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
		process.env.PUPPETEER_EXECUTABLE_PATH,
		process.env.CHROME_BIN,
		'/bin/chromium',
		'/usr/bin/chromium',
		'/usr/bin/chromium-browser',
		'/usr/bin/google-chrome',
		'/usr/bin/google-chrome-stable',
		'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
		'/Applications/Chromium.app/Contents/MacOS/Chromium',
	].filter(Boolean);

	for (const candidate of candidates) {
		if (existsSync(candidate)) {
			return candidate;
		}
	}

	return '';
}

function ensureWritableEnvDir(name, fallback) {
	const current = process.env[name];
	if (current && isWritableDirectory(current)) {
		return current;
	}

	mkdirSync(fallback, { recursive: true });
	process.env[name] = fallback;
	return fallback;
}

function isWritableDirectory(path) {
	try {
		if (!existsSync(path) || !statSync(path).isDirectory()) {
			return false;
		}
		accessSync(path, constants.W_OK);
		return true;
	} catch {
		return false;
	}
}
