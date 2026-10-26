// Renders the page from data.js, handles theme, menu and project search.
(function () {
  const P = PORTFOLIO;
  const $ = (id) => document.getElementById(id);

  // ---- Fill in profile details ----
  document.title = P.name + " | Personal Portfolio";
  $("brandName").textContent = P.name;
  $("heroName").textContent = P.name;
  $("heroRole").textContent = P.role;
  $("heroTagline").textContent = P.tagline;
  $("githubBtn").href = P.contact.github;
  $("aboutText").textContent = P.about;
  $("aboutLocation").textContent = "Based in " + P.location;
  $("eduDegree").textContent = P.education.degree;
  $("eduSchool").textContent = P.education.school + " · " + P.education.years;
  $("contactEmail").textContent = P.contact.email;
  $("contactEmail").href = "mailto:" + P.contact.email;
  $("contactGithub").textContent = P.contact.githubLabel;
  $("contactGithub").href = P.contact.github;
  $("contactLocation").textContent = P.location;
  $("footerText").textContent =
    "© " + new Date().getFullYear() + " " + P.name + ". All rights reserved.";

  // ---- Skills ----
  $("skillList").innerHTML = P.skills.map((s) => '<span class="pill">' + esc(s) + "</span>").join("");

  // ---- Theme toggle (remembers choice) ----
  const root = document.documentElement;
  const themeBtn = $("themeToggle");
  function syncThemeIcon() {
    themeBtn.innerHTML = root.getAttribute("data-theme") === "light" ? "&#127769;" : "&#9728;&#65039;";
  }
  syncThemeIcon();
  themeBtn.addEventListener("click", function () {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    syncThemeIcon();
  });

  // ---- Mobile menu ----
  const menu = $("navMenu");
  const menuBtn = $("menuToggle");
  menuBtn.addEventListener("click", function () {
    const open = menu.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      menu.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });

  // ---- Projects: cards, search, filter buttons ----
  let activeTag = "All";
  let query = "";

  const allTags = [];
  P.projects.forEach(function (p) {
    p.tags.forEach(function (t) { if (allTags.indexOf(t) === -1) allTags.push(t); });
  });

  function renderFilters() {
    const tags = ["All"].concat(allTags);
    $("filterRow").innerHTML = tags
      .map(function (t) {
        return '<button type="button" class="filter-btn' + (t === activeTag ? " active" : "") +
          '" data-tag="' + esc(t) + '">' + esc(t) + "</button>";
      })
      .join("");
  }

  function renderProjects() {
    const q = query.trim().toLowerCase();
    const list = P.projects.filter(function (p) {
      const matchesTag = activeTag === "All" || p.tags.indexOf(activeTag) !== -1;
      const haystack = (p.title + " " + p.description + " " + p.tags.join(" ")).toLowerCase();
      return matchesTag && (!q || haystack.indexOf(q) !== -1);
    });

    $("resultCount").textContent = "Showing " + list.length + " of " + P.projects.length + " projects";
    $("noResults").hidden = list.length !== 0;
    $("projectGrid").innerHTML = list
      .map(function (p) {
        const live = p.live
          ? '<a class="card-link" href="' + esc(p.live) + '" target="_blank" rel="noopener">Live Demo</a>'
          : "";
        return (
          '<article class="project-card">' +
          "<h3>" + esc(p.title) + "</h3>" +
          "<p>" + esc(p.description) + "</p>" +
          '<div class="tag-row">' + p.tags.map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div>" +
          '<div class="card-links"><a class="card-link" href="' + esc(p.github) + '" target="_blank" rel="noopener">GitHub Repo</a>' + live + "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  $("projectSearch").addEventListener("input", function (e) {
    query = e.target.value;
    renderProjects();
  });
  $("filterRow").addEventListener("click", function (e) {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    activeTag = btn.getAttribute("data-tag");
    renderFilters();
    renderProjects();
  });

  renderFilters();
  renderProjects();

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
})();
