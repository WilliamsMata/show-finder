const d = document;

const $searcher = d.querySelector(".search"),
  $main = d.querySelector("main"),
  $fragment = d.createDocumentFragment();

const tvMazeApi = async (url) => {
  try {
    //conectamos con api
    let res = await fetch(url),
      //obtenemos json
      json = await res.json();

    //Manejamos los errores y los retornamos en un objeto
    if (!res.ok) throw { status: res.status, statusText: res.statusText };

    // retornamos el obj de la api
    return json;
  } catch (error) {
    console.log(error);
  }
};

const mostrarResultados = (data) => {
  $main.innerHTML = "";

  for (const obj of data) {
    const show = obj.show;

    let showGenres = "";
    show.genres.forEach((genre) => {
      showGenres += `<li>${genre}</li>`;
    });

    const year = show.premiered.split("-")[0];

    const showCard = `
      <h2>${show.name}</h2>
      <div class="show-flex">
        <div class="show-info">
          <div class="rating">
            <span><b>Rating:</b></span> <span>${show.rating.average}</span>
          </div>
          <div class="genres">
            <h3>Genres:</h3>
            <ul>
              ${showGenres}
            </ul>
          </div>
          <div class="year">
            <span><b>Year: </b></span><span>${year}</span>
          </div>
        </div>
        <div class="show-img">
          <img
            src="${show.image.medium}"
            alt="${show.name}"
          />
        </div>
      </div>
      <div class="show-summary">
        ${show.summary}
      </div>
    `;

    const $showCard = d.createElement("article");
    $showCard.classList.add("show-container");
    $showCard.innerHTML = showCard;

    $main.appendChild($showCard);
  }
};

d.addEventListener("keyup", async (e) => {
  //if (e.key === "Enter")
  if (e.target.matches(".search")) {
    let input = $searcher.value.replaceAll(" ", "+");

    const url = `https://api.tvmaze.com/search/shows?q=${input}`;

    const data = await tvMazeApi(url);

    mostrarResultados(data);
  }
});
