const CARD_UUID_RE =
  /cards\.scryfall\.io\/[^?#]*\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.[a-z]+/i;

function cardUuid(img) {
  for (const val of [img.src, img.getAttribute("data-src")]) {
    const m = val && val.match(CARD_UUID_RE);
    if (m) return m[1];
  }
  return null;
}

function attach(img) {
  if (img.dataset.sfapiDone) {
    return;
  }

  // However we exit this function, we don't need to check again.
  img.dataset.sfapiDone = "1";

  if (img.closest(".homepage-collage")) {
    return;
  }

  const uuid = cardUuid(img);
  if (!uuid) {
    return;
  }

  // Mark the existing parent as a positioning host — no new wrapper element,
  // so the flex/grid layout is undisturbed.
  const parent = img.parentNode;
  parent.classList.add("sfapi-host");

  const link = document.createElement("a");
  link.className = "sfapi-lnk";
  link.href = `https://api.scryfall.com/cards/${uuid}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "{}";
  link.addEventListener("click", (e) => e.stopPropagation());
  parent.appendChild(link);
}

function scan(root) {
  (root || document).querySelectorAll("img").forEach(attach);
}

scan();

new MutationObserver((mutations) => {
  for (const m of mutations) {
    if (m.type === "childList") {
      m.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        if (node.tagName === "IMG") attach(node);
        else if (node.querySelectorAll)
          node.querySelectorAll("img").forEach(attach);
      });
    } else if (m.type === "attributes" && m.target.tagName === "IMG") {
      attach(m.target);
    }
  }
}).observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ["src", "data-src"],
});
