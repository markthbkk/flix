import { getMovie } from "./main.js";

let recentViewsArray = new Array();

export function hideSection(frame) {
  frame.classList.add("hidden");
  let children = Array.from(frame.children);
  children.forEach((child) => {
    child.classList.add("hidden");
    hideSection(child);
  });
}

export function showSection(frame) {
  frame.classList.remove("hidden");
  let children = Array.from(frame.children);
  children.forEach((child) => {
    child.classList.remove("hidden");
    showSection(child);
  });
}

export function buildRecentViewsArray(lSRecentViews) {
  if (lSRecentViews) {
    const recentViewsString = lSRecentViews;
    recentViewsArray = JSON.parse(recentViewsString);
    recentViewsArray = [...new Set(recentViewsArray)];
    console.log(recentViewsArray);
  } else {
    recentViewsArray = new Array(0);
  }
  return recentViewsArray;
}

export function writeRecentViewsToHomePage(recentViewsArray) {
  recentViewsArray.forEach(function (viewItem) {
    let url = viewItem.split("***")[0];
    let title = viewItem.split("***")[1];

    console.log(`TITLE: ${title}`);
    console.log(`URL: ${url}`);

    if (title.length > 36) {
      recentViewsUL.innerHTML += `<li class="recentViewsLi recentViewsLiTall" data-url=${url}>${title}</li>`;
    } else {
      recentViewsUL.innerHTML += `<li class="recentViewsLi" data-url=${url}>${title}</li>`;
    }
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
      getMovie(url);
    });
  });
}

export function showClearHistoryButton(recentViewsArray) {
  if (recentViewsArray.length > 0) {
    clearHistory.classList.remove("hidden");
    recentViews.classList.remove("hidden");
  }
}

export function hideClearHistoryButton(recentViewsArray) {
  if (recentViewsArray.length === 0) {
    clearHistory.classList.add("hidden");
    recentViews.classList.add("hidden");
  }
}

export function clearHistoryList() {
  recentViewsArray = new Array(0);

  const recentViewsObj = JSON.stringify(recentViewsArray);

  localStorage.setItem("recentViews", recentViewsObj);

  recentViewsUL.innerHTML = "";

  hideClearHistoryButton(recentViewsArray);
}
