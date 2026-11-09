import { countdownHeadline, countdownSubline, isHarvestDay, HARVEST_DAY_LABEL } from "./countdown";

export const SHARE_W = 1600;
export const SHARE_H = 900;

const ASSETS = {
  bg: "/share/bg.jpg",
  wago: "/share/wago.png",
  grass: "/share/grass.png",
  sprout: "/share/sprout.png",
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

/** Resolve the real family name next/font generated for the --font-fredoka variable. */
function displayFamily(): string {
  if (typeof document === "undefined") return "sans-serif";
  const v = getComputedStyle(document.body).getPropertyValue("--font-fredoka").trim();
  return v ? `${v}, "Fredoka", system-ui, sans-serif` : `"Fredoka", system-ui, sans-serif`;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawWood(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, planks = 0) {
  ctx.save();
  ctx.shadowColor = "rgba(30,15,0,.35)";
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 10;
  roundRect(ctx, x, y, w, h, r);
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, "#9a6232");
  g.addColorStop(0.5, "#835225");
  g.addColorStop(1, "#6b411b");
  ctx.fillStyle = g;
  ctx.fill();
  ctx.restore();

  ctx.save();
  roundRect(ctx, x, y, w, h, r);
  ctx.clip();
  // grain
  ctx.strokeStyle = "rgba(60,30,8,.22)";
  ctx.lineWidth = 3;
  for (let i = 0; i < Math.max(4, Math.round(h / 22)); i++) {
    const yy = y + 12 + i * 22 + ((i * 37) % 9);
    ctx.beginPath();
    ctx.moveTo(x, yy);
    ctx.bezierCurveTo(x + w * 0.3, yy - 5, x + w * 0.6, yy + 6, x + w, yy - 2);
    ctx.stroke();
  }
  // plank seams
  if (planks > 1) {
    ctx.strokeStyle = "rgba(40,20,5,.7)";
    ctx.lineWidth = 5;
    for (let i = 1; i < planks; i++) {
      const yy = y + (h / planks) * i;
      ctx.beginPath();
      ctx.moveTo(x, yy);
      ctx.lineTo(x + w, yy);
      ctx.stroke();
    }
  }
  // top highlight
  ctx.fillStyle = "rgba(255,225,170,.18)";
  ctx.fillRect(x, y, w, 8);
  ctx.restore();

  roundRect(ctx, x, y, w, h, r);
  ctx.lineWidth = 7;
  ctx.strokeStyle = "#3a2008";
  ctx.stroke();
}

/** One cartoon leaf: tip at (x,y) pointing along `angle`, outlined, with a midrib. */
function drawLeaf(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, wid: number, angle: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(len * 0.25, -wid, len * 0.75, -wid * 0.8, len, 0);
  ctx.bezierCurveTo(len * 0.75, wid * 0.8, len * 0.25, wid, 0, 0);
  ctx.closePath();
  const g = ctx.createLinearGradient(0, -wid, 0, wid);
  g.addColorStop(0, "#7fd23a");
  g.addColorStop(1, "#2f9a22");
  ctx.fillStyle = g;
  ctx.fill();
  ctx.lineJoin = "round";
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#1a4a0a";
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(len * 0.08, 0);
  ctx.quadraticCurveTo(len * 0.5, wid * 0.08, len * 0.92, 0);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(20,70,10,.7)";
  ctx.stroke();
  ctx.restore();
}

/** Draw outlined text centered at (cx, baselineY), shrinking to fit maxW. */
function outlinedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  opts: { size: number; maxW: number; fill: string | CanvasGradient; stroke: string; strokeW: number; family: string; shadow?: boolean; spacing?: number }
) {
  let size = opts.size;
  ctx.font = `700 ${size}px ${opts.family}`;
  const w = ctx.measureText(text).width;
  if (w > opts.maxW) {
    size = Math.floor(size * (opts.maxW / w));
    ctx.font = `700 ${size}px ${opts.family}`;
  }
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  // Extra tracking keeps neighbouring letters from fusing under the thick outline.
  (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = opts.spacing ? `${opts.spacing}px` : "0px";
  ctx.lineJoin = "round";
  ctx.miterLimit = 2;
  if (opts.shadow) {
    ctx.save();
    ctx.shadowColor = "rgba(30,15,0,.45)";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = Math.round(size * 0.05);
    ctx.lineWidth = opts.strokeW;
    ctx.strokeStyle = opts.stroke;
    ctx.strokeText(text, cx, cy);
    ctx.restore();
  }
  ctx.lineWidth = opts.strokeW;
  ctx.strokeStyle = opts.stroke;
  ctx.strokeText(text, cx, cy);
  ctx.fillStyle = opts.fill;
  ctx.fillText(text, cx, cy);
  (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = "0px";
  return size;
}

export async function renderHarvestShareCard(days: number): Promise<Blob> {
  const family = displayFamily();
  // Make sure the display face is actually loaded before drawing text into the canvas.
  try {
    await Promise.all([document.fonts.load(`700 120px ${family}`), document.fonts.load(`700 40px ${family}`)]);
  } catch {
    /* fall back to whatever is available */
  }

  const [bg, wago, grass, sprout] = await Promise.all([
    loadImage(ASSETS.bg),
    loadImage(ASSETS.wago),
    loadImage(ASSETS.grass),
    loadImage(ASSETS.sprout),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = SHARE_W;
  canvas.height = SHARE_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser");

  // Scenery: cover-fit background, anchored to the sky so the sign sits on bright blue.
  const bs = Math.max(SHARE_W / bg.width, SHARE_H / bg.height);
  ctx.drawImage(bg, (SHARE_W - bg.width * bs) / 2, 0, bg.width * bs, bg.height * bs);

  // WAGO, lounging bottom-left
  const ww = 640;
  const wh = (wago.height / wago.width) * ww;
  ctx.drawImage(wago, -60, SHARE_H - wh - 60, ww, wh);

  // Sign
  const bx = 600, bw = 900;
  drawWood(ctx, bx, 120, bw, 500, 26, 4); // backboard
  drawWood(ctx, bx + 170, 36, bw - 340, 112, 20); // top plank

  // vines: leaf clusters sprouting from the sign's top-left and bottom-right corners
  const tl: [number, number, number, number][] = [[bx + 20, 150, 150, 46], [bx + 10, 128, 130, 40], [bx + 30, 168, 120, 38]];
  tl.forEach(([lx, ly, ln, wd], i) => drawLeaf(ctx, lx, ly, ln, wd, [-2.55, -2.05, 2.75][i]));
  const br: [number, number, number, number][] = [[bx + bw - 20, 590, 150, 46], [bx + bw - 10, 612, 130, 40], [bx + bw - 30, 572, 120, 38]];
  br.forEach(([lx, ly, ln, wd], i) => drawLeaf(ctx, lx, ly, ln, wd, [0.6, 1.1, -0.4][i]));

  const cx = bx + bw / 2;
  const cream = "#fff1c4";

  // "HARVEST" with sprout
  const tpY = 94;
  const sproutS = 78;
  ctx.drawImage(sprout, cx - 250, tpY - sproutS / 2, sproutS, sproutS);
  outlinedText(ctx, "HARVEST", cx + 40, tpY + 2, { size: 74, maxW: 420, fill: cream, stroke: "#3a2008", strokeW: 8, family, spacing: 6 });

  // The big number (or HARVEST DAY)
  const headline = countdownHeadline(days);
  const numGrad = ctx.createLinearGradient(0, 210, 0, 470);
  numGrad.addColorStop(0, "#ffe86a");
  numGrad.addColorStop(1, "#f6b800");
  outlinedText(ctx, headline, cx, 336, {
    size: isHarvestDay(days) ? 180 : 330,
    maxW: bw - 130,
    fill: numGrad,
    stroke: "#3a2008",
    strokeW: isHarvestDay(days) ? 22 : 34,
    family,
    shadow: true,
  });

  // lower plank
  drawWood(ctx, bx - 30, 500, bw + 60, 120, 22);
  outlinedText(ctx, countdownSubline(days), cx, 562, { size: 72, maxW: bw - 60, fill: cream, stroke: "#3a2008", strokeW: 8, family, spacing: 5 });

  // Info plate
  const px = bx + 40, py = 650, pw = bw - 80, ph = 118;
  ctx.save();
  ctx.shadowColor = "rgba(30,15,0,.3)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 8;
  roundRect(ctx, px, py, pw, ph, 22);
  ctx.fillStyle = "#fbf1d2";
  ctx.fill();
  ctx.restore();
  roundRect(ctx, px, py, pw, ph, 22);
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#cfa95a";
  ctx.stroke();

  // sprout badge
  ctx.beginPath();
  ctx.arc(px + 78, py + ph / 2, 42, 0, Math.PI * 2);
  ctx.fillStyle = "#1a4a0a";
  ctx.fill();
  ctx.drawImage(sprout, px + 78 - 30, py + ph / 2 - 30, 60, 60);

  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#143a08";
  ctx.font = `700 54px ${family}`;
  const dateText = isHarvestDay(days) ? "THE WAIT IS OVER" : HARVEST_DAY_LABEL;
  ctx.fillText(dateText, px + 150, py + 44);
  ctx.fillStyle = "#3d6b1f";
  ctx.font = `700 30px ${family}`;
  ctx.fillText(isHarvestDay(days) ? "TIME TO HARVEST" : "PLANTING CLOSED  •  GROWING", px + 150, py + 92);

  // foreground grass
  const gw = SHARE_W + 80;
  const gh = (grass.height / grass.width) * gw;
  ctx.drawImage(grass, -40, SHARE_H - gh * 0.46, gw, gh);

  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not create image"))), "image/png");
  });
}
