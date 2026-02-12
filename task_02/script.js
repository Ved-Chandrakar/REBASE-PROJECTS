const API_KEY = '12650a7b96fa04c594b256139cb2cd67';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

let currentPage = 1;
let currentQuery = '';

const MovieGrid = document.getElementById('MovieGrid');
const SearchInput = document.getElementById('SearchInput');
const SearchBtn = document.getElementById('SearchBtn');
const LoadMoreBtn = document.getElementById('LoadMoreBtn');
const Modal = document.getElementById('MovieModal');
const ModalDetails = document.getElementById('ModalDetails');
const CloseBtn = document.querySelector('.Close-Btn');

async function getMovies(query, page = 1) {
    const endpoint = query 
        ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
        : `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`;
    
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        
        if (data.results) {
            displayMovies(data.results, page === 1);
            LoadMoreBtn.style.display = data.total_pages > page ? 'block' : 'none';
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function displayMovies(movies, isNewSearch) {
    if (isNewSearch) MovieGrid.innerHTML = '';

    movies.forEach(movie => {
        const movieEl = document.createElement('div');
        movieEl.classList.add('Movie-Card');
        
        const poster = movie.poster_path ? IMG_URL + movie.poster_path : 'https://via.placeholder.com/500x750?text=No+Image';
        
        movieEl.innerHTML = `
            <img src="${poster}" alt="${movie.title}">
            <div class="Movie-Info">
                <h3>${movie.title}</h3>
                <span class="rating">${movie.vote_average}</span>
            </div>
        `;
        
        movieEl.addEventListener('click', () => showDetails(movie.id));
        MovieGrid.appendChild(movieEl);
    });
}

async function showDetails(id) {
    const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
    const movie = await res.json();
    
    ModalDetails.innerHTML = `
        <h2 style="color:#38bdf8">${movie.title}</h2>
        <p><strong>Release Date:</strong> ${movie.release_date}</p>
        <p><strong>Overview:</strong> ${movie.overview}</p>
        <p><strong>Rating:</strong> ⭐ ${movie.vote_average}</p>
    `;
    Modal.style.display = 'block';
}

SearchBtn.addEventListener('click', () => {
    currentQuery = SearchInput.value;
    currentPage = 1;
    getMovies(currentQuery, currentPage);
});

LoadMoreBtn.addEventListener('click', () => {
    currentPage++;
    getMovies(currentQuery, currentPage);
});

CloseBtn.onclick = () => Modal.style.display = "none";

window.onclick = (event) => {
    if (event.target == Modal) Modal.style.display = "none";
};

getMovies();