const apiKey = '0d9f6079d42553069dac9944c9487923';

document.addEventListener('DOMContentLoaded', () => {
    const cachedMovies = localStorage.getItem('movies');
    if (cachedMovies) {
        displayMovies(JSON.parse(cachedMovies));
    } else {
        fetchMovies();
    }
});

function fetchMovies() {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('movies', JSON.stringify(data.results));
            displayMovies(data.results);
        })
        .catch(error => {
            console.error('Fetch error:', error);
            document.getElementById('movieContainer').innerHTML = '<p>Failed to load movies. Please try again later.</p>';
        });
}

function displayMovies(movies) {
    const movieContainer = document.getElementById('movieContainer');
    movieContainer.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <button onclick="viewMovie(${movie.id})">View Details</button>
        `;
        movieContainer.appendChild(movieCard);
    });
}

function searchMovies() {
    const query = document.getElementById('searchInput').value;
    window.location.href = `search.html?query=${query}`;
}

function viewMovie(movieId) {
    window.location.href = `movie.html?id=${movieId}`;
}

function getMovieDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=videos`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(movie => {
            const movieDetails = document.getElementById('movieDetails');
            const trailer = movie.videos.results.find(video => video.type === 'Trailer');
            movieDetails.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                <div><h2>${movie.title}</h2>
                <div class="main1"><p>${movie.overview}</p></div>
                <h1><strong>Release Date:</strong> ${movie.release_date}
                <p><strong>Rating:</strong> ${movie.vote_average}</p>
                <button>Watch ${movie.title}</button>
                </div>
            `;
            if (trailer) {
                const trailerFrame = document.getElementById('trailerFrame');
                trailerFrame.src = `https://www.youtube.com/embed/${trailer.key}`;
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            document.getElementById('movieDetails').innerHTML = '<p>Failed to load movie details. Please try again later.</p>';
        });
}

function getSearchResults() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const movies = data.results;
            const searchResults = document.getElementById('searchResults');
            searchResults.innerHTML = '';
            movies.forEach(movie => {
                const movieCard = document.createElement('div');
                movieCard.className = 'movie-card';
                movieCard.innerHTML = `
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                    <h3>${movie.title}</h3>
                    <button onclick="viewMovie(${movie.id})">View Details</button>
                `;
                searchResults.appendChild(movieCard);
            });
        })
        .catch(error => {
            console.error('Fetch error:', error);
            document.getElementById('searchResults').innerHTML = '<p>Failed to load search results. Please try again later.</p>';
        });
}

if (window.location.pathname.includes('movie.html')) {
    document.addEventListener('DOMContentLoaded', getMovieDetails);
}

if (window.location.pathname.includes('search.html')) {
    document.addEventListener('DOMContentLoaded', getSearchResults);
}
