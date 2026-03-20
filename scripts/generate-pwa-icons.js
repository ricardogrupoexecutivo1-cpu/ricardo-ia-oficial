const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const projectRoot = process.cwd();
const publicDir = path.join(projectRoot, "public");
const iconsDir = path.join(publicDir, "icons");
const svgPath = path.join(iconsDir, "icon-base.svg");

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

const svg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="110" fill="#06110F"/>
  <rect x="20" y="20" width="472" height="472" rx="95" stroke="#00D084" stroke-width="10" opacity="0.28"/>
  <circle cx="256" cy="256" r="126" fill="#0B1F1A"/>
  <circle cx="256" cy="256" r="116" stroke="#00D084" stroke-width="10"/>
  <path d="M256 120L290 214H389L309 274L339 369L256 311L173 369L203 274L123 214H222L256 120Z" fill="#00D084"/>
  <circle cx="256" cy="256" r="30" fill="#06110F"/>
</svg>
`.trim();

fs.writeFileSync(svgPath, svg, "utf8");

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

function hasSharp() {
  try {
    require.resolve("sharp");
    return true;
  } catch {
    return false;
  }
}

if (!hasSharp()) {
  console.log("Instalando sharp...");
  execSync("npm install sharp --save-dev", { stdio: "inherit" });
}

const sharp = require("sharp");

async function run() {
  for (const size of sizes) {
    const outPath = path.join(iconsDir, `icon-${size}x${size}.png`);
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(outPath);

    console.log(`Ícone gerado: ${outPath}`);
  }

  const applePath = path.join(publicDir, "apple-touch-icon.png");
  await sharp(Buffer.from(svg))
    .resize(180, 180)
    .png()
    .toFile(applePath);

  console.log(`Ícone gerado: ${applePath}`);
  console.log("Tudo certo.");
}

run().catch((error) => {
  console.error("Erro ao gerar ícones:", error);
  process.exit(1);
});