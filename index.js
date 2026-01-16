const API_KEY = '6ac643d5f316bec7204d7a019ea3557c'
const image_path = 'https://image.tmdb.org/t/p/w500'

//making the search field work
const input = document.querySelector('.search input'); 
const btn = document.querySelector('.search button');
const main_grid = document.querySelector('.favorite .movies-grid');
const main_grid_title = document.querySelector('.favorite h1')

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
    console.log(data);

    main_grid_title.innerText = `Searching Results....`;
    main_grid.innerHTML = data.map(e => {
        return `
             <div class="card" data-id="${e.id}">
                <div class="img">
                <img src="${image_path + e.poster_path}" alt="">
                </div>
                <div class="info">
                    <h2>Movie Title</h2>
                    <div class="single-info">
                        <span>Rate:</span>
                        <span>10 / 10</span>
                    </div>
                    <div class="single-info">
                        <span>Release Date:</span>
                        <span>14-01-2026</span>
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
    return respData.results[0].key
    }
function show_popup (card) {
    popup_container.classList.add('show-popup')
}
