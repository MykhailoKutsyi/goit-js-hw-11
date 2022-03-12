import '../css/styles.css';
import fetchImages from './01-fetchImages';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    searchForm: document.getElementById('search-form'),
    input: document.querySelector('input'),
    imagesList: document.querySelector('.photo-list'),
    loadMore: document.querySelector('.load-more'),
}

let page = 1;
let showNotify = 0;
let imagesQuantityRemainder = 0;
refs.loadMore.classList.add('button-hidden');

refs.searchForm.addEventListener('submit', onSubmitForm);
refs.loadMore.addEventListener('click', onLoadMore);

function onSubmitForm(e) {
    e.preventDefault();
    if (refs.input.value) {
        refs.imagesList.innerHTML = '';
        page = 1;
        showNotify = 0;
        fetchImages(page)
            .then(data => markUp(data));
        page += 1;
    }
}

function onLoadMore() {
    fetchImages(page)
        .then(data => markUp(data));
    // console.log(page);
    page += 1;

}

function markUp(data) {
    console.log(data);

    if (data.totalHits === 0) {
        refs.loadMore.classList.add('button-hidden');
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return;
    }

    if (showNotify == 0) {
        Notify.info(`Hooray! We found ${data.totalHits} images.`);
        showNotify = 1;
        imagesQuantityRemainder = data.totalHits;
    }
    imagesQuantityRemainder -= 39;
        
    refs.imagesList.insertAdjacentHTML('beforeend', data.hits.map(image => markUpImages(image)
    ).join(''));
    gallery.refresh();

    const { height: cardHeight } = document
        .querySelector(".photo-card")
        .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight,
        behavior: "smooth",
    });

    if (imagesQuantityRemainder <= 0) {

        Notify.warning("We're sorry, but you've reached the end of search results.");
        refs.loadMore.classList.add('button-hidden');
        return;
    }
    else {
        refs.loadMore.classList.remove('button-hidden');
    }
}

function markUpImages(image) {
    return `
    <li class="photo-card">
        <a class="photo-link" href="${image.largeImageURL}">
            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        </a>
        <div class="info">
            <p class="info-item">
            <b>Likes: ${image.likes}</b>
            </p>
            <p class="info-item">
            <b>Views: ${image.views}</b>
            </p>
            <p class="info-item">
            <b>Comments: ${image.comments}</b>
            </p>
            <p class="info-item">
            <b>Downloads: ${image.downloads}</b>
            </p>
        </div>
    </li>
    `
}

const gallery = new SimpleLightbox('.photo-list a', {
        captions: true,
        captionsData: 'alt',
        captionDelay: 250,
    });
