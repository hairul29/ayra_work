// AYRA GLOW - script.js
// Builds the shared header/footer, product cards, product details, forms.
const $ = (s, r = document) => r.querySelector(s);
const money = n => "₱" + n.toLocaleString("en-PH");
const page = document.body.dataset.page;
const params = new URLSearchParams(location.search);

/* ---------- NAVIGATION (edit menu items here) ---------- */
const NAV = [
  ["home", "index.html", "HOME"],
  ["categories", "categories.html", "CATEGORIES", [
    ["Face Makeup", "categories.html?cat=face"],
    ["Eye Makeup", "categories.html?cat=eye"],
    ["Lip Products", "categories.html?cat=lips"]]],
  ["bestsellers", "bestsellers.html", "BEST SELLERS"],
  ["admin", "admin.html", "ADD PRODUCT"],
  ["author", "author.html", "AUTHOR", [
    ["Personal Information / Profile", "author.html#profile"],
    ["Gallery", "author.html#gallery"],
    ["Other Information", "author.html#other"]]],
  ["contact", "contact.html", "CONTACT US"],
  ["about", "about.html", "ABOUT US"]
];

function initAdmin() {
  const form = $("#product-form");
  if (!form) return;
  const imageInput = $("#product-image"), preview = $("#image-preview");
  let imageData = "";
  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) { imageData = ""; preview.hidden = true; return; }
    if (!file.type.startsWith("image/")) { alert("Please choose an image file."); imageInput.value = ""; return; }
    if (file.size > 2 * 1024 * 1024) { alert("Please choose an image under 2 MB."); imageInput.value = ""; return; }
    const reader = new FileReader();
    reader.onload = () => { imageData = reader.result; preview.src = imageData; preview.hidden = false; };
    reader.readAsDataURL(file);
  });
  const renderList = () => {
    const saved = JSON.parse(localStorage.getItem("ayraGlowProducts") || "[]");
    $("#saved-products").innerHTML = saved.length ? saved.map(p => `<div class="admin-row"><img src="${p.img}" alt=""><div class="grow"><strong>${p.name}</strong><div>${p.catName} · ${money(p.price)}</div></div><button class="btn btn-ghost btn-small" type="button" data-remove="${p.id}">Remove</button></div>`).join("") : '<p>No custom products added yet.</p>' ;
    $("#saved-products").querySelectorAll("[data-remove]").forEach(b => b.addEventListener("click", () => {
      const next = JSON.parse(localStorage.getItem("ayraGlowProducts") || "[]").filter(p => p.id !== b.dataset.remove);
      localStorage.setItem("ayraGlowProducts", JSON.stringify(next)); location.reload();
    }));
  };
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!imageData) { alert("Please upload a product photo."); return; }
    const name = $("#product-name").value.trim();
    const cat = $("#product-category").value;
    const price = Number($("#product-price").value);
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString(36);
    const item = { id, cat, catName: CATS[cat], name, price, desc: $("#product-description").value.trim(), shades: $("#product-variants").value.split(",").map(x => x.trim()).filter(Boolean), details: $("#product-details").value.split(",").map(x => x.trim()).filter(Boolean), best: $("#product-best").checked, isNew: $("#product-new").checked, featured: true, img: imageData };
    const saved = JSON.parse(localStorage.getItem("ayraGlowProducts") || "[]"); saved.push(item);
    try { localStorage.setItem("ayraGlowProducts", JSON.stringify(saved)); form.reset(); imageData = ""; preview.hidden = true; showMsg($("#admin-msg"), "Product added! It is now visible in your shop on this browser."); renderList(); }
    catch (err) { alert("Storage is full. Try a smaller product image (under 2 MB)."); }
  });
  renderList();
}

function buildLayout() {
  const items = NAV.map(n => {
    const sub = n[3] ? `<ul class="submenu">${n[3].map(s => `<li><a href="${s[1]}">${s[0]}</a></li>`).join("")}</ul>` : "";
    return `<li class="${n[3] ? "has-sub" : ""}"><a href="${n[1]}" class="${n[0] === page ? "active" : ""}">${n[2]}</a>${sub}</li>`;
  }).join("");
  $("#site-header").innerHTML = `<div class="container header-inner">
    <a href="index.html" class="logo">✦ AYRA GLOW<small>BEAUTY • MAKEUP • SELF-LOVE</small></a>
    <button class="menu-toggle" id="menu-toggle" aria-label="Open menu" aria-expanded="false">☰</button>
    <nav class="nav" id="nav" aria-label="Main navigation"><ul class="nav-list">${items}</ul></nav></div>`;
  $("#site-footer").innerHTML = `<div class="container footer-inner">
    <div><h3>✦ AYRA GLOW</h3><p>Your beauty. Your rules.</p><p>Beauty essentials made to celebrate your everyday glow.</p></div>
    <div><h3>Explore</h3><ul><li><a href="index.html">Home</a></li><li><a href="categories.html">Categories</a></li><li><a href="bestsellers.html">Best Sellers</a></li><li><a href="author.html">Author</a></li><li><a href="contact.html">Contact Us</a></li><li><a href="about.html">About Us</a></li></ul></div>
    <div><h3>Follow Us</h3><ul><li><span class="placeholder">https://www.facebook.com/ayrrabbkr</span></li><li><span class="placeholder">https://www.instagram.com/aa.yrra</span></li></ul></div></div>
    <div class="footer-bottom">&copy; ${new Date().getFullYear()} AYRA GLOW. Beauty for your glow.</div>`;
  const toggle = $("#menu-toggle"), nav = $("#nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
    toggle.textContent = open ? "✕" : "☰";
  });
  window.addEventListener("scroll", () => $("#site-header").classList.toggle("scrolled", scrollY > 10));
}

/* ---------- PRODUCT CARD ---------- */
function card(p, btn = "View Details") {
  const link = `product.html?id=${p.id}`;
  return `<article class="product-card">
    <a href="${link}" class="pc-img"><img src="${p.img}" alt="${p.name} - ${p.catName}" loading="lazy">${p.best ? '<span class="tag">Best Seller</span>' : p.isNew ? '<span class="tag">New</span>' : ""}</a>
    <div class="pc-body"><span class="pc-cat">${p.catName}</span><h3>${p.name}</h3><p>${p.desc}</p>
    <div class="pc-foot"><strong>${money(p.price)}</strong><a class="btn btn-small" href="${link}">${btn}</a></div></div></article>`;
}
function fill(id, list, btn) { const el = document.getElementById(id); if (el) el.innerHTML = list.map(p => card(p, btn)).join(""); }
const byName = n => PRODUCTS.find(p => p.name === n);

/* ---------- PAGES ---------- */
function showMsg(el, text) { el.textContent = text; el.classList.add("show"); }

function initHome() {
  $("#hero-art").innerHTML = ["Eyeshadow Palette", "Matte Lipstick", "Liquid Foundation"].map(n => `<img src="${byName(n).img}" alt="${n}">`).join("");
  fill("featured-grid", PRODUCTS.filter(p => p.featured).slice(0, 6));
  fill("home-best", PRODUCTS.filter(p => p.best).slice(0, 4));
  fill("new-grid", PRODUCTS.filter(p => p.isNew).slice(0, 4));
  $("#intro-art").innerHTML = ["Blush", "Lip Oil", "Highlighter", "Mascara"].map(n => `<img src="${byName(n).img}" alt="${n}">`).join("");
  const form = $("#news-form");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const em = $("#news-email");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim())) { showMsg($("#news-msg"), "Please enter a valid email address."); return; }
    showMsg($("#news-msg"), "Thank you for subscribing! (Demo only: no email is actually saved.)");
    form.reset();
  });
}

function initCategories() {
  const cat = params.get("cat"), box = $("#cat-content");
  const tabs = `<div class="tabs"><a href="categories.html" class="${cat ? "" : "on"}">All Categories</a>${Object.keys(CATS).map(k => `<a href="categories.html?cat=${k}" class="${cat === k ? "on" : ""}">${CATS[k]}</a>`).join("")}</div>`;
  if (CATS[cat]) {
    $("#page-title").textContent = CATS[cat];
    $("#page-sub").textContent = CAT_INFO[cat];
    box.innerHTML = tabs + `<div class="product-grid">${PRODUCTS.filter(p => p.cat === cat).map(p => card(p)).join("")}</div>`;
  } else {
    const tiles = Object.keys(CATS).map((k, i) => {
      const first = PRODUCTS.find(p => p.cat === k);
      return `<a class="cat-tile c${i + 1}" href="categories.html?cat=${k}"><img src="${first.img}" alt="${CATS[k]}"><h3>${CATS[k]}</h3><p>${CAT_INFO[k]}</p><p><strong>${PRODUCTS.filter(p => p.cat === k).length} products &rarr;</strong></p></a>`;
    }).join("");
    box.innerHTML = tabs + `<div class="cat-grid">${tiles}</div>`;
  }
}

function initProduct() {
  const p = PRODUCTS.find(x => x.id === params.get("id")), box = $("#product-detail");
  if (!p) { box.innerHTML = '<p>Product not found. <a href="categories.html">Browse all categories</a>.</p>'; return; }
  document.title = `${p.name} | AYRA GLOW`;
  box.innerHTML = `<div class="pd-img"><img src="${p.img}" alt="${p.name} - ${p.catName}"></div>
  <div class="pd-info"><span class="pc-cat">${p.catName}</span><h1>${p.name}</h1>${p.best ? '<span class="tag inline">Best Seller</span>' : ""}
  <p class="pd-price">${money(p.price)}</p><p>${p.desc}</p>
  <h3>Available Shades / Variants</h3><div class="shades">${p.shades.map((s, i) => `<button type="button" class="chip${i ? "" : " on"}">${s}</button>`).join("")}</div>
  <h3>Product Details</h3><ul class="detail-list">${p.details.map(d => `<li>${d}</li>`).join("")}</ul>
  <p class="demo-note">Catalog / demo listing. The price shown is a sample price.</p>
  <div class="btn-row"><a class="btn btn-primary" href="categories.html?cat=${p.cat}">Back to ${p.catName}</a><a class="btn btn-ghost" href="contact.html">Ask About This Product</a></div></div>`;
  box.querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => { box.querySelectorAll(".chip").forEach(x => x.classList.remove("on")); c.classList.add("on"); }));
  fill("related-grid", PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4));
}

function initAuthor() {
  const pics = ["Eyeshadow Palette", "Matte Lipstick", "Liquid Foundation", "Blush", "Lip Gloss", "Highlighter", "Mascara", "Glitter Eyeshadow"]
    .map(n => `<figure><img src="${byName(n).img}" alt="${n}"><figcaption>${n}</figcaption></figure>`).join("");
  const looks = [["Soft Glam", "#F72585,#C77DFF"], ["Bold Lips", "#7209B7,#F72585"], ["Glitter Night", "#3C096C,#C77DFF"], ["Fresh Face", "#FF8FB1,#FFE5F1"]]
    .map(l => `<figure><div class="tile" style="background:linear-gradient(135deg,${l[1]})">${l[0]}</div><figcaption>Beauty inspiration</figcaption></figure>`).join("");
  const site = ["Home page", "Categories page"].map(t => `<figure><div class="tile" style="background:linear-gradient(135deg,#7209B7,#F72585)">${t}</div><figcaption>Website image</figcaption></figure>`).join("");
  $("#gallery-grid").innerHTML = pics + looks + site;
}

function initContact() {
  const f = $("#contact-form"), ids = ["name", "email", "subject", "message"];
  const rules = {
    name: v => v ? "" : "Please enter your full name.",
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Please enter a valid email address.",
    subject: v => v ? "" : "Please enter a subject.",
    message: v => v.length >= 10 ? "" : "Please write at least 10 characters."
  };
  f.addEventListener("submit", e => {
    e.preventDefault();
    let ok = true;
    ids.forEach(id => {
      const el = $("#" + id), err = rules[id](el.value.trim());
      el.classList.toggle("err", !!err);
      $("#" + id + "-err").textContent = err;
      if (err) ok = false;
    });
    if (ok) { showMsg($("#form-msg"), `Thank you, ${$("#name").value.trim()}! Your message was received. (Demo form: no real email is sent.)`); f.reset(); }
  });
}

buildLayout();
({ home: initHome, categories: initCategories, bestsellers: () => fill("best-grid", PRODUCTS.filter(p => p.best), "View Product"),
   product: initProduct, author: initAuthor, contact: initContact, admin: initAdmin })[page]?.();
