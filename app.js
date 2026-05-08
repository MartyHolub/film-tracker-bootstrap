const films = [
  {
    id: 1,
    title: "Blade Runner 2049",
    year: 2017,
    genre: "Sci-Fi",
    duration: 164,
    rating: 8.2,
    director: "Denis Villeneuve",
    notes: "Vizualně podmanivé pokračování s výbornou hudbou.",
    watched: true,
    favorite: true,
    watchlist: false,
  },
  {
    id: 2,
    title: "Parazit",
    year: 2019,
    genre: "Drama",
    duration: 132,
    rating: 8.6,
    director: "Bong Joon-ho",
    notes: "Skvělé tempo, střídání humoru a napětí.",
    watched: true,
    favorite: true,
    watchlist: false,
  },
  {
    id: 3,
    title: "Duna",
    year: 2021,
    genre: "Sci-Fi",
    duration: 155,
    rating: 8.0,
    director: "Denis Villeneuve",
    notes: "Obrovský svět a pečlivá audiovizuální stránka.",
    watched: true,
    favorite: false,
    watchlist: false,
  },
  {
    id: 4,
    title: "Whiplash",
    year: 2014,
    genre: "Drama",
    duration: 107,
    rating: 8.5,
    director: "Damien Chazelle",
    notes: "Intenzivní duel učitele a studenta.",
    watched: true,
    favorite: false,
    watchlist: false,
  },
  {
    id: 5,
    title: "Drive",
    year: 2011,
    genre: "Krimi",
    duration: 100,
    rating: 7.8,
    director: "Nicolas Winding Refn",
    notes: "Noční atmosféra, retro synth.",
    watched: true,
    favorite: false,
    watchlist: true,
  },
  {
    id: 6,
    title: "Spider-Man: Across the Spider-Verse",
    year: 2023,
    genre: "Animovaný",
    duration: 140,
    rating: 8.9,
    director: "Joaquim Dos Santos",
    notes: "Nejlepší animace posledních let.",
    watched: false,
    favorite: false,
    watchlist: true,
  },
  {
    id: 7,
    title: "Oppenheimer",
    year: 2023,
    genre: "Historický",
    duration: 180,
    rating: 8.7,
    director: "Christopher Nolan",
    notes: "Silné výkony a intenzivní střih.",
    watched: true,
    favorite: true,
    watchlist: false,
  },
  {
    id: 8,
    title: "The Grand Budapest Hotel",
    year: 2014,
    genre: "Komedie",
    duration: 99,
    rating: 8.1,
    director: "Wes Anderson",
    notes: "Precizní kompozice a vtipné dialogy.",
    watched: true,
    favorite: false,
    watchlist: false,
  },
  {
    id: 9,
    title: "Soul",
    year: 2020,
    genre: "Animovaný",
    duration: 100,
    rating: 8.3,
    director: "Pete Docter",
    notes: "Inspirativní příběh o hudbě a životě.",
    watched: true,
    favorite: false,
    watchlist: false,
  },
  {
    id: 10,
    title: "The Batman",
    year: 2022,
    genre: "Akční",
    duration: 176,
    rating: 7.9,
    director: "Matt Reeves",
    notes: "Detektivní pojetí a temná atmosféra.",
    watched: false,
    favorite: false,
    watchlist: true,
  },
];

const state = {
  films: [...films],
  sortKey: "title",
  sortDir: "asc",
  selectedId: null,
  filters: {
    search: "",
    year: "all",
    genre: "all",
    status: "all",
    limit: 25,
  },
  editingId: null,
};

const dom = {
  tableBody: document.querySelector("#filmTableBody"),
  countBadge: document.querySelector("#countBadge"),
  filterSummary: document.querySelector("#filterSummary"),
  filterYear: document.querySelector("#filterYear"),
  filterGenre: document.querySelector("#filterGenre"),
  filterStatus: document.querySelector("#filterStatus"),
  filterLimit: document.querySelector("#filterLimit"),
  search: document.querySelector("#globalSearch"),
  clearSearch: document.querySelector("#clearSearch"),
  resetFilters: document.querySelector("#resetFilters"),
  detailBody: document.querySelector("#detailBody"),
  statTotal: document.querySelector("#statTotal"),
  statWatched: document.querySelector("#statWatched"),
  statFavorites: document.querySelector("#statFavorites"),
  statWatchlist: document.querySelector("#statWatchlist"),
  statRating: document.querySelector("#statRating"),
  statRuntime: document.querySelector("#statRuntime"),
  ratingBar: document.querySelector("#ratingBar"),
  filmModal: document.querySelector("#filmModal"),
  filmForm: document.querySelector("#filmForm"),
  modalLabel: document.querySelector("#filmModalLabel"),
  filmTitle: document.querySelector("#filmTitle"),
  filmYear: document.querySelector("#filmYear"),
  filmGenre: document.querySelector("#filmGenre"),
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

const formatRating = (rating) => (rating ? rating.toFixed(1) : "-");

const getUniqueValues = (key) =>
  Array.from(new Set(state.films.map((film) => film[key]).filter(Boolean))).sort(
    (a, b) => ("" + a).localeCompare("" + b, "cs", { numeric: true })
  );

const populateFilters = () => {
  const years = getUniqueValues("year");
  dom.filterYear.innerHTML =
    `<option value="all">Všechny roky</option>` +
    years.map((year) => `<option value="${year}">${year}</option>`).join("");

  const genres = getUniqueValues("genre");
  dom.filterGenre.innerHTML =
    `<option value="all">Všechny žánry</option>` +
    genres.map((genre) => `<option value="${genre}">${genre}</option>`).join("");
};

const getFilteredFilms = () => {
  const { search, year, genre, status, limit } = state.filters;
  const normalizedSearch = search.trim().toLowerCase();

  let result = state.films.filter((film) => {
    const matchesSearch =
      !normalizedSearch ||
      [film.title, film.director, film.notes]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedSearch));

    const matchesYear = year === "all" || film.year === Number(year);
    const matchesGenre = genre === "all" || film.genre === genre;

    let matchesStatus = true;
    if (status === "watched") matchesStatus = film.watched;
    if (status === "unwatched") matchesStatus = !film.watched;
    if (status === "favorite") matchesStatus = film.favorite;
    if (status === "watchlist") matchesStatus = film.watchlist;

    return matchesSearch && matchesYear && matchesGenre && matchesStatus;
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
      const statusBadges = [
        film.watched ? `<span class="badge badge-status">Sledované</span>` : "",
        film.favorite ? `<span class="badge badge-status">Oblíbené</span>` : "",
        film.watchlist ? `<span class="badge badge-secondary">Watchlist</span>` : "",
      ]
        .filter(Boolean)
        .join(" ");

      return `
        <tr data-id="${film.id}" class="${film.id === state.selectedId ? "table-active" : ""}">
          <td>
            <div class="fw-semibold">${film.title}</div>
            <div class="text-secondary small">${film.director || "Neznámý režisér"}</div>
          </td>
          <td>${film.year}</td>
          <td>${film.genre}</td>
          <td>${formatDuration(film.duration)}</td>
          <td>
            <span class="badge text-bg-success">${formatRating(film.rating)}</span>
          </td>
          <td>
            <div class="d-flex flex-wrap gap-1">${statusBadges || "-"}</div>
          </td>
        </tr>
      `;
    })
    .join("");

  dom.countBadge.textContent = `${filmsToRender.length}`;
  const total = state.films.length;
  dom.filterSummary.textContent = `Zobrazeno ${filmsToRender.length} z ${total} filmů`;
};

const renderDetail = () => {
  const film = state.films.find((item) => item.id === state.selectedId);
  if (!film) {
    dom.detailBody.innerHTML = `
      <div class="placeholder-card text-center text-secondary">
        <i class="bi bi-film" aria-hidden="true"></i>
        <p class="mb-0">Vyberte film z tabulky</p>
      </div>
    `;
    return;
  }

  dom.detailBody.innerHTML = `
    <div class="d-grid gap-3">
      <div class="detail-poster">${film.genre}</div>
      <div>
        <h5 class="mb-1">${film.title}</h5>
        <div class="text-secondary">${film.year} · ${film.director || "Neznámý režisér"}</div>
      </div>
      <div class="d-flex flex-wrap gap-2">
        <span class="badge text-bg-success">Hodnocení ${formatRating(film.rating)}</span>
        <span class="badge text-bg-secondary">${formatDuration(film.duration)}</span>
        ${film.favorite ? `<span class="badge badge-status">Oblíbené</span>` : ""}
        ${film.watchlist ? `<span class="badge badge-secondary">Watchlist</span>` : ""}
      </div>
      <p class="mb-0">${film.notes || "Bez poznámek."}</p>
      <div class="detail-actions">
        <button class="btn btn-outline-secondary" id="toggleWatched">
          ${film.watched ? "Označit jako nesledované" : "Označit jako sledované"}
        </button>
        <button class="btn btn-outline-secondary" id="toggleFavorite">
          ${film.favorite ? "Odebrat z oblíbených" : "Přidat do oblíbených"}
        </button>
        <button class="btn btn-outline-secondary" id="toggleWatchlist">
          ${film.watchlist ? "Odebrat z watchlistu" : "Přidat do watchlistu"}
        </button>
        <div class="d-flex gap-2">
          <button class="btn btn-accent flex-grow-1" id="editFilm">
            Upravit film
          </button>
          <button class="btn btn-outline-danger" id="deleteFilm">
            Smazat
          </button>
        </div>
      </div>
    </div>
  `;

  dom.detailBody.querySelector("#toggleWatched").addEventListener("click", () => {
    film.watched = !film.watched;
    renderAll();
  });
  dom.detailBody.querySelector("#toggleFavorite").addEventListener("click", () => {
    film.favorite = !film.favorite;
    renderAll();
  });
  dom.detailBody.querySelector("#toggleWatchlist").addEventListener("click", () => {
    film.watchlist = !film.watchlist;
    renderAll();
  });
  dom.detailBody.querySelector("#editFilm").addEventListener("click", () => openModal(film));
  dom.detailBody.querySelector("#deleteFilm").addEventListener("click", () => deleteFilm(film));
};

const renderStats = () => {
  const total = state.films.length;
  const watched = state.films.filter((film) => film.watched).length;
  const favorites = state.films.filter((film) => film.favorite).length;
  const watchlist = state.films.filter((film) => film.watchlist).length;
  const ratingTotal = state.films.reduce((sum, film) => sum + film.rating, 0);
  const avgRating = total ? ratingTotal / total : 0;
  const totalDuration = state.films.reduce((sum, film) => sum + film.duration, 0);

  dom.statTotal.textContent = total;
  dom.statWatched.textContent = watched;
  dom.statFavorites.textContent = favorites;
  dom.statWatchlist.textContent = watchlist;
  dom.statRating.textContent = avgRating.toFixed(1);
  dom.statRuntime.textContent = `${Math.round(totalDuration / 60)} h`;
  dom.ratingBar.style.width = `${(avgRating / 10) * 100}%`;
};

const renderAll = () => {
  renderTable();
  renderDetail();
  renderStats();
};

const openModal = (film = null) => {
  if (film) {
    state.editingId = film.id;
    dom.modalLabel.textContent = "Upravit film";
    dom.filmTitle.value = film.title;
    dom.filmYear.value = film.year;
    dom.filmGenre.value = film.genre;
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
    year: Number(dom.filmYear.value),
    genre: dom.filmGenre.value.trim(),
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
    const nextId = Math.max(0, ...state.films.map((film) => film.id)) + 1;
    state.films.unshift({ id: nextId, ...filmData });
  }

  populateFilters();
  renderAll();
  modalInstance.hide();
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

  dom.clearSearch.addEventListener("click", () => {
    dom.search.value = "";
    state.filters.search = "";
    renderTable();
  });

  dom.filterYear.addEventListener("change", (event) => {
    state.filters.year = event.target.value;
    renderTable();
  });

  dom.filterGenre.addEventListener("change", (event) => {
    state.filters.genre = event.target.value;
    renderTable();
  });

  dom.filterStatus.addEventListener("change", (event) => {
    state.filters.status = event.target.value;
    renderTable();
  });

  dom.filterLimit.addEventListener("change", (event) => {
    state.filters.limit = event.target.value === "all" ? "all" : Number(event.target.value);
    renderTable();
  });

  dom.resetFilters.addEventListener("click", () => {
    state.filters = {
      search: "",
      year: "all",
      genre: "all",
      status: "all",
      limit: 25,
    };
    dom.search.value = "";
    dom.filterStatus.value = "all";
    dom.filterLimit.value = "25";
    populateFilters();
    renderTable();
  });

  dom.filmForm.addEventListener("submit", submitFilm);

  document
    .querySelector("[data-bs-target='#filmModal']")
    .addEventListener("click", () => openModal());
};

populateFilters();
state.selectedId = state.films[0]?.id ?? null;
renderAll();
bindEvents();
