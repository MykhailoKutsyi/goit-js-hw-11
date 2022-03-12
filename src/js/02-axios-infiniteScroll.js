import '../css/styles.css';
import getImages from './02-getImages';
import markUpImages from './02-markUpImages';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import debounce from "lodash.debounce";

const refs = {
    searchForm: document.getElementById('search-form'),
    input: document.querySelector('input'),
    imagesList: document.querySelector('.photo-list'),
    loadMore: document.querySelector('.load-more'),
}

let page = 1;
let showNotify = 0;

refs.searchForm.addEventListener('submit', onSubmitForm);

function onSubmitForm(e) {
    e.preventDefault();
    if (refs.input.value) {

        refs.imagesList.innerHTML = '';
        page = 1;
        showNotify = 0;

        makeContent();

        window.addEventListener('scroll',
        debounce(() => {
            checkDistanceToBottom()
        }, 1000)
        );
    }
}

// ↓ if the user has scrolled to the bottom of the page, checks for the distance to bottom and if ok - move to the next function

function checkDistanceToBottom() {
    const { height: cardHeight } = document
        .querySelector(".photo-card")
        .firstElementChild.getBoundingClientRect();
    let windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom - 350;
    // console.log('windowRelativeBottom = ', windowRelativeBottom);
    // console.log('cardHeight*2 ', cardHeight*2);
    if ((windowRelativeBottom) < cardHeight*2) {
        makeContent();
    }
}

// ↓ push get request and show on notification and mark up images
async function makeContent() {
    const data = await getImages(page);
    if (notificationFunction(data)) {
        markUp(data);
        const { height: cardHeight } = document
            .querySelector(".photo-card")
            .firstElementChild.getBoundingClientRect();

        window.scrollBy({
            top: cardHeight * 2,
            behavior: "smooth",
        });

        page += 1;
    }
}

function notificationFunction(data) {
    if (data.totalHits === 0) {
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return false;
    }

    if (showNotify === 0) {
        Notify.info(`Hooray! We found ${data.totalHits} images.`);
        showNotify = 1;
    }

    if (data.hits.length === 0) {
        Notify.warning("We're sorry, but you've reached the end of search results.");
        return false;
    }
    return true;
}

function markUp(data) {
    console.log(data);

    refs.imagesList.insertAdjacentHTML('beforeend', markUpImages(data.hits));
    
    gallery.refresh();
}

const gallery = new SimpleLightbox('.photo-list a', {
        captions: true,
        captionsData: 'alt',
        captionDelay: 250,
    });