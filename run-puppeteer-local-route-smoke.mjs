import { createServer } from 'node:http';
import { accessSync, constants, createReadStream, existsSync, mkdirSync, mkdtempSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { extname, join, normalize, resolve, sep } from 'node:path';
import puppeteer from 'puppeteer-core';

const buildDir = resolve('build');
const routePath = '/agent-snippet';
const routeFile = join(buildDir, 'agent-snippet.html');
const chromiumRuntimeDir = mkdtempSync(join(tmpdir(), 'omux-puppeteer-local-route-'));
ensureWritableEnvDir('HOME', join(chromiumRuntimeDir, 'home'));
ensureWritableEnvDir('XDG_CONFIG_HOME', join(chromiumRuntimeDir, 'xdg-config'));
ensureWritableEnvDir('XDG_CACHE_HOME', join(chromiumRuntimeDir, 'xdg-cache'));
const chromiumPath = findChromiumExecutable();

if (!existsSync(routeFile)) {
	console.error('omux Puppeteer local-route smoke requires build/agent-snippet.html');
	process.exit(1);
}

if (!chromiumPath) {
	console.error(
		'set GF_RBE_CHROMIUM_EXECUTABLE, GF_CHROMIUM_EXECUTABLE_PATH, PUPPETEER_EXECUTABLE_PATH, PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, or CHROME_BIN',
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
	browser = await puppeteer.launch({
		executablePath: chromiumPath,
		headless: true,
		args: ['--disable-dev-shm-usage', '--disable-gpu', '--no-sandbox'],
	});

	const page = await browser.newPage();
	await page.goto(`${baseURL}${routePath}`, { waitUntil: 'networkidle0' });

	const title = await page.title();
	if (!title.includes('Agent snippet')) {
		throw new Error(`unexpected agent snippet title: ${title}`);
	}

	await page.waitForSelector('body');
	const bodyText = normalizeWhitespace(await page.$eval('body', (element) => element.textContent ?? ''));
	for (const term of [
		'Agent snippet',
		'oauth-mux is OAuth/account multiplexing',
		'oauth-mux doctor runtime',
		'https://omux.xoxd.ai/api/providers',
	]) {
		if (!bodyText.includes(term)) {
			throw new Error(`omux Puppeteer local route smoke did not render expected content: ${term}`);
		}
	}

	console.log(`omux Puppeteer local-route smoke passed with ${chromiumPath}`);
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

	if (existsSync(target) && statSync(target).isDirectory()) {
		return join(target, 'index.html');
	}

	if (!existsSync(target) && existsSync(`${target}.html`)) {
		return `${target}.html`;
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

function findChromiumExecutable() {
	const candidates = [
		process.env.GF_RBE_CHROMIUM_EXECUTABLE,
		process.env.GF_CHROMIUM_EXECUTABLE_PATH,
		process.env.PUPPETEER_EXECUTABLE_PATH,
		process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
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

function normalizeWhitespace(value) {
	return value.replace(/\s+/g, ' ').trim();
}
