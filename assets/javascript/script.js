import CONFIG from './config.js';

let currentPage = 1;
let currentQuery = ''; 

document.getElementById('searchBtn').addEventListener('click', function () {
    const query = document.getElementById('searchInput').value;
    if (query) {
        currentQuery = query;
        currentPage = 1;
        searchImages(query, currentPage);
    }
});

document.getElementById('moreBtn').addEventListener('click', function () {
    currentPage++;
    searchImages(currentQuery, currentPage);
});

async function searchImages(query, page) {
    const apiUrl = `${CONFIG.apiEndpoint}?query=${query}&page=${page}`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                Authorization: `Client-ID ${CONFIG.apiKey}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.results) {
            if (page === 1) {
                displayImages(data.results, true);
            } else {
                displayImages(data.results, false); 
            }

            if (data.results.length === 0 || data.total_pages <= page) {
                document.getElementById('moreBtn').style.display = 'none';
            } else {
                document.getElementById('moreBtn').style.display = 'block';
            }
        } else {
            console.log('No results found.');
        }
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}

function displayImages(images, clear = false) {
    const imageResults = document.getElementById('imageResults');
    if (clear) {
        imageResults.innerHTML = '';
    }

    if (images.length === 0 && clear) {
        imageResults.innerHTML = '<p>No images found.</p>';
        return;
    }

    images.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = image.urls.small;
        imgElement.alt = image.alt_description;
        imageResults.appendChild(imgElement);
    });
}
