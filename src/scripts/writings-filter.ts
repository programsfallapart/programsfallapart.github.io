function initWritings() {
  const catBtns = document.querySelectorAll<HTMLButtonElement>(".cat-btn");
  const writingsSection =
    document.querySelector<HTMLElement>(".writings-section");
  if (!writingsSection) return;

  const rows = document.querySelectorAll<HTMLElement>(
    ".writings-section .writing-row",
  );
  const searchInput = document.getElementById(
    "search-input",
  ) as HTMLInputElement;
  const resultCount = document.querySelector<HTMLElement>(".result-count")!;

  const allTagPill = document.querySelector<HTMLButtonElement>(
    '.tag-pill[data-tag="all"]',
  );
  const filterTagPills = document.querySelectorAll<HTMLButtonElement>(
    '.tag-pill:not([data-tag="all"])',
  );

  // Pre-parse tags once instead of on every filter
  const rowData = Array.from(rows).map((row) => ({
    el: row,
    kind: row.dataset.kind!,
    tags: JSON.parse(row.dataset.tags || "[]") as string[],
    title: row.dataset.title || "",
    link: row.querySelector("a")!,
  }));

  let activeCat = "all";
  let searchQuery = "";
  const activeTags = new Set<string>();

  function highlightText(text: string, query: string): string {
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(${escaped})`, "gi");
    return text.replace(re, `<mark class="search-highlight">$1</mark>`);
  }

  function updateTagCounts() {
    filterTagPills.forEach((pill) => {
      const count =
        pill.dataset[
          `count${activeCat.charAt(0).toUpperCase() + activeCat.slice(1)}`
        ] || "0";
      const sup = pill.querySelector(".tag-count");
      if (sup) sup.textContent = count;
    });
  }

  function updateVisibility() {
    const showAllTags = activeTags.size === 0;
    allTagPill?.classList.toggle("active", showAllTags);
    allTagPill?.setAttribute("aria-pressed", String(showAllTags));
    filterTagPills.forEach((p) => {
      const isActive = activeTags.has(p.dataset.tag!);
      p.classList.toggle("active", isActive);
      p.setAttribute("aria-pressed", String(isActive));
    });

    let visible = 0;
    const query = searchQuery.toLowerCase();
    rowData.forEach(({ el, kind, tags, title, link }) => {
      const catMatch = activeCat === "all" || kind === activeCat;
      const tagMatch = showAllTags || tags.some((t) => activeTags.has(t));
      const searchMatch = !searchQuery || title.toLowerCase().includes(query);

      const show = catMatch && tagMatch && searchMatch;
      el.style.display = show ? "" : "none";
      if (show) visible++;
      link.innerHTML =
        searchQuery && searchMatch
          ? highlightText(title, searchQuery)
          : title;
    });

    resultCount.textContent = `${visible} ${visible === 1 ? "result" : "results"}`;
  }

  let searchTimer: number;
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      searchQuery = searchInput.value.trim();
      updateVisibility();
    }, 100);
  });

  catBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeCat = btn.dataset.cat!;
      catBtns.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle("active", isActive);
        b.setAttribute("aria-pressed", String(isActive));
      });
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
      const tag = pill.dataset.tag!;
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

document.addEventListener("astro:page-load", initWritings);
