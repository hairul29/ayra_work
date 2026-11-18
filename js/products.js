
// AYRA GLOW - product catalog (demo listings, sample prices in Philippine pesos)
// TO EDIT: change any row below. To use a real photo, add it to IMAGE_OVERRIDES.
// Row format: [category, name, shape, price, color, description, shades, details, flags]
// flags: b = Best Seller, n = New Arrival, f = Featured on Home

const CATS = {
  face: "Face Makeup",
  eye: "Eye Makeup",
  lips: "Lip Products"
};

const CAT_INFO = {
  face: "Foundations, powders and glowing finishes for a flawless base.",
  eye: "Palettes, liners and lashes to make your eyes the main character.",
  lips: "Bold, glossy or velvety. Find your signature lip."
};

// IMAGE OVERRIDES
// The key must match the generated product ID.
// Place your images inside the images folder.

const IMAGE_OVERRIDES = {
  // FACE MAKEUP
  "liquid-foundation": "images/liquid-foundation.png",
  "setting-powder": "images/setting-powder.png",
  "blush": "images/blush.png",
  "setting-spray": "images/setting-spray.png",

  // EYE MAKEUP
  "eyeshadow-palette": "images/eyeshadow-palette.png",
  "mascara": "images/mascara.png",
  "liquid-eyeliner": "images/liquid-eyeliner.png",
  "brow-gel": "images/brow-gel.png",

  // LIP PRODUCTS
  "matte-lipstick": "images/matte-lipstick.png",
  "lip-gloss": "images/lip-gloss.png",
  "lip-oil": "images/lip-oil.png"
};

const RAW = [
  // FACE MAKEUP
  ["face","Liquid Foundation","bottle",899,"#E0A98A","Lightweight, buildable coverage with a natural skin-like finish.","Fair|Light|Medium|Tan|Deep","30 ml • Medium to full coverage • Satin finish • Apply with a sponge or brush","bf"],

  ["face","Setting Powder","jar",549,"#F5DCC8","Finely milled powder that sets makeup and softens shine.","Translucent|Banana|Rose","10 g • Weightless matte finish • Sweep over the T-zone","f"],

  ["face","Blush","compact",399,"#F72585","Silky, pigmented blush for a flushed, healthy-looking cheek.","Petal Pink|Peach Glow|Berry Crush","5 g • Buildable color • Satin finish • Sweep on the apples of the cheeks","bf"],

  ["face","Setting Spray","bottle",649,"#E5CCFF","A fine mist that locks makeup in place for all-day wear.","Matte Finish|Dewy Finish","100 ml • Lightweight mist • Hold 20 cm away and spray","n"],

  // EYE MAKEUP
  ["eye","Eyeshadow Palette","palette",999,"#7209B7","Twelve blendable shades from soft nudes to bold purples.","Nude Dream|Purple Haze|Rose Gold","12 pans • Matte and shimmer finishes • Apply with a fluffy brush","bf"],

  ["eye","Mascara","tube",399,"#24152B","Lengthening and volumizing mascara for bold lashes.","Black|Brown","8 ml • Smudge-resistant formula • Wiggle from roots to tips","bf"],

  ["eye","Liquid Eyeliner","stick",349,"#24152B","Precise brush tip for sleek lines and graphic wings.","Jet Black|Plum","3 ml • Matte finish • Fine brush tip",""],

  ["eye","Brow Gel","tube",299,"#8B5E3C","Tinted gel that sets and shapes brows with a flexible hold.","Clear|Brown","6 ml • Flexible hold • Brush through brows","n"],

  // LIP PRODUCTS
  ["lips","Matte Lipstick","lipstick",399,"#F72585","A rich, creamy matte lipstick with bold color payoff.","Hot Pink|Rosewood|Berry Wine|Nude Beige","3.5 g • Matte finish • Comfortable wear","bf"],

  ["lips","Lip Gloss","tube",299,"#FF8FB1","Non-sticky gloss for plump, shiny lips.","Clear|Pink Pop|Peach Shine","6 ml • High-shine finish • Wand applicator","b"],

  ["lips","Lip Oil","tube",349,"#FF9BB3","Nourishing oil with a glossy, cushiony finish.","Clear|Pink Glow|Berry","5 ml • Non-sticky shine • Wear alone or over lipstick","bn"]
];

// Draws a simple product illustration when no real photo is set.
function art(shape, c) {
  const d = "#9B5875";

  const shapes = {
    bottle: `<rect x="125" y="62" width="50" height="34" rx="8" fill="${d}"/><rect x="98" y="96" width="104" height="170" rx="20" fill="${c}"/><rect x="112" y="150" width="76" height="64" rx="10" fill="#fff" opacity=".8"/>`,

    compact: `<rect x="55" y="95" width="190" height="140" rx="32" fill="${d}"/><ellipse cx="150" cy="168" rx="70" ry="48" fill="${c}"/><ellipse cx="135" cy="152" rx="26" ry="14" fill="#fff" opacity=".35"/>`,

    tube: `<rect x="118" y="46" width="64" height="72" rx="12" fill="${d}"/><rect x="126" y="118" width="48" height="140" rx="12" fill="${c}"/><rect x="134" y="170" width="32" height="40" rx="6" fill="#fff" opacity=".7"/>`,

    stick: `<rect x="132" y="40" width="36" height="76" rx="10" fill="${d}"/><rect x="136" y="116" width="28" height="140" rx="8" fill="${c}"/>`,

    palette: `<rect x="40" y="80" width="220" height="150" rx="16" fill="${d}"/>` +
      [0,1,2,3,4,5,6,7,8,9,10,11].map(i =>
        `<rect x="${52 + (i % 4) * 51}" y="${94 + Math.floor(i / 4) * 44}" width="44" height="36" rx="8" fill="${c}" opacity="${(1 - i * 0.055).toFixed(2)}"/>`
      ).join(""),

    lipstick: `<rect x="108" y="170" width="84" height="86" rx="8" fill="${d}"/><rect x="118" y="120" width="64" height="50" fill="#C0A060"/><path d="M118 120 V78 Q150 38 182 78 V120Z" fill="${c}"/>`,

    jar: `<rect x="82" y="86" width="136" height="48" rx="14" fill="${d}"/><rect x="88" y="134" width="124" height="112" rx="18" fill="${c}"/><rect x="108" y="170" width="84" height="40" rx="8" fill="#fff" opacity=".75"/>`,

    lashes: `<path d="M62 196 Q150 124 238 196" stroke="${d}" stroke-width="7" fill="none"/>` +
      [0,1,2,3,4,5,6,7,8,9,10].map(i => {
        const x = 70 + i * 16;
        const y = 190 - Math.sin(i / 10 * Math.PI) * 52;
        return `<path d="M${x} ${y} L${x - 8 + i} ${y - 40}" stroke="${d}" stroke-width="4" stroke-linecap="round"/>`;
      }).join(""),

    curler: `<circle cx="100" cy="200" r="36" fill="none" stroke="${c}" stroke-width="14"/><circle cx="200" cy="200" r="36" fill="none" stroke="${c}" stroke-width="14"/><path d="M100 164 L150 92 L200 164" fill="none" stroke="${d}" stroke-width="12" stroke-linejoin="round"/>`
  };

  const sparkle = (x, y, s) =>
    `<text x="${x}" y="${y}" font-size="${s}" fill="#fff" opacity=".8">✦</text>`;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#FFF0F5"/>
          <stop offset="1" stop-color="#EAB6C9"/>
        </linearGradient>
      </defs>
      <rect width="300" height="300" fill="url(#g)"/>
      ${sparkle(30, 60, 26)}
      ${sparkle(240, 90, 20)}
      ${sparkle(220, 250, 28)}
      ${sparkle(40, 240, 16)}
      <ellipse cx="150" cy="270" rx="80" ry="8" fill="#754257" opacity=".15"/>
      ${shapes[shape] || shapes.bottle}
    </svg>
  `;

  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

// CREATE PRODUCT OBJECTS
let PRODUCTS = RAW.map(r => {
  const id = r[1].toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return {
    id,
    cat: r[0],
    catName: CATS[r[0]],
    name: r[1],
    price: r[3],
    desc: r[5],
    shades: r[6].split("|"),
    details: r[7].split(" • "),
    best: r[8].includes("b"),
    isNew: r[8].includes("n"),
    featured: r[8].includes("f"),
    img: IMAGE_OVERRIDES[id] || art(r[2], r[4])
  };
});

// User-added products are stored in this browser using localStorage.
try {
  const saved = JSON.parse(
    localStorage.getItem("ayraGlowProducts") || "[]"
  );

  PRODUCTS = PRODUCTS.concat(saved);
} catch (error) {
  console.warn("Could not load saved Ayra Glow products", error);
}
