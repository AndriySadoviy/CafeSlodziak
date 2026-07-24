import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import QRCode from "qrcode";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const publicDir = path.join(root, "public");
const MENU_URL =
  process.env.NEXT_PUBLIC_MENU_URL || "https://cafeslodziak-rzeszow.com/menu";

// 1) Чистий QR — PNG (для друку / стікерів)
await QRCode.toFile(path.join(publicDir, "menu-qr.png"), MENU_URL, {
  width: 800,
  margin: 2,
  color: { dark: "#2F0E09", light: "#FEF7EE" },
  errorCorrectionLevel: "H",
});

// 2) Чистий QR — SVG
await QRCode.toFile(path.join(publicDir, "menu-qr.svg"), MENU_URL, {
  type: "svg",
  width: 400,
  margin: 2,
  color: { dark: "#2F0E09", light: "#FEF7EE" },
  errorCorrectionLevel: "H",
});

// 3) Картка з логотипом і QR
const qrSvg = await QRCode.toString(MENU_URL, {
  type: "svg",
  margin: 0,
  color: { dark: "#2F0E09", light: "#FEF7EE" },
  errorCorrectionLevel: "H",
  width: 220,
});

const qrInner = qrSvg.replace(/<svg[^>]*>/, "").replace("</svg>", "");

const cardSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="340" height="520" viewBox="0 0 340 520">
  <rect width="340" height="520" rx="24" fill="#FEF7EE" stroke="#F86E04" stroke-width="6"/>
  <rect width="340" height="88" fill="#4C1D13"/>
  <circle cx="48" cy="44" r="22" fill="#FFFFFF"/>
  <text x="82" y="40" fill="#FEF7EE" font-family="Arial, sans-serif" font-size="22" font-weight="700">CafeSlodziak</text>
  <text x="82" y="60" fill="#D3A16A" font-family="Arial, sans-serif" font-size="11">Kawiarnia dla dzieci · Rzeszów</text>
  <text x="170" y="118" fill="#2F0E09" font-family="Arial, sans-serif" font-size="18" font-weight="700" text-anchor="middle">Zeskanuj i zobacz menu</text>
  <text x="170" y="140" fill="#666666" font-family="Arial, sans-serif" font-size="12" text-anchor="middle">Скануй — переглянь меню · Scan for menu</text>
  <rect x="50" y="158" width="240" height="240" rx="16" fill="#FFFFFF" stroke="#D3A16A" stroke-width="2" opacity="0.6"/>
  <g transform="translate(60, 168)">${qrInner}</g>
  <text x="170" y="430" fill="#D3A16A" font-family="Arial, sans-serif" font-size="11" text-anchor="middle">cafeslodziak-rzeszow.com/menu</text>
  <rect y="452" width="340" height="68" fill="#FFF4E8"/>
  <text x="170" y="478" fill="#2F0E09" font-family="Arial, sans-serif" font-size="13" font-weight="600" text-anchor="middle">ul. Kwiatkowskiego 38, Rzeszów</text>
  <text x="170" y="500" fill="#2F0E09" font-family="Arial, sans-serif" font-size="13" text-anchor="middle">+48 530 599 994</text>
</svg>`;

fs.writeFileSync(path.join(publicDir, "menu-qr-card.svg"), cardSvg, "utf8");

console.log("Generated:");
console.log("  public/menu-qr.png      — чистий QR");
console.log("  public/menu-qr.svg      — чистий QR (SVG)");
console.log("  public/menu-qr-card.svg — картка з логотипом");
console.log("URL:", MENU_URL);