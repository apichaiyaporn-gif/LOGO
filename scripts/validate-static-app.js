const fs = require('node:fs');

const required = ['index.html', 'styles.css', 'manifest.webmanifest', 'public/icon.svg'];
const appUrl = 'https://83eb1c6582cf666c17.v2.appdeploy.ai/';
const logoUrl = 'https://i.ibb.co/svVYd9fJ/Chibi-Nurse-Holding-Phone.png';

for (const file of required) {
  if (!fs.existsSync(file)) {
    throw new Error(`Missing ${file}`);
  }
}

const html = fs.readFileSync('index.html', 'utf8');
const readme = fs.readFileSync('README.md', 'utf8');
const manifest = JSON.parse(fs.readFileSync('manifest.webmanifest', 'utf8'));

if (!html.includes(appUrl)) {
  throw new Error('App link missing from index.html');
}

if (!html.includes('class="icon-link"')) {
  throw new Error('Clickable app icon link is missing');
}

if (!html.includes(logoUrl) || !readme.includes(logoUrl)) {
  throw new Error('Provided logo image URL is missing from the app or README');
}

if (manifest.icons?.[0]?.src !== logoUrl || manifest.icons?.[0]?.type !== 'image/png') {
  throw new Error('Manifest primary PNG logo is not configured');
}

console.log('Static app icon launcher is present and configured with the provided logo.');
