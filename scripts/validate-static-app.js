const fs = require('node:fs');

const required = ['index.html', 'styles.css', 'manifest.webmanifest', 'public/icon.svg'];
const appUrl = 'https://83eb1c6582cf666c17.v2.appdeploy.ai/';
const logoUrl = 'https://i.ibb.co/svVYd9fJ/Chibi-Nurse-Holding-Phone.png';
const localIcon = '/public/icon.svg';

for (const file of required) {
  if (!fs.existsSync(file)) {
    throw new Error(`Missing ${file}`);
  }
}

const html = fs.readFileSync('index.html', 'utf8');
const readme = fs.readFileSync('README.md', 'utf8');
const icon = fs.readFileSync('public/icon.svg', 'utf8');
const manifest = JSON.parse(fs.readFileSync('manifest.webmanifest', 'utf8'));

if (!html.includes(appUrl)) {
  throw new Error('App link missing from index.html');
}

if (!html.includes('class="icon-link"')) {
  throw new Error('Clickable app icon link is missing');
}

if (!readme.includes(logoUrl) || !icon.includes(logoUrl)) {
  throw new Error('Provided logo image URL is missing from the README or local icon wrapper');
}

if (!html.includes(`src="${localIcon}"`) || !html.includes(`href="${localIcon}"`)) {
  throw new Error('Launcher is not using the local app icon');
}

if (manifest.icons?.[0]?.src !== localIcon || manifest.icons?.[0]?.type !== 'image/svg+xml') {
  throw new Error('Manifest local SVG app icon is not configured');
}

console.log('Static app icon launcher is present and configured with the changed icon.');
