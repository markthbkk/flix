let movieTitle = "";
let moviePosterImage = "";
let movieYear = "";
let directorsinnerHTML = "";
let movieStarsString = "";
let starsArray = new Array(0);
let starsNamesInnerHTML = "";
let searchResults = new Array(0);

const queryFrame = document.getElementById("queryFrame");
const searchBox = document.getElementById("searchBox");
const searchBoxInput = document.getElementById("searchBoxInput");
const searchButton = document.getElementById("searchButton");
const recentViewsUL = document.getElementById("recentViewsUL");
const recentViews = document.getElementById("recentViews");
const clearHistory = document.getElementById("clearHistory");
const searchResultsFrame = document.getElementById("searchResultsFrame");
const searchResultsGrid = document.getElementById("searchResultsGrid");
const movieDataFrame = document.getElementById("movieDataFrame");
const movieData1 = document.getElementById("movieData1");
const movieTitleDiv = document.getElementById("movieTitle");
const posterImage = document.getElementById("posterImage");
const movieData2 = document.getElementById("movieData2");
const yearDiv = document.getElementById("year");
const yearDisplay = document.getElementById("yearDisplay");
const directorDiv = document.getElementById("director");
const directorNames = document.getElementById("directorNames");
const starsDiv = document.getElementById("stars");
const starsNames = document.getElementById("starsNames");
const plotDiv = document.getElementById("plot");
const directorDataFrame = document.getElementById("directorDataFrame");
const directorData1 = document.getElementById("directorData1");
const directorNameDiv = document.getElementById("directorName");
const directorImageDiv = document.getElementById("directorImageDiv");
const directorImageDivImg = document.getElementById("directorImage");
const directorSummaryDiv = document.getElementById("directorSummary");
const directorMovies = document.getElementById("directorMovies");
const directorSearchResultsGrid = document.getElementById(
  "directorSearchResultsGrid"
);
const actorData1 = document.getElementById("actorData1");
const actorNameDiv = document.getElementById("actorName");
const actorImageDiv = document.getElementById("actorImageDiv");
const actorImageDivImg = document.getElementById("actorImage");
const actorSummaryDiv = document.getElementById("actorSummary");
const actorMovies = document.getElementById("actorMovies");
const actorSearchResultsGrid = document.getElementById(
  "actorSearchResultsGrid"
);

let recentViewsArray = new Array();

function hideSection(frame) {
  frame.classList.add("hidden");
  let children = Array.from(frame.children);
  children.forEach((child) => {
    child.classList.add("hidden");
    hideSection(child);
  });
}

function showSection(frame) {
  frame.classList.remove("hidden");
  let children = Array.from(frame.children);
  children.forEach((child) => {
    child.classList.remove("hidden");
    showSection(child);
  });
}

hideSection(searchResultsFrame);
hideSection(movieDataFrame);
hideSection(movieData1);
hideSection(movieData2);
hideSection(directorData1);
hideSection(actorData1);

searchBoxInput.addEventListener("keyup", function (event) {
  event.preventDefault();
  if (event.key === "Enter") {
    submitSearch();
  }
});

searchButton.addEventListener("click", submitSearch);

clearHistory.addEventListener("click", clearHistoryList);

if (localStorage.getItem("recentViews")) {
  const recentViewsString = localStorage.getItem("recentViews");
  recentViewsArray = JSON.parse(recentViewsString);
  recentViewsArray = [...new Set(recentViewsArray)];
} else {
  recentViewsArray = new Array(0);
}

console.log(`RECENT VIEWS: ${recentViewsArray}`);

function showClearHistoryButton() {
  if (recentViewsArray.length > 0) {
    clearHistory.classList.remove("hidden");
    recentViews.classList.remove("hidden");
  }
}

function hideClearHistoryButton() {
  if (recentViewsArray.length === 0) {
    clearHistory.classList.add("hidden");
    recentViews.classList.add("hidden");
  }
}

showClearHistoryButton();

// recentViewsUL.innerHTML = "";

recentViewsArray.forEach(function (viewItem) {
  let url = viewItem.split("***")[0];
  let title = viewItem.split("***")[1];

  console.log(`TITLE: ${title}`);
  console.log(`URL: ${url}`);

  recentViewsUL.innerHTML += `<li class="recentViewsLi" data-url=${url}>${title}</li>`;
});

const recentViewsLi = document.getElementsByClassName("recentViewsLi");

let recentViewsLiArray = Array.from(recentViewsLi);

recentViewsLiArray.forEach(function (el) {
  el.addEventListener("click", function (el) {
    console.log(`LI: ${el.target}`);

    let url = el.target.dataset.url;

    hideSection(searchResultsFrame);
    hideSection(queryFrame);
    showSection(movieDataFrame);
    showSection(movieData1);
    showSection(movieData2);

    getMovie(url);
  });
});

function clearHistoryList() {
  recentViewsArray = new Array(0);

  const recentViewsObj = JSON.stringify(recentViewsArray);

  localStorage.setItem("recentViews", recentViewsObj);

  recentViewsUL.innerHTML = "";

  hideClearHistoryButton();
}

async function submitSearch() {
  const queryString = searchBox.firstChild.value;
  const baseUrl = "https://imdb-api.com/en/API/SearchMovie/k_khga61np/";
  const url = baseUrl.concat(queryString);

  console.log(url);
  await fetch(url)
    .then((res) => res.json())
    .then((data) => {
      data.results.forEach((result) => {
        searchObj = (({ title, id, image, description }) => ({
          title,
          id,
          image,
          description,
        }))(result);

        searchResults.push(searchObj);
      });
    });

  hideSection(queryFrame);
  showSection(searchResultsFrame);

  console.log(searchResults);

  displayResults();

  // addLinksRequestFetch();
}

function displayResults() {
  searchResults.forEach((result) => {
    const year = result.description.split(" ")[0];
    searchResultsGrid.innerHTML =
      searchResultsGrid.innerHTML +
      `<div class="searchResultsItem"><div class="resultItemTitle">${result.title}</div><div class="resultItemYear">${year}</div><div class="resultImage" data-movieID=${result.id}><img src=${result.image}></div></div>`;
  });

  addLinksRequestFetch();
}

function addLinksRequestFetch() {
  const resultImages = document.getElementsByClassName("resultImage");
  const resultImagesArray = Array.from(resultImages);

  resultImagesArray.forEach(function (element) {
    element.addEventListener("click", function (el) {
      console.log(`RECENT VIEWS: ${recentViewsArray}`);

      console.log(el);

      const movieID = el.target.closest("div").dataset.movieid;

      const baseUrl = "https://imdb-api.com/en/API/Title/k_khga61np/";

      const url = baseUrl.concat(movieID);

      const title =
        el.target.closest("div").previousSibling.previousSibling.innerText;

      console.log(url);

      console.log(title);

      let arrayItem = url.concat("***").concat(title);

      console.log(arrayItem);

      recentViewsArray.push(arrayItem);

      showClearHistoryButton();

      if (recentViewsArray.length > 8) {
        do {
          recentViewsArray.shift();
        } while (recentViewsArray.length > 8);
      }

      recentViewsArray = [...new Set(recentViewsArray)];

      const recentViewsObj = JSON.stringify(recentViewsArray);

      localStorage.setItem("recentViews", recentViewsObj);

      hideSection(searchResultsFrame);
      showSection(movieDataFrame);
      showSection(movieData1);
      showSection(movieData2);
      hideSection(queryFrame);

      getMovie(url);
    });
  });
}

async function getMovie(movieUrl) {
  await fetch(movieUrl)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.title);
      console.log(data.image);
      console.log(data.year);
      console.log(data.directorList);
      console.log(data.stars);
      console.log(data.plot);

      const movieTitle = data.title;
      const moviePosterImage = data.image;
      const movieYear = data.year;
      const movieDirectors = data.directorList;
      // const movieStarsString = data.stars;
      const movieStarsArray = data.starList;
      const moviePlot = data.plot;

      movieTitleDiv.innerText = movieTitle;
      posterImage.src = moviePosterImage;
      yearDisplay.innerHTML = `<div>${movieYear}</div>`;

      const movieDirectorsArray = [...new Set(movieDirectors)];

      directorsinnerHTML = "";

      movieDirectorsArray.forEach((element) => {
        console.log(element.name);
        directorsinnerHTML = directorsinnerHTML.concat(
          `<div class="movieDirectorsDiv" data-directorid=${element.id}>${element.name}</div>`
        );
      });
      directorNames.innerHTML = directorsinnerHTML;

      const movieDirectorDivs =
        document.getElementsByClassName("movieDirectorsDiv");

      const movieDirectorDivsArray = Array.from(movieDirectorDivs);

      movieDirectorDivsArray.forEach(function (div) {
        div.addEventListener("click", function (e) {
          //  console.log(e.target.dataset.directorid);
          getDirector(e.target.dataset.directorid);
        });
      });

      // const movieStarsArray = movieStarsString.split(", ");

      console.log(movieStarsArray);

      const starsArray = [...new Set(movieStarsArray)];

      starsNamesInnerHTML = "";
      starsArray.forEach((element) => {
        starsNamesInnerHTML = starsNamesInnerHTML.concat(
          `<div class="movieActorsDiv" data-actorid=${element.id}>${element.name}</div>`
        );
      });
      starsNames.innerHTML = starsNamesInnerHTML;

      const movieActorsDivs = document.getElementsByClassName("movieActorsDiv");

      let movieActorsDivsArray = Array.from(movieActorsDivs);

      movieActorsDivsArray.forEach(function (el) {
        el.addEventListener("click", function (e) {
          getActor(e.target.dataset.actorid);
        });
      });

      plotDiv.innerHTML = `<P>${moviePlot}</P>`;
    });

  // plotDiv.innerHTML = `<P>${moviePlot}</P>`;

  hideSection(searchResultsFrame);
  showSection(movieDataFrame);
  showSection(movieData1);
  showSection(movieData2);
  window.scrollTo(0, 0);
}

getMovie();

async function getDirector(id) {
  const baseUrl = "https://imdb-api.com/en/API/Name/k_khga61np/";

  console.log(`DIRECTOR: ${id}`);

  const url = baseUrl.concat(id);

  await fetch(url)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data.name);
      // console.log(data.image);
      // console.log(data.summary);
      // console.log(data.knownFor);

      let directorKnownForArray = new Array(0);

      const directorName = data.name;
      const directorImage = data.image;
      const directorSummary = data.summary;
      const directorKnownFor = data.knownFor;

      directorNameDiv.innerText = directorName;
      directorSummaryDiv.innerText = directorSummary;
      directorImageDivImg.src = directorImage;

      // console.log(directorName)
      // console.log(directorImage)
      // console.log(directorSummary)

      directorKnownForArray = [...new Set(directorKnownFor)];

      directorSearchResultsGrid.innerHTML = "";

      directorKnownForArray.forEach((directorKF) => {
        console.log(`DIR MOVIES: ${directorKF.title}`);
        directorSearchResultsGrid.innerHTML =
          directorSearchResultsGrid.innerHTML +
          `<div class="directorMoviesItem" data-id=${directorKF.id}><div class="directorMoviesItemTitle">${directorKF.title}</div><div class="directorMoviesItemYear">${directorKF.year}</div><div class="directorMoviesImage" data-id=${directorKF.id}><img src=${directorKF.image}></div></div>`;

        addLinksFromDirectorRequestFetch();
        // console.log(directorKF.id)
        // console.log(directorKF.title)
        // console.log(directorKF.image)
        // console.log(directorKF.year)
      });

      function addLinksFromDirectorRequestFetch() {
        const directorMoviesImages = document.getElementsByClassName(
          "directorMoviesImage"
        );
        const directorMoviesImagesArray = Array.from(directorMoviesImages);

        directorMoviesImagesArray.forEach(function (element) {
          element.addEventListener("click", function (el) {
            console.log(el);

            const movieID = el.target.closest("div").dataset.id;

            const baseUrl = "https://imdb-api.com/en/API/Title/k_khga61np/";

            const url = baseUrl.concat(movieID);

            const title =
              el.target.closest("div").previousSibling.previousSibling
                .innerText;

            console.log(url);

            console.log(title);

            let arrayItem = url.concat("***").concat(title);

            console.log(arrayItem);

            recentViewsArray.push(arrayItem);

            showClearHistoryButton();

            if (recentViewsArray.length > 8) {
              do {
                recentViewsArray.shift();
              } while (recentViewsArray.length > 8);
            }

            const recentViewsObj = JSON.stringify(recentViewsArray);

            localStorage.setItem("recentViews", recentViewsObj);

            hideSection(searchResultsFrame);
            hideSection(queryFrame);
            hideSection(directorData1);

            getMovie(url);
            showSection(movieDataFrame);  
            showSection(movieData1);
            showSection(movieData2);
          });
        });
      }
    });
  hideSection(movieDataFrame);
  hideSection(movieData1);
  hideSection(movieData2);
  showSection(directorData1);
  window.scrollTo(0, 0);
}

async function getActor(id) {
  const baseUrl = "https://imdb-api.com/en/API/Name/k_khga61np/";

  console.log(`ACTOR: ${id}`);

  const url = baseUrl.concat(id);

  await fetch(url)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data.name);
      // console.log(data.image);
      // console.log(data.summary);
      // console.log(data.knownFor);

      let actorKnownForArray = new Array(0);

      const actorName = data.name;
      const actorImage = data.image;
      const actorSummary = data.summary;
      const actorKnownFor = data.knownFor;

      actorNameDiv.innerText = actorName;
      actorSummaryDiv.innerText = actorSummary;
      actorImageDivImg.src = actorImage;

      // console.log(directorName)
      // console.log(directorImage)
      // console.log(directorSummary)

      actorKnownForArray = [...new Set(actorKnownFor)];

      actorSearchResultsGrid.innerHTML = "";

      actorKnownForArray.forEach((actorKF) => {
        console.log(`DIR MOVIES: ${actorKF.title}`);
        actorSearchResultsGrid.innerHTML =
          actorSearchResultsGrid.innerHTML +
          `<div class="actorMoviesItem" data-id=${actorKF.id}><div class="actorMoviesItemTitle">${actorKF.title}</div><div class="actorMoviesItemYear">${actorKF.year}</div><div class="actorMoviesImage" data-id=${actorKF.id}><img src=${actorKF.image}></div></div>`;

        addLinksFromActorRequestFetch();

        hideSection(movieDataFrame);
        hideSection(movieData1);
        hideSection(movieData2);
        hideSection(directorDataFrame);
        hideSection(directorData1);
        showSection(actorData1);
        window.scrollTo(0, 0);
      });

      function addLinksFromActorRequestFetch() {
        const actorMoviesImages =
          document.getElementsByClassName("actorMoviesImage");
        const actorMoviesImagesArray = Array.from(actorMoviesImages);

        actorMoviesImagesArray.forEach(function (element) {
          element.addEventListener("click", function (el) {
            console.log(el);

            const movieID = el.target.closest("div").dataset.id;

            const baseUrl = "https://imdb-api.com/en/API/Title/k_khga61np/";

            const url = baseUrl.concat(movieID);

            const title =
              el.target.closest("div").previousSibling.previousSibling
                .innerText;

            console.log(url);

            console.log(title);

            let arrayItem = url.concat("***").concat(title);

            console.log(arrayItem);

            recentViewsArray.push(arrayItem);

            showClearHistoryButton();

            if (recentViewsArray.length > 8) {
              do {
                recentViewsArray.shift();
              } while (recentViewsArray.length > 8);
            }

            const recentViewsObj = JSON.stringify(recentViewsArray);

            localStorage.setItem("recentViews", recentViewsObj);

            hideSection(searchResultsFrame);
            hideSection(queryFrame);
            hideSection(directorData1);
            hideSection(directorDataFrame);

            getMovie(url);

            hideSection(actorData1);
            showSection(movieDataFrame);
            showSection(movieData1);
            showSection(movieData2);
            window.scrollTo(0, 0);
          });
        });
      }
    });

  // hideSection(movieData1);
  // hideSection(movieData2);
  // hideSection(directorData1);
  // showSection(actorData1);
}
