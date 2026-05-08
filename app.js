const films = [
  {
    id: 1,
    title: "Inception",
    year: 2010,
    genre: "Sci-Fi / Thriller",
    duration: 148,
    rating: 9.2,
    director: "Christopher Nolan",
    notes: "Sen ve snu s perfektní strukturou.",
    watched: true,
    favorite: true,
    watchlist: false,
  },
  {
    id: 2,
    title: "The Dark Knight",
    year: 2008,
    genre: "Akční / Drama",
    duration: 152,
    rating: 9.0,
    director: "Christopher Nolan",
    notes: "Temný rytíř a ikonický Joker.",
    watched: true,
    favorite: true,
    watchlist: false,
  },
  {
    id: 3,
    title: "Interstellar",
    year: 2014,
    genre: "Sci-Fi / Drama",
    duration: 169,
    rating: 8.7,
    director: "Christopher Nolan",
    notes: "Emotivní sci-fi s nádhernou hudbou.",
    watched: true,
    favorite: true,
    watchlist: false,
  },
  {
    id: 4,
    title: "Parasite",
    year: 2019,
    genre: "Thriller / Drama",
    duration: 132,
    rating: 8.6,
    director: "Bong Joon-ho",
    notes: "Skvělé tempo a satira.",
    watched: true,
    favorite: false,
    watchlist: false,
  },
  {
    id: 5,
    title: "Dune",
    year: 2021,
    genre: "Sci-Fi / Dobrodružství",
    duration: 155,
    rating: 8.0,
    director: "Denis Villeneuve",
    notes: "Obrovský svět a pečlivá audiovizuální stránka.",
    watched: true,
    favorite: false,
    watchlist: false,
  },
  {
    id: 6,
    title: "The Matrix",
    year: 1999,
    genre: "Sci-Fi / Akční",
    duration: 136,
    rating: 8.7,
    director: "Lana Wachowski, Lilly Wachowski",
    notes: "Kultovní sci-fi s revolučním vizuálem.",
    watched: true,
    favorite: true,
    watchlist: false,
  },
  {
    id: 7,
    title: "Fight Club",
    year: 1999,
    genre: "Drama / Thriller",
    duration: 139,
    rating: 8.8,
    director: "David Fincher",
    notes: "Témata identity a chaosu.",
    watched: true,
    favorite: false,
    watchlist: false,
  },
  {
    id: 8,
    title: "Blade Runner 2049",
    year: 2017,
    genre: "Sci-Fi",
    duration: 164,
    rating: 8.0,
    director: "Denis Villeneuve",
    notes: "Vizualně podmanivé pokračování.",
    watched: true,
    favorite: true,
    watchlist: false,
  },
  {
    id: 9,
    title: "Mad Max: Fury Road",
    year: 2015,
    genre: "Akční / Sci-Fi",
    duration: 120,
    rating: 8.1,
    director: "George Miller",
    notes: "Adrenalinová jízda od začátku do konce.",
    watched: false,
    favorite: true,
    watchlist: true,
  },
  {
    id: 10,
    title: "La La Land",
    year: 2016,
    genre: "Drama / Muzikál",
    duration: 128,
    rating: 8.0,
    director: "Damien Chazelle",
    notes: "Hudba, barvy a melancholie.",
    watched: true,
    favorite: false,
    watchlist: false,
  },
];

const state = {
  films: [...films],
  sortKey: "title",
  sortDir: "asc",
  selectedId: null,
  filters: {
    search: "",
    name: "",
    year: "",
    genre: "all",
    watched: "all",
    limit: "all",
  },
  editingId: null,
};

const dom = {
  tableBody: document.querySelector("#filmTableBody"),
  filterSummary: document.querySelector("#filterSummary"),
  filterName: document.querySelector("#filterName"),
  filterYear: document.querySelector("#filterYear"),
  filterGenre: document.querySelector("#filterGenre"),
  filterWatched: document.querySelector("#filterWatched"),
  filterLimit: document.querySelector("#filterLimit"),
  search: document.querySelector("#globalSearch"),
  resetFilters: document.querySelector("#resetFilters"),
  detailBody: document.querySelector("#detailBody"),
  statusTotal: document.querySelector("#statusTotal"),
  statusVisible: document.querySelector("#statusVisible"),
  statusWatched: document.querySelector("#statusWatched"),
  statusFavorites: document.querySelector("#statusFavorites"),
  toggleFavorite: document.querySelector("#toggleFavorite"),
  toggleWatchlist: document.querySelector("#toggleWatchlist"),
  toggleWatched: document.querySelector("#toggleWatched"),
  actionAdd: document.querySelector("#actionAdd"),
  actionEdit: document.querySelector("#actionEdit"),
  actionDelete: document.querySelector("#actionDelete"),
  filmModal: document.querySelector("#filmModal"),
  filmForm: document.querySelector("#filmForm"),
  modalLabel: document.querySelector("#filmModalLabel"),
  filmTitle: document.querySelector("#filmTitle"),
  filmYearInput: document.querySelector("#filmYear"),
  filmGenreInput: document.querySelector("#filmGenre"),
  filmDuration: document.querySelector("#filmDuration"),
  filmRating: document.querySelector("#filmRating"),
  filmDirector: document.querySelector("#filmDirector"),
  filmNotes: document.querySelector("#filmNotes"),
  filmWatched: document.querySelector("#filmWatched"),
  filmFavorite: document.querySelector("#filmFavorite"),
  filmWatchlist: document.querySelector("#filmWatchlist"),
};

const modalInstance = new bootstrap.Modal(dom.filmModal);

const formatDuration = (minutes) => {
  if (!minutes) return "-";
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return hours ? `${hours}h ${remainder}m` : `${remainder}m`;
};

const formatRating = (rating) =>
  typeof rating !== "number" || Number.isNaN(rating) ? "-" : rating.toFixed(1);

const getUniqueValues = (key) =>
  Array.from(new Set(state.films.map((film) => film[key]).filter(Boolean))).sort(
    (a, b) => ("" + a).localeCompare("" + b, "cs", { numeric: true })
  );

const populateFilters = () => {
  const genres = getUniqueValues("genre");
  dom.filterGenre.innerHTML =
    `<option value="all">Vše</option>` +
    genres.map((genre) => `<option value="${genre}">${genre}</option>`).join("");
};

const getFilteredFilms = () => {
  const { search, name, year, genre, watched, limit } = state.filters;
  const normalizedSearch = search.trim().toLowerCase();
  const normalizedName = name.trim().toLowerCase();

  const parsedYear = Number(year);
  const hasYearFilter = year !== "";

  let result = state.films.filter((film) => {
    const matchesSearch =
      !normalizedSearch ||
      [film.title, film.director, film.genre]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedSearch));

    const matchesName =
      !normalizedName || film.title.toLowerCase().includes(normalizedName);

    const matchesYear = !hasYearFilter || (!Number.isNaN(parsedYear) && film.year === parsedYear);

    const matchesGenre = genre === "all" || film.genre === genre;

    let matchesWatched = true;
    if (watched === "watched") matchesWatched = film.watched;
    if (watched === "unwatched") matchesWatched = !film.watched;

    return matchesSearch && matchesName && matchesYear && matchesGenre && matchesWatched;
  });

  result = result.sort((a, b) => {
    const { sortKey, sortDir } = state;
    const valueA = a[sortKey];
    const valueB = b[sortKey];

    if (typeof valueA === "string") {
      return sortDir === "asc"
        ? valueA.localeCompare(valueB, "cs")
        : valueB.localeCompare(valueA, "cs");
    }

    return sortDir === "asc" ? valueA - valueB : valueB - valueA;
  });

  if (limit !== "all") {
    result = result.slice(0, Number(limit));
  }

  return result;
};

const renderTable = () => {
  const filmsToRender = getFilteredFilms();

  dom.tableBody.innerHTML = filmsToRender
    .map((film) => {
      const statusIcons = [
        film.watched ? '<i class="bi bi-check-lg text-success"></i>' : "",
        film.favorite ? '<i class="bi bi-heart-fill text-danger"></i>' : "",
        film.watchlist ? '<i class="bi bi-bookmark-check-fill text-warning"></i>' : "",
      ]
        .filter(Boolean)
        .join("");

      return `
        <tr data-id="${film.id}" class="${film.id === state.selectedId ? "table-active" : ""}">
          <td>${film.title}</td>
          <td>${film.year}</td>
          <td>${film.genre}</td>
          <td>${formatRating(film.rating)}</td>
          <td>${film.duration}</td>
          <td><div class="status-icons">${statusIcons || "-"}</div></td>
        </tr>
      `;
    })
    .join("");

  dom.filterSummary.textContent = `Zobrazeno ${filmsToRender.length} z ${state.films.length}`;
  updateStatusBar(filmsToRender.length);
};

const renderDetail = () => {
  const film = state.films.find((item) => item.id === state.selectedId);

  if (!film) {
    dom.detailBody.innerHTML = `
      <div class="detail-placeholder">
        <div class="detail-title">Vyberte film</div>
        <div class="text-secondary">Rok / Žánr / Režisér</div>
        <div class="detail-status">Stav</div>
        <div class="detail-box">Vyberte film v tabulce pro zobrazení detailů.</div>
      </div>
    `;
    setActionButtonsDisabled(true);
    return;
  }

  dom.detailBody.innerHTML = `
    <div class="detail-placeholder">
      <div class="detail-title">${film.title}</div>
      <div class="text-secondary">${film.year} / ${film.genre} / ${film.director}</div>
      <div class="detail-status">Stav</div>
      <div class="detail-box">${film.notes || "Bez poznámek."}</div>
    </div>
  `;

  setActionButtonsDisabled(false);
};

const updateStatusBar = (visibleCount) => {
  const total = state.films.length;
  const watched = state.films.filter((film) => film.watched).length;
  const favorites = state.films.filter((film) => film.favorite).length;

  dom.statusTotal.textContent = total;
  dom.statusVisible.textContent = visibleCount;
  dom.statusWatched.textContent = watched;
  dom.statusFavorites.textContent = favorites;
};

const setActionButtonsDisabled = (disabled) => {
  dom.toggleFavorite.disabled = disabled;
  dom.toggleWatchlist.disabled = disabled;
  dom.toggleWatched.disabled = disabled;
  dom.actionEdit.disabled = disabled;
  dom.actionDelete.disabled = disabled;
};

const renderAll = () => {
  renderTable();
  renderDetail();
};

const openModal = (film = null) => {
  if (film) {
    state.editingId = film.id;
    dom.modalLabel.textContent = "Upravit film";
    dom.filmTitle.value = film.title;
    dom.filmYearInput.value = film.year;
    dom.filmGenreInput.value = film.genre;
    dom.filmDuration.value = film.duration;
    dom.filmRating.value = film.rating;
    dom.filmDirector.value = film.director || "";
    dom.filmNotes.value = film.notes || "";
    dom.filmWatched.checked = film.watched;
    dom.filmFavorite.checked = film.favorite;
    dom.filmWatchlist.checked = film.watchlist;
  } else {
    state.editingId = null;
    dom.modalLabel.textContent = "Přidat film";
    dom.filmForm.reset();
  }

  modalInstance.show();
};

const deleteFilm = (film) => {
  if (!confirm(`Opravdu smazat film "${film.title}"?`)) return;
  state.films = state.films.filter((item) => item.id !== film.id);
  if (state.selectedId === film.id) {
    state.selectedId = null;
  }
  populateFilters();
  renderAll();
};

const submitFilm = (event) => {
  event.preventDefault();
  const filmData = {
    title: dom.filmTitle.value.trim(),
    year: Number(dom.filmYearInput.value),
    genre: dom.filmGenreInput.value.trim(),
    duration: Number(dom.filmDuration.value),
    rating: Number(dom.filmRating.value),
    director: dom.filmDirector.value.trim(),
    notes: dom.filmNotes.value.trim(),
    watched: dom.filmWatched.checked,
    favorite: dom.filmFavorite.checked,
    watchlist: dom.filmWatchlist.checked,
  };

  if (state.editingId) {
    state.films = state.films.map((film) =>
      film.id === state.editingId ? { ...film, ...filmData } : film
    );
  } else {
    const nextId = state.films.reduce((maxId, film) => Math.max(maxId, film.id), 0) + 1;
    state.films.unshift({ id: nextId, ...filmData });
  }

  populateFilters();
  renderAll();
  modalInstance.hide();
};

const handleToggle = (field) => {
  const film = state.films.find((item) => item.id === state.selectedId);
  if (!film) return;
  film[field] = !film[field];
  renderAll();
};

const bindEvents = () => {
  dom.tableBody.addEventListener("click", (event) => {
    const row = event.target.closest("tr");
    if (!row) return;
    state.selectedId = Number(row.dataset.id);
    renderAll();
  });

  document.querySelector("#filmTable thead").addEventListener("click", (event) => {
    const header = event.target.closest("th[data-sort]");
    if (!header) return;
    const key = header.dataset.sort;
    if (state.sortKey === key) {
      state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
    } else {
      state.sortKey = key;
      state.sortDir = "asc";
    }
    renderTable();
  });

  dom.search.addEventListener("input", (event) => {
    state.filters.search = event.target.value;
    renderTable();
  });

  dom.filterName.addEventListener("input", (event) => {
    state.filters.name = event.target.value;
    renderTable();
  });

  dom.filterYear.addEventListener("input", (event) => {
    state.filters.year = event.target.value;
    renderTable();
  });

  dom.filterGenre.addEventListener("change", (event) => {
    state.filters.genre = event.target.value;
    renderTable();
  });

  dom.filterWatched.addEventListener("change", (event) => {
    state.filters.watched = event.target.value;
    renderTable();
  });

  dom.filterLimit.addEventListener("change", (event) => {
    state.filters.limit = event.target.value;
    renderTable();
  });

  dom.resetFilters.addEventListener("click", () => {
    state.filters = {
      search: "",
      name: "",
      year: "",
      genre: "all",
      watched: "all",
      limit: "all",
    };
    dom.search.value = "";
    dom.filterName.value = "";
    dom.filterYear.value = "";
    dom.filterWatched.value = "all";
    dom.filterLimit.value = "all";
    populateFilters();
    renderTable();
  });

  dom.actionAdd.addEventListener("click", () => openModal());
  dom.actionEdit.addEventListener("click", () => {
    const film = state.films.find((item) => item.id === state.selectedId);
    if (film) openModal(film);
  });
  dom.actionDelete.addEventListener("click", () => {
    const film = state.films.find((item) => item.id === state.selectedId);
    if (film) deleteFilm(film);
  });

  dom.toggleFavorite.addEventListener("click", () => handleToggle("favorite"));
  dom.toggleWatchlist.addEventListener("click", () => handleToggle("watchlist"));
  dom.toggleWatched.addEventListener("click", () => handleToggle("watched"));

  dom.filmForm.addEventListener("submit", submitFilm);
};

populateFilters();
state.selectedId = state.films[0]?.id ?? null;
renderAll();
bindEvents();
