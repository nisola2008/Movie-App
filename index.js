const API_KEY = '6ac643d5f316bec7204d7a019ea3557c'
const image_path = 'https://image.tmdb.org/t/p/w500'

//making the search field work
const input = document.querySelector('.search input'); 
const btn = document.querySelector('.search button');
const main_grid = document.querySelector('.favorite .movies-grid');
const main_grid_title = document.querySelector('.favorite h1')

const trending_el = document.querySelector('.trending .movies-grid')

const popup_container = document.querySelector('.popup-container')

function add_click_effect_to_card (cards) {
    cards.forEach(card => {
        card.addEventListener('click', () => show_popup(card))
    })
};

//search movies
async function get_movies_by_search (search_term) {
    const resp = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${search_term}`)
    const respData = await resp.json()
    return respData.results;
    }

btn.addEventListener('click', add_searched_movies_to_dom);

async function add_searched_movies_to_dom() {
   const data = await get_movies_by_search(input.value);
   
    main_grid_title.innerText = `Searching Results....`;
    main_grid.innerHTML = data.map(e => {
        return `
             <div class="card" data-id="${e.id}">
                <div class="img">
                <img src="${image_path + e.poster_path}" alt="">
                </div>
                <div class="info">
                    <h2>${e.title}</h2>
                    <div class="single-info">
                        <span>Rate:</span>
                        <span>${e.vote_average}</span>
                    </div>
                    <div class="single-info">
                        <span>Release Date:</span>
                        <span>${e.release_date}</span>
                    </div>
                </div>
            </div>
        `
    }). join('');

    //making a popup when clicking on the card the movie info shows
    const cards = document.querySelectorAll('.card')
    add_click_effect_to_card(cards)
}
//popup
async function get_movies_by_id (id) {
    const resp = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
    const respData = await resp.json()
    return respData
    }
    async function get_movie_trailer (id) {
    const resp = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`)
    const respData = await resp.json()
    
  if (respData.results.length === 0) {
    return null;}

    return respData.results[0].key
    }
async function show_popup (card) {
    popup_container.classList.add('show-popup')

    const movie_id = card.getAttribute('data-id');
    const movie = await get_movies_by_id(movie_id);
    const movie_trailer = await get_movie_trailer(movie_id);

    console.log(movie_trailer)
    
  if (!movie_trailer) {
    console.log("No trailer available for this movie");
  }

    popup_container.style.background = `linear-gradient(rgba(0,0,0,.9), rgba(0,0,0,.1)), url(${image_path + movie.poster_path})`;

    popup_container.innerHTML = `
     <span class="x-icon"><i class="fa-solid fa-x"></i></span>
    <div class="content">
        <div class="left">
        <div class="poster-img">
            <img src="${image_path + movie.poster_path}" alt="">
        </div>
        <div class="single-info">
            <span>Add to favorites:</span>
            <span class="heart-icon"><i class="fa-solid fa-heart"></i></span>
        </div>
        </div>
        <div class="right">
           <h1>${movie.title}</h1>
           <h3>${movie.tagline}</h3>
           <div class="single-info-container">
            <div class="single-info">
                <span>Language:</span>
                <span>${movie.spoken_languages[0].name}</span>
            </div>
            <div class="single-info">
                <span>Length:</span>
                <span>${movie.runtime}</span>
            </div>
            <div class="single-info">
                <span>Rate:</span>
                <span>${movie.vote_average}</span>
            </div>
            <div class="single-info">
                <span>Budget:</span>
                <span>$ ${movie.budget}</span>
            </div>
            <div class="single-info">
                <span>Release Date:</span>
                <span>${movie.release_date}</span>
            </div>
           </div>
           <div class="genres">
            <h2>Genres</h2>
            <ul>
              ${movie.genres.map(e => `<li>${e.name}</li>`).join('')}
               </ul>
           </div>
           <div class="overview">
            <h2>Overview</h2>
            <p>${movie.overview}</p>
           </div>
           <div class="trailer">
            <h2>Trailer</h2>
            <iframe width="560px" height="315" src="https://www.youtube.com/embed/${movie_trailer}" title="Youtube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
           </div>
        </div>
    </div>
    `
    //to enable users to click on icon to show and remove popup container
    const x_icon = document.querySelector('.x-icon')
    x_icon.addEventListener('click', () =>     popup_container.classList.remove('show-popup'));
    
    //to give functionality to the heart icon
   const heart_icon = popup_container.querySelector('.heart-icon');

// keep heart red if already in favorites
if (get_LS().includes(movie_id)) {
  heart_icon.classList.add('change-color');
}

heart_icon.addEventListener('click', () => {
  if (heart_icon.classList.contains('change-color')) {
    remove_LS(movie_id);
  } else {
    add_to_LS(movie_id);
  }
  heart_icon.classList.toggle('change-color');
  fetch_favorite_movies();
});

  fetch_favorite_movies()
}

// to make the video show at the favorite secton when click on favorite icon, and want it to be saved even after we close the browser
//we are going to use local storage for that
//function for local storage
function get_LS () {
    const movie_ids = JSON.parse(localStorage.getItem('movie-id'))
    return movie_ids === null ? [] : movie_ids //this means if there is not an id just return an empty array
}
function add_to_LS (id) {
    const movie_ids = get_LS()
     if (!movie_ids.includes(id))
    localStorage.setItem('movie-id', JSON.stringify([...movie_ids, id]))
}
function remove_LS (id) {
     const movie_ids = get_LS()
     localStorage.setItem('movie-id', JSON.stringify(movie_ids.filter(e => e !== id)))
}
//to add movie to the favorite but then i will create a function that fetches the local storage everytime, add a movie and retunr it anytime
fetch_favorite_movies()
async function fetch_favorite_movies () {
    main_grid.innerHTML = ''
    const movies_LS = await get_LS()
    const movies = []
    for( let i = 0; i <= movies_LS.length - 1; i++) {
        const movie_id = movies_LS[i]
        let movie = await get_movies_by_id(movie_id);
        add_favorites_to_dom_from_LS(movie)
        movies.push(movie)
    }
}
function  add_favorites_to_dom_from_LS(movie_data) {
      main_grid.innerHTML += `
           <div class="card" data-id="${movie_data.id}">
                <div class="img">
                <img src="${image_path + movie_data.poster_path}" alt="">
                </div>
                <div class="info">
                    <h2>${movie_data.title}</h2>
                    <div class="single-info">
                        <span>Rate:</span>
                        <span>${movie_data.vote_average}</span>
                    </div>
                    <div class="single-info">
                        <span>Release Date:</span>
                        <span>${movie_data.release_date}</span>
                    </div>
                </div>
            </div>
     `
     const cards = document.querySelectorAll('.card')
     add_click_effect_to_card(cards)
}
//adding the trending movies features
get_trending_movies()
async function get_trending_movies () {
    const resp = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`) 
    const respData = await resp.json()
    return respData.results;
    }
add_to_dom_trending()
    async function add_to_dom_trending () {

        const data = await get_trending_movies()
        console.log(data)
       
        //this will give us only 10 results
        trending_el.innerHTML = data.slice(0, 20).map(e => {
            return `
             <div class="card" data-id="${e.id}">
                <div class="img">
                <img src="${image_path + e.poster_path}" alt="">
                </div>
                <div class="info">
                    <h2>${e.title}</h2>
                    <div class="single-info">
                        <span>Rate:</span>
                        <span>${e.vote_average}</span>
                    </div>
                    <div class="single-info">
                        <span>Release Date:</span>
                        <span>${e.release_date}</span>
                    </div>
                </div>
            </div>
            `
        }). join('');
        
  const cards = trending_el.querySelectorAll('.card');
  add_click_effect_to_card(cards);
    }
