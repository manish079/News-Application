const API_KEY = "03a9f979cc3a454992ada10323f27024";

const URL = "https://newsapi.org/v2/everything?q=";

const search_bar = document.querySelector("#search-bar");
function focusable() {
  search_bar.focus();
}

async function fetchNews(query) {
  console.log("Fetching news");

  const response = await fetch(`${URL}${query}&apikey=${API_KEY}`);

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log(data);

  //Now we got data of news
  //Now we want to bind data to UI

  bindData(data.articles);
}

function bindData(articles) {
  const cardsContainers = document.getElementById("cards-containers");

  const newsCardTemplate = document.getElementById("template-news-card");

  //before adding template into html I want be to sure if anything present in card-container will vanished

  cardsContainers.innerHTML = "";

  articles.forEach((article) => {
    //If kisi bhi article me image ni he to us article ko show ni karna
    if (!article.urlToImage) {
      return;
    }

    const newsTempClone = newsCardTemplate.content.cloneNode(true);

    //bind data
    fillDataInCard(newsTempClone, article);

    document.getElementById("cards-containers").appendChild(newsTempClone);
  });
}

function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDesc = cardClone.querySelector("#news-desc");

  newsImg.src = article.urlToImage;
  newsTitle.innerHTML = article.title;
  newsDesc.innerHTML = article.description;

  const date = new Date(article.publishedAt).toLocaleDateString("en-US", {
    timeZone: "Asia/Jakarta",
  });
  newsSource.innerHTML = `${article.source.name} . ${date}`;

  //Add intent
  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.url, "_blank");
  });
}

window.onload = (event) => {
  fetchNews("India");
};

//Handle click event listener on nav-items

const navItems = document.querySelector(".nav-items");
let selectedNav = null;

navItems.addEventListener("click", function (e) {
  const id = e.target.innerText;
  fetchNews(id);
  selectedNav?.classList.remove("active");
  selectedNav = e.target;
  selectedNav.classList.add("active");
});

document.querySelector(".logo").addEventListener("click", () => {
  window.location.reload();
});

//Search-bar

const searchText = document.querySelector("#search-bar");
const searchIcon = document.querySelector(".search-icon");

function searchNews() {
  const query = searchText.value;
  // console.log(query);

  if (!query) return;
  fetchNews(query);

  setTimeout(() => {
    searchText.value = "";
  }, 500);

  selectedNav?.classList.remove("active");
  selectedNav = null;
}

searchIcon.addEventListener("click", searchNews);
