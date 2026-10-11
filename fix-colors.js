const fs = require('fs');
const path = require('path');

function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r} ${g} ${b}`;
}

const cssPath = path.join(__dirname, 'styles', 'globals.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Replace all hex colors with RGB values
css = css.replace(/: (#[0-9a-fA-F]{6});/g, (match, hex) => {
  return `: ${hexToRgb(hex)};`;
});

fs.writeFileSync(cssPath, css);

const twPath = path.join(__dirname, 'tailwind.config.js');
let tw = fs.readFileSync(twPath, 'utf8');

// Update tailwind config to use the RGB variable syntax for opacity support
tw = tw.replace(/"(var\(--color-[a-zA-Z0-9-]+\))"/g, (match, variable) => {
  return `"rgb(${variable} / <alpha-value>)"`;
});

fs.writeFileSync(twPath, tw);

console.log('Colors successfully converted to RGB formats for Tailwind opacity support!');
