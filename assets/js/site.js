(function () {
  "use strict";
  var fr = document.body.dataset.lang === "fr";
  var theme = document.querySelector("[data-theme-toggle]");
  if (theme) {
    theme.hidden = false;
    function setThemeState() {
      var dark = document.documentElement.dataset.theme === "dark";
      theme.setAttribute("aria-pressed", String(dark));
      theme.setAttribute("aria-label", fr ? "Thème sombre" : "Dark theme");
    }
    setThemeState();
    theme.addEventListener("click", function () {
      var next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem("md-theme", next); } catch (e) {}
      setThemeState();
    });
  }
  var print = document.querySelector("[data-print]");
  if (print) { print.hidden = false; print.addEventListener("click", function () { window.print(); }); }
  var toc = document.querySelector(".article-toc details");
  if (toc) {
    var narrow = window.matchMedia("(max-width: 760px)");
    function setToc() { toc.open = !narrow.matches; }
    setToc();
    narrow.addEventListener("change", setToc);
  }
  var math = document.querySelector("[data-math-content]");
  if (math && typeof window.renderMathInElement === "function") {
    window.renderMathInElement(math, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true }
      ],
      throwOnError: false,
      trust: false,
      strict: "warn",
      macros: { "\\_": "_" }
    });
  }
  function normalize(text) { return String(text).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }
  var noteQuery = document.getElementById("note-query");
  if (noteQuery) {
    noteQuery.closest(".note-filter").hidden = false;
    var notes = Array.from(document.querySelectorAll("[data-note]"));
    var noteCount = document.getElementById("note-count");
    function filterNotes() {
      var tokens = normalize(noteQuery.value).trim().split(/\s+/).filter(Boolean);
      var count = 0;
      notes.forEach(function (note) {
        note.hidden = !tokens.every(function (word) { return normalize(note.dataset.note).includes(word); });
        if (!note.hidden) count++;
      });
      noteCount.textContent = fr ? count + " note(s)" : count + " note(s)";
    }
    noteQuery.addEventListener("input", filterNotes);
    filterNotes();
  }
  var dialog = document.getElementById("site-search");
  var open = document.querySelector("[data-search-open]");
  if (!dialog || !open || typeof dialog.showModal !== "function") return;
  open.hidden = false;
  var input = document.getElementById("search-input");
  var results = document.getElementById("search-results");
  var status = document.getElementById("search-status");
  var index = null;
  var pending = null;
  var lastFocus = null;
  function renderResults() {
    if (!index) return;
    var tokens = normalize(input.value).trim().split(/\s+/).filter(Boolean);
    results.replaceChildren();
    if (!tokens.length) { status.textContent = fr ? "Saisissez un sujet pour parcourir le site." : "Enter a topic to explore the site."; return; }
    var matches = index.map(function (page) {
      var title = normalize(page.title);
      var text = normalize(page.title + " " + page.description + " " + page.text);
      var match = tokens.every(function (word) { return text.includes(word); });
      var score = tokens.reduce(function (sum, word) { return sum + (title.includes(word) ? 10 : 1); }, 0);
      return { page: page, match: match, score: score };
    }).filter(function (item) { return item.match; }).sort(function (a, b) { return b.score - a.score; });
    status.textContent = matches.length ? (fr ? matches.length + " résultat(s)" : matches.length + " result(s)") : (fr ? "Aucun résultat. Essayez un autre mot-clé." : "No results. Try another keyword.");
    matches.slice(0, 15).forEach(function (item) {
      var li = document.createElement("li");
      var link = document.createElement("a");
      link.href = item.page.url;
      link.textContent = item.page.title;
      li.appendChild(link);
      var description = document.createElement("p");
      description.textContent = item.page.description;
      li.appendChild(description);
      results.appendChild(li);
    });
  }
  function openSearch() {
    if (dialog.open) return;
    lastFocus = document.activeElement;
    dialog.showModal();
    input.focus();
    if (index) { renderResults(); return; }
    status.textContent = fr ? "Chargement…" : "Loading…";
    if (!pending) {
      pending = fetch(document.body.dataset.searchUrl).then(function (response) {
        if (!response.ok) throw new Error("Search unavailable");
        return response.json();
      }).then(function (data) { index = data; }).catch(function () {
        pending = null;
        status.textContent = fr ? "Recherche indisponible. Les projets et les notes restent accessibles dans le menu." : "Search is unavailable. Projects and notes are available in the menu.";
      });
    }
    pending.then(renderResults);
  }
  open.addEventListener("click", openSearch);
  input.addEventListener("input", renderResults);
  document.querySelector("[data-search-close]").addEventListener("click", function () { dialog.close(); });
  dialog.addEventListener("close", function () { if (lastFocus) lastFocus.focus(); });
  dialog.addEventListener("click", function (event) { if (event.target === dialog) { var r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
  document.addEventListener("keydown", function (event) {
    var typing = /INPUT|TEXTAREA|SELECT/.test(event.target.tagName) || event.target.isContentEditable;
    if (event.key === "/" && !typing && !event.ctrlKey && !event.metaKey && !event.altKey) { event.preventDefault(); openSearch(); }
  });
})();
