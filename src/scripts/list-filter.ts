function initListFilter() {
  const writingsSection =
    document.querySelector<HTMLElement>(".writings-section");
  if (!writingsSection) return;

  const rows = document.querySelectorAll<HTMLElement>(
    ".writings-section .writing-row",
  );
  const searchInput = document.getElementById(
    "search-input",
  ) as HTMLInputElement | null;
  const resultCount = document.querySelector<HTMLElement>(".result-count");

  const allCatBtn = document.querySelector<HTMLButtonElement>(
    '.cat-btn[data-cat="all"]',
  );
  const filterCatBtns = document.querySelectorAll<HTMLButtonElement>(
    '.cat-btn:not([data-cat="all"])',
  );
  const allTagPill = document.querySelector<HTMLButtonElement>(
    '.tag-pill[data-tag="all"]',
  );
  const filterTagPills = document.querySelectorAll<HTMLButtonElement>(
    '.tag-pill:not([data-tag="all"])',
  );

  const rowData = Array.from(rows).map((row) => ({
    el: row,
    kind: row.dataset.kind ?? "",
    tags: JSON.parse(row.dataset.tags || "[]") as string[],
    title: row.dataset.title ?? "",
    link: row.querySelector("a"),
  }));

  let searchQuery = "";
  const activeCats = new Set<string>();
  const activeTags = new Set<string>();

  function highlightText(text: string, query: string): string {
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(${escaped})`, "gi");
    return text.replace(re, `<mark class="search-highlight">$1</mark>`);
  }

  function syncButtons() {
    const noCats = activeCats.size === 0;
    const noTags = activeTags.size === 0;

    allCatBtn?.classList.toggle("active", noCats);
    allCatBtn?.setAttribute("aria-pressed", String(noCats));
    filterCatBtns.forEach((b) => {
      const isActive = activeCats.has(b.dataset.cat ?? "");
      b.classList.toggle("active", isActive);
      b.setAttribute("aria-pressed", String(isActive));
    });

    allTagPill?.classList.toggle("active", noTags);
    allTagPill?.setAttribute("aria-pressed", String(noTags));
    filterTagPills.forEach((p) => {
      const isActive = activeTags.has(p.dataset.tag ?? "");
      p.classList.toggle("active", isActive);
      p.setAttribute("aria-pressed", String(isActive));
    });
  }

  function updateTagCounts() {
    filterTagPills.forEach((pill) => {
      const sup = pill.querySelector(".tag-count");
      if (!sup) return;
      if (activeCats.size === 0) {
        sup.textContent = pill.dataset.countAll || "0";
      } else {
        let total = 0;
        activeCats.forEach((cat) => {
          const key = `count-${cat}`.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
          total += parseInt(pill.dataset[key] || "0", 10);
        });
        sup.textContent = String(total);
      }
    });
  }

  function updateVisibility() {
    const showAllCats = activeCats.size === 0;
    const showAllTags = activeTags.size === 0;

    syncButtons();

    let visible = 0;
    const query = searchQuery.toLowerCase();
    rowData.forEach(({ el, kind, tags, title, link }) => {
      const catMatch = showAllCats || activeCats.has(kind);
      const tagMatch = showAllTags || tags.some((t) => activeTags.has(t));
      const searchMatch = !searchQuery || title.toLowerCase().includes(query);

      const show = catMatch && tagMatch && searchMatch;
      el.style.display = show ? "" : "none";
      if (show) visible++;
      if (link) link.innerHTML =
        searchQuery && searchMatch
          ? highlightText(title, searchQuery)
          : title;
    });

    if (resultCount) resultCount.textContent = `${visible} ${visible === 1 ? "result" : "results"}`;
  }

  let searchTimer: number;
  searchInput?.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      searchQuery = searchInput?.value.trim() ?? "";
      updateVisibility();
    }, 100);
  });

  allCatBtn?.addEventListener("click", () => {
    activeCats.clear();
    updateTagCounts();
    updateVisibility();
  });

  filterCatBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.cat ?? "";
      if (activeCats.has(cat)) {
        activeCats.delete(cat);
      } else {
        activeCats.add(cat);
      }
      updateTagCounts();
      updateVisibility();
    });
  });

  allTagPill?.addEventListener("click", () => {
    activeTags.clear();
    updateVisibility();
  });

  filterTagPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const tag = pill.dataset.tag ?? "";
      if (activeTags.has(tag)) {
        activeTags.delete(tag);
      } else {
        activeTags.add(tag);
      }
      updateVisibility();
    });
  });

  updateVisibility();
}

document.addEventListener("astro:page-load", initListFilter);
