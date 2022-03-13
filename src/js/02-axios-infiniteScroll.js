import '../css/styles.css';
import getImages from './02-getImages';
import markUpImages from './markUpImages';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    searchForm: document.getElementById('search-form'),
    input: document.querySelector('input'),
    imagesList: document.querySelector('.photo-list'),
}

let page = 1;

const options = {
    root: null,
    threshold: 1.0
}

const callback = function(entries) {
    entries.map((entry) => {
        if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            makeContent();
        }
    })
};

const observer = new IntersectionObserver(callback, options);

const photoList = new SimpleLightbox('.photo-list a', {
        captions: true,
        captionsData: 'alt',
        captionDelay: 250,
});
    
refs.searchForm.addEventListener('submit', onSubmitForm);

function onSubmitForm(e) {
    e.preventDefault();
    if (refs.input.value) {
        refs.imagesList.innerHTML = '';
        page = 1;
        makeContent();
    }
}

// ↓ push request and show on notification and mark up images
async function makeContent() {
    const data = await getImages(page);
    if (notificationFunction(data)) {
        
        refs.imagesList.insertAdjacentHTML('beforeend', markUpImages(data.hits));
    
        photoList.refresh();
        
        if (page === 1) {
            Notify.info(`Hooray! We found ${data.totalHits} images.`);
        }
        else {
            const { height: cardHeight } = document
                .querySelector(".photo-list")
                .firstElementChild.getBoundingClientRect();
            console.log(cardHeight);
            window.scrollBy({
                top: cardHeight * 1.5,
                behavior: "smooth",
            });
        }
        page += 1;
        
        observer.observe(refs.imagesList.lastElementChild);
    }
}   

function notificationFunction(data) {
    if (data.totalHits === 0) {
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return false;
    }

    if (data.hits.length === 0) {
        Notify.warning("We're sorry, but you've reached the end of search results.");
        return false;
    }
    return true;
}
