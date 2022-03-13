const axios = require('axios');
export default async function getImages(page) {
    const options = {
        params: {
            key: '25968953-7e2042be61e43274ed33ea7fb',
            q: document.querySelector('input').value,
            // q: 'ukraine',
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            page: page,
            per_page: 40,
        }
    }

    const url = `https://pixabay.com/api/`;

    try {
        const response = await axios.get(url, options);
        
        return response.data;
    }
    
    catch (error) {
        console.log(error);
    }
}