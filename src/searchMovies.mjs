import { movieData } from "./movieData.mjs";

const movieNames = movieData.map(movie => movie.name);
const section_container = document.querySelector('.features__container');
const apiKey = '2fcbd2f46f10224468462dd4c99a3e22';
let posterPaths = [];
let overview = [];
let titles = [];
let currMovieId = 0;
const resultBox = document.querySelector(".result-box");
const btn = document.querySelector(".primary__button");
const inputBox = document.getElementById("input-box");
let recommend = null

inputBox.onkeyup = function(){
    let result = [];
    let input = inputBox.value;
    if(input.length){
        result = movieNames.filter((movie)=>{
          return  movie.toLowerCase().includes(input.toLowerCase());
        });

        // console.log(result);
    }
    display(result);
    if(!result.length){
        result.innerHTML = '';
    }
}

function display(result){
    const content = result.map((list)=>{
        return `<li>${list}</li>`;
    });
    resultBox.innerHTML = `<ul>${content.join('')}</ul>`;
}

function selectInput(event){
    if (event.target.tagName === 'LI') {
        inputBox.value = event.target.textContent;
        resultBox.innerHTML = '';
        let currMovieName =  inputBox.value;
        recommend = movieData.find(movie => movie.name === currMovieName).recommend;
    }
}
function recommendation() {
    section_container.innerHTML = '';
    if (recommend != null) {
        const fetchPromises = [];

        console.log(recommend);
        for (const elem of recommend) {
            fetchPromises.push(fetchMovieDetails(elem));
        }

        // Wait for all fetch operations to complete
        Promise.all(fetchPromises)
            .then(() => {
                // Loop through the data after all fetch operations have completed
                setTimeout(() => {
                    for (let i = 0; i < 5; i++) {
                        addFeature(titles[i],overview[i],posterPaths[i]);
                    }

                    // Clear the arrays after logging the data
                    titles = [];
                    overview = [];
                    posterPaths = [];
                }, 5000);
            })
            .catch(error => console.error('Error fetching movie details:', error));

        recommend = null;
    }
}
function addFeature(title,overview,poster_path) {
    const featureElement = document.createElement('div');
    featureElement.classList.add('feature');

    const posterUrl = `https://image.tmdb.org/t/p/w500${poster_path}`;

    featureElement.innerHTML = `
      <div class="feature__details">
        <h3 class="feature__title">${title}</h3>
        <h5 class="feature__sub__title">${overview}</h5>
      </div>
      <div class="feature__image__container">
        ${posterUrl ? `<img src="${posterUrl}" alt="${title} poster" class="feature__image" />` : ''}
      </div>
    `;

    section_container.appendChild(featureElement);
  }

// tmdb api

function fetchMovieDetails(movieId) {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`)
      .then(response => response.json())
      .then((data) => {
        titles.push(data['title']);
        overview.push(data['overview']);
        posterPaths.push(data['poster_path']);
    }).catch(error => console.error('Error fetching movie details:', error));
}
resultBox.addEventListener('click', selectInput);
btn.addEventListener('click',recommendation);