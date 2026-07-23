const fs = require('node:fs');

const required = ['index.html', 'styles.css', 'manifest.webmanifest', 'public/icon.svg'];
const appUrl = 'https://83eb1c6582cf666c17.v2.appdeploy.ai/';
const localIcon = 'public/icon.svg';

for (const file of required) {
  if (!fs.existsSync(file)) {
    throw new Error(`Missing ${file}`);
  }
}

const html = fs.readFileSync('index.html', 'utf8');
const icon = fs.readFileSync('public/icon.svg', 'utf8');
const manifest = JSON.parse(fs.readFileSync('manifest.webmanifest', 'utf8'));

if (!html.includes(appUrl)) {
  throw new Error('App link missing from index.html');
}

if (!html.includes('class="icon-link"')) {
  throw new Error('Clickable app icon link is missing');
}

if (!html.includes(`src="${localIcon}"`) || !html.includes(`href="${localIcon}"`)) {
  throw new Error('Launcher is not using relative local app icon paths');
}

if (html.includes('href="/') || html.includes('src="/')) {
  throw new Error('Launcher should use relative asset paths so it works from subpaths');
}

if (!icon.includes('<svg') || icon.includes('https://i.ibb.co/')) {
  throw new Error('App icon must be self-contained SVG with no blocked runtime image host');
}

if (manifest.start_url !== '.' || manifest.scope !== '.') {
  throw new Error('Manifest must use relative start_url and scope');
}

if (manifest.icons?.[0]?.src !== localIcon || manifest.icons?.[0]?.type !== 'image/svg+xml') {
  throw new Error('Manifest relative SVG app icon is not configured');
}

console.log('Static app icon launcher is deployable with local assets and relative paths.');
