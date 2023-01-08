const d = document;

const $searcher = d.querySelector(".search"),
  $main = d.querySelector("main"),
  $fragment = d.createDocumentFragment();

const tvMazeApi = async (url) => {
  try {
    //conectamos con api
    const res = await fetch(url);

    //Manejamos los errores y los retornamos en un objeto
    if (!res.ok) throw { status: res.status, statusText: res.statusText };

    //obtenemos json
    const json = await res.json();

    // retornamos el obj de la api
    return json;
  } catch (error) {
    console.log(error);
  }
};

const mostrarResultados = (data) => {
  $main.innerHTML = "";

  console.log(data);

  if (data.length === 0) {
    $main.innerHTML = `
      <div class="not-found">
        <h2>Not Found</h2>
        <img src="./undraw_notify_re_65on.svg" alt="not found" class="not-found-img">
      </div>
    `;
  }

  for (const obj of data) {
    const show = obj.show;

    let showGenres = "";
    show.genres.forEach((genre) => {
      showGenres += `<li>${genre}</li>`;
    });

    const year = show.premiered.split("-")[0];
    const rating = show.rating.average ? show.rating.average + "/10" : "?/10";

    const showCard = `
      <h2>${show.name}</h2>
      <div class="show-flex">
        <div class="show-info">
          <div class="year">
            <span><b>Year: </b></span><span>${year}</span>
          </div>
          <div class="genres">
            <h3>Genres:</h3>
            <ul>
              ${showGenres}
            </ul>
          </div>
          <div class="rating">
            <span><b>Rating:</b></span> <span>${rating}</span>
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

const search = async () => {
  let input = $searcher.value.replaceAll(" ", "+");

  const url = `https://api.tvmaze.com/search/shows?q=${input}`;

  const data = await tvMazeApi(url);

  mostrarResultados(data);
};

d.addEventListener("keyup", async (e) => {
  if (e.key === "Enter")
    if (e.target.matches(".search")) {
      $main.innerHTML =
        "<div class='lds-ring'><div></div><div></div><div></div><div></div></div>";
      await search();
    }
});

const showList = [
  "pokemon",
  "dark",
  "breaking bad",
  "game of thrones",
  "rick and morty",
  "attack on titan",
  "house of the dragon",
  "1899",
  "Steins;Gate",
  "vikings",
];

d.addEventListener("DOMContentLoaded", async (e) => {
  let randomShow = showList[Math.floor(Math.random() * showList.length)];
  $searcher.value = randomShow;

  $main.innerHTML =
    "<div class='lds-ring'><div></div><div></div><div></div><div></div></div>";
  await search();
});
