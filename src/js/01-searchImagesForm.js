import '../css/styles.css';
import fetchImages from './01-fetchImages';
import markUpImages from './markUpImages';
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
refs.loadMore.addEventListener('click', pushFetch);

function onSubmitForm(e) {
    e.preventDefault();
    refs.loadMore.classList.add('button-hidden');
    if (refs.input.value) {
        refs.imagesList.innerHTML = '';
        page = 1;
        showNotify = 0;
        pushFetch();
    }
}

function pushFetch() {
    fetchImages(page)
            .then(data => markUp(data));
        page += 1;
}

function markUp(data) {
    console.log(data);
    if (notificationFunction(data)) {
        refs.imagesList.insertAdjacentHTML('beforeend', markUpImages(data.hits));

        gallery.refresh();

        const { height: cardHeight } = document
            .querySelector(".photo-card")
            .firstElementChild.getBoundingClientRect();

        window.scrollBy({
            top: cardHeight,
            behavior: "smooth",
        });
    }
}

function notificationFunction(data) {
    if (data.totalHits === 0) {
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return false;
    }

    if (showNotify == 0) {
        Notify.info(`Hooray! We found ${data.totalHits} images.`);
        showNotify = 1;
        imagesQuantityRemainder = data.totalHits;
    }
    imagesQuantityRemainder -= 39;

    if (imagesQuantityRemainder <= 0) {
        refs.loadMore.classList.add('button-hidden');
        setTimeout(() => Notify.warning("We're sorry, but you've reached the end of search results."), 1500);
    }
    else {
        refs.loadMore.classList.remove('button-hidden');
    }
    return true;
}

const gallery = new SimpleLightbox('.photo-list a', {
        captions: true,
        captionsData: 'alt',
        captionDelay: 250,
    });
