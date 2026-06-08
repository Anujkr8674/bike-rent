const fs = require('fs');
const path = require('path');

const colors = ['sky', 'emerald', 'rose', 'amber', 'blue', 'violet', 'orange', 'red', 'green'];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const color of colors) {
        // Backgrounds
        content = content.replace(new RegExp(`\\bbg-${color}-50\\b`, 'g'), `bg-${color}-500/10`);
        content = content.replace(new RegExp(`\\bhover:bg-${color}-50\\b`, 'g'), `hover:bg-${color}-500/10`);
        content = content.replace(new RegExp(`\\bhover:bg-${color}-100\\b`, 'g'), `hover:bg-${color}-500/20`);
        
        // Borders
        content = content.replace(new RegExp(`\\bborder-${color}-100\\b`, 'g'), `border-${color}-500/20`);
        content = content.replace(new RegExp(`\\bborder-${color}-200\\b`, 'g'), `border-${color}-500/20`);
        
        // Texts
        content = content.replace(new RegExp(`\\btext-${color}-900\\b`, 'g'), `text-${color}-200`);
        content = content.replace(new RegExp(`\\btext-${color}-800\\b`, 'g'), `text-${color}-300`);
        content = content.replace(new RegExp(`\\btext-${color}-700\\b`, 'g'), `text-${color}-400`);
        content = content.replace(new RegExp(`\\btext-${color}-600\\b`, 'g'), `text-${color}-400`);
      }
      
      // Some special hex colors
      content = content.replace(/\bbg-\[\#FFF1EA\]\b/g, 'bg-[#FF653F]/10');
      content = content.replace(/\bborder-\[\#FFE0D6\]\b/g, 'border-[#FF653F]/20');

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
