import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchPhoto } from "./js/pixabay-api";

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const searchFormEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreEl = document.querySelector('.load-more');

const perPage = 40;
let page = 1;
let keyOfSearchPhoto = '';

const notifyParams = {
  position: 'center-center',
        timeout: 5000,
        width: '400px',
        fontSize: '24px'
}

let lightbox = new SimpleLightbox('.img_wrap a', { 
    captionsData: 'alt',
    captionDelay: 250,
});

loadMoreEl.classList.add('is-hidden');

searchFormEl.addEventListener('submit', onSubmitForm);

function onSubmitForm(evt){
    evt.preventDefault();

    galleryEl.innerHTML = '';
    page = 1
    const { searchQuery } = evt.currentTarget.elements;
    keyOfSearchPhoto = searchQuery.value.trim().toLowerCase().split(' ').join('+');

    fetchPhoto(keyOfSearchPhoto, page, perPage)
    .then(data => {
        const searchResults = data.hits;
        if(data.totalHits === 0){
            Notify.failure('Sorry, there are no images matching your search query. Please try again.', notifyParams)
        }else{
            createMarkup(searchResults)
            lightbox.refresh()
        }
        if(data.totalHits > perPage){
            loadMoreEl.classList.remove('is-hidden');
            window.addEventListener('scrol', showLoadMorePage);          
        } 
        scrollPage()       
    })
    .catch (fetchError) 

    loadMoreEl.addEventListener('click', onLoadMoreClick);

    evt.currentTarget.reset();
}
function onLoadMoreClick(){
  page +=1;
  fetchPhoto(keyOfSearchPhoto, page, perPage)
  .then(data => {
    const searchResults = data.hits;
    const numberOfPage = Math.ceil(data.totalHits / perPage);

    createMarkup(searchResults);
    if(page === numberOfPage){
      loadMoreEl.classList.add("is-hidden");
      Notify.info("We're sorry, but you've reached the end of search results.");
      loadMoreEl.removeEventListener('click', onLoadMoreClick);
      window.removeEventListener('scrol', showLoadMorePage);
    }
    lightbox.refresh()
    scrollPage()
  })
  .catch (fetchError)
}

function fetchError(){
  Notify.failure('Oops! Something went wrong! Try reloading the page or make another choice!', notifyParams)
}

function scrollPage(){
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
}

function showLoadMorePage() {
  if (checkIfEndOfPage()) {
    onLoadMoreClick();
  };
};

function checkIfEndOfPage() {
return (
  window.innerHeight + window.scrollY >= document.documentElement.scrollHeight
);
}

function createMarkup(searchResults){
    const arrPhotos = searchResults.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
    return `<div class="photo-card">
    <div class = "img_wrap"> <a class = "gallery-link" href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" width="300" loading="lazy" />
        </a>
      </div>
    
    <div class="info">
      <p class="info-item">
        <b>Likes:${likes}</b>
      </p>
      <p class="info-item">
        <b>Views:${views}</b>
      </p>
      <p class="info-item">
        <b>Comments:${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads:${downloads}</b>
      </p>
    </div>
  </div>`
})
galleryEl.insertAdjacentHTML("beforeend", arrPhotos.join(''))
}