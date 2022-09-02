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
const searchButton = document.getElementById("searchButton");
const searchResultsFrame = document.getElementById("searchResultsFrame");
const searchResultsGrid = document.getElementById("searchResultsGrid");
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

function hideSection(frame) {
  let children = Array.from(frame.children);
  children.forEach((child) => {
    child.classList.add("hidden");
    hideSection(child);
  });
}

function showSection(frame) {
  let children = Array.from(frame.children);
  children.forEach((child) => {
    child.classList.remove("hidden");
   showSection(child);
  });
}

hideSection(searchResultsFrame);
hideSection(movieData1);
hideSection(movieData2);

searchButton.addEventListener("click", submitSearch);

async function submitSearch() {
  const queryString = searchBox.firstChild.value;
  const baseUrl = "https://imdb-api.com/en/API/SearchMovie/k_khga61np/";
  const url = baseUrl.concat(queryString);

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

  addLinksRequestFetch();
}

function displayResults() {
  searchResults.forEach((result) => {
    const year = result.description.split(" ")[0]
    searchResultsGrid.innerHTML =
      searchResultsGrid.innerHTML +
      `<div class="searchResultsItem"><div>${result.title}</div><div>${year}</div><div class="resultImage" data-movieID=${result.id}><img src=${result.image}></div></div>`;
  });
}

function addLinksRequestFetch() {
  const resultImages = document.getElementsByClassName("resultImage");
  const resultImagesArray = Array.from(resultImages);

  resultImagesArray.forEach(function (element) {
    element.addEventListener("click", function (el) {
      console.log(el);

      const movieID = el.target.closest("div").dataset.movieid;

      const baseUrl = "https://imdb-api.com/en/API/Title/k_khga61np/";

      const url = baseUrl.concat(movieID);

      console.log(url);

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

      movieTitle = data.title;
      moviePosterImage = data.image;
      movieYear = data.year;
      movieDirectors = data.directorList;
      movieStarsString = data.stars;
      moviePlot = data.plot;

      movieTitleDiv.innerText = movieTitle;
      posterImage.src = moviePosterImage;
      yearDisplay.innerHTML = `<div>${movieYear}</div>`;

      movieDirectors.forEach((element) => {
        console.log(element.name);
        directorsinnerHTML = directorsinnerHTML.concat(
          `<div>${element.name}</div>`
        );
      });
      directorNames.innerHTML = directorsinnerHTML;

      starsArray = movieStarsString.split(", ");
      starsArray.forEach((element) => {
        starsNamesInnerHTML = starsNamesInnerHTML.concat(
          `<div>${element}</div>`
        );
      });
      starsNames.innerHTML = starsNamesInnerHTML;
    });

  plotDiv.innerHTML = `<P>${moviePlot}</P>`;

  hideSection(searchResultsFrame);
  showSection(movieData1);
  showSection(movieData2);
}

getMovie();
