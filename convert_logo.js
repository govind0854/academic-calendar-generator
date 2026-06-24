import fs from 'fs';
import path from 'path';

const logoPath = path.resolve('public/logo.jpeg');
if (fs.existsSync(logoPath)) {
  const base64 = fs.readFileSync(logoPath).toString('base64');
  const dataUrl = `data:image/jpeg;base64,${base64}`;
  
  const jsContent = `// Base64 encoded university logo\nexport const LOGO_BASE64 = "${dataUrl}";\n`;
  fs.writeFileSync('src/data/logoBase64.js', jsContent);
  console.log("src/data/logoBase64.js generated successfully.");
} else {
  console.error("Logo file not found at:", logoPath);
}
