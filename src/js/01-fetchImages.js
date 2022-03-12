export default function fetchImages(page) {
    const options = {
        key: '25968953-7e2042be61e43274ed33ea7fb',
        enteredValue: document.querySelector('input').value,
        // enteredValue: 'ukraine',
        imageType: 'photo',
        orientation: 'horizontal',
        safeSearch: true,
        perPage: 39,

    }
    // console.log('page = ', page);
    const url = `https://pixabay.com/api/?key=${options.key}&q=${options.enteredValue}&image_type=${options.imageType}&orientation=${options.orientation}&safesearch=${options.safeSearch}&per_page=${options.perPage}&page=${page}`;
    return fetch(url)
        .then(r => {
            return r.json()
        })
        
}