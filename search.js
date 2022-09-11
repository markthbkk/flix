import { hideSection, showSection } from "./utils.js";
import {addLinksRequestFetch} from "./main.js"

const searchResultsFrame = document.getElementById("searchResultsFrame");
const searchResultsGrid = document.getElementById("searchResultsGrid");


export async function submitSearch() {

  let searchResults = new Array();
  const queryString = searchBox.firstChild.value;
  const baseUrl = "https://imdb-api.com/en/API/SearchMovie/k_khga61np/";
  const url = baseUrl.concat(queryString);

  console.log(url);
  await fetch(url)
    .then((res) => res.json())
    .then((data) => {
      data.results.forEach((result) => {
        let searchObj = (({ title, id, image, description }) => ({
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

//   displayResults(searchResults, searchResultsGrid);
    
    searchResults.forEach((result) => {
      const year = result.description.split(" ")[0];
      searchResultsGrid.innerHTML =
        searchResultsGrid.innerHTML +
        `<div class="searchResultsItem"><div class="resultItemTitle">${result.title}</div><div class="resultItemYear">${year}</div><div class="resultImage" data-movieID=${result.id}><img src=${result.image}></div></div>`;
    });

    addLinksRequestFetch();
}


