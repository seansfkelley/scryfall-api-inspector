// Matches: https://cards.scryfall.io/{size}/{face}/{x}/{y}/{uuid}.{ext}
const CARD_UUID_RE =
  /cards\.scryfall\.io\/[^?#]*\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.[a-z]+/i;

function cardUuid(img) {
  // Check both src and data-src (lazy loaders swap these)
  for (const val of [img.src, img.getAttribute("data-src")]) {
    const m = val && val.match(CARD_UUID_RE);
    if (m) return m[1];
  }
  return null;
}

function wrap(img) {
  if (img.closest(".sfapi-wrap")) return; // already wrapped
  const uuid = cardUuid(img);
  if (!uuid) return;

  const wrapper = document.createElement("span");
  wrapper.className = "sfapi-wrap";

  img.parentNode.insertBefore(wrapper, img);
  wrapper.appendChild(img);

  const link = document.createElement("a");
  link.className = "sfapi-lnk";
  link.href = `https://api.scryfall.com/cards/${uuid}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "{}";
  link.addEventListener("click", (e) => e.stopPropagation());
  wrapper.appendChild(link);
}

function scan(root) {
  (root || document).querySelectorAll("img").forEach(wrap);
}

scan();

new MutationObserver((mutations) => {
  for (const m of mutations) {
    if (m.type === "childList") {
      m.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        if (node.tagName === "IMG") wrap(node);
        else if (node.querySelectorAll)
          node.querySelectorAll("img").forEach(wrap);
      });
    } else if (m.type === "attributes" && m.target.tagName === "IMG") {
      wrap(m.target);
    }
  }
}).observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ["src", "data-src"],
});
