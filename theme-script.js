const fs = require('fs');
const path = require('path');

const replacements = [
  { from: /\bbg-zinc-50\b/g, to: 'bg-white/5' },
  { from: /\bbg-zinc-100\b/g, to: 'bg-white/10' },
  { from: /\bbg-white\b/g, to: 'bg-[#111111]' },
  { from: /\bborder-zinc-200\b/g, to: 'border-white/10' },
  { from: /\bborder-zinc-100\b/g, to: 'border-white/5' },
  { from: /\bborder-zinc-300\b/g, to: 'border-white/20' },
  { from: /\btext-zinc-900\b/g, to: 'text-white' },
  { from: /\btext-zinc-800\b/g, to: 'text-zinc-200' },
  { from: /\btext-zinc-700\b/g, to: 'text-zinc-300' },
  { from: /\btext-zinc-600\b/g, to: 'text-zinc-400' },
  { from: /\btext-zinc-500\b/g, to: 'text-zinc-400' },
  { from: /\bdivide-zinc-200\b/g, to: 'divide-white/10' },
  { from: /\bdivide-zinc-100\b/g, to: 'divide-white/5' },
  { from: /\btext-slate-900\b/g, to: 'text-white' },
  { from: /\btext-slate-800\b/g, to: 'text-zinc-200' },
  { from: /\btext-slate-700\b/g, to: 'text-zinc-300' },
  { from: /\btext-slate-600\b/g, to: 'text-zinc-400' },
  { from: /\btext-slate-500\b/g, to: 'text-zinc-400' },
  { from: /\bbg-slate-100\b/g, to: 'bg-white/10' },
  { from: /\bbg-slate-50\b/g, to: 'bg-white/5' },
  { from: /\bborder-slate-200\b/g, to: 'border-white/10' },
  { from: /\bbg-zinc-950\/50\b/g, to: 'bg-[#000000]/80' },
  { from: /\btext-zinc-400\b/g, to: 'text-zinc-400' } // Noop just to be safe if some were previously 400
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      // We process the file safely
      for (const { from, to } of replacements) {
        content = content.replace(from, to);
      }
      
      // Also fix some specific edge cases like shadow-[0_6px_18px_rgba(15,23,42,0.05)]
      content = content.replace(/rgba\(15,23,42,0\.05\)/g, 'rgba(0,0,0,0.5)');
      content = content.replace(/shadow-sm/g, 'shadow-xl shadow-black/40');

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated: ' + fullPath);
      }
    }
  }
}

try {
  processDir('d:/Nextgen/bike-rent/components/admin');
  processDir('d:/Nextgen/bike-rent/app/admin');
} catch(e) {
  console.error(e);
}
