import imageTemplate from '../templates/image.hbs';
import fetchImages from './apiService';
import debounce from 'lodash.debounce';
import * as basicLightbox from 'basiclightbox';

const refs = {
  input: document.querySelector('#search-form'),
  galleryList: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('#loadMore'),
};

let pageNumber = 1;
let searchQuery = '';

refs.input.addEventListener('input', debounce(searchImages, 500));
refs.loadMoreBtn.addEventListener('click', onLoadMore);
refs.galleryList.addEventListener('click', biggerImageView);

function searchImages(e) {
  resetOutput();
  refs.loadMoreBtn.classList.add('is-hidden');
  searchQuery = e.target.value.trim();
  if (searchQuery) {
    pageNumber = 1;
    makeGallery(searchQuery, pageNumber);
  }
}

function onLoadMore() {
  pageNumber += 1;
  makeGallery(searchQuery, pageNumber);
}

function makeGallery(searchQuery, pageNumber) {
  fetchImages(searchQuery, pageNumber)
    .then(data => {
      if (data.hits.length === 0) {
        refs.loadMoreBtn.classList.add('is-hidden');
      } else {
        renderImageCard(data, imageTemplate);
        refs.loadMoreBtn.classList.remove('is-hidden');
        refs.loadMoreBtn.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      }
    })
    .catch(error => {
      console.log('Network error!', error);
    });
}

function resetOutput() {
  refs.galleryList.innerHTML = '';
}

function biggerImageView(e) {
  basicLightbox.create(`<img src="${e.target.dataset.source}">`).show();
}

function renderImageCard(data, template) {
  const markup = data.hits.map(image => template(image)).join('');
  refs.galleryList.insertAdjacentHTML('beforeend', markup);
}
