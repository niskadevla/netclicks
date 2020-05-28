'use strict';

const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';

const leftMenu = document.querySelector('.left-menu'),
  hamburger = document.querySelector('.hamburger'),
  tvShowsList = document.querySelector('.tv-shows__list'),
  modal = document.querySelector('.modal'),
  tvShows = document.querySelector('.tv-shows'),
  tvCardImg = document.querySelector('.tv-card__img'),
  modalTitle = document.querySelector('.modal__title'),
  genresList = document.querySelector('.genres-list'),
  rating = document.querySelector('.rating'),
  description = document.querySelector('.description'),
  modalLink = document.querySelector('.modal__link'),
  searchForm = document.querySelector('.search__form'),
  searchFormInput = document.querySelector('.search__form-input');


const loading = document.createElement('div');
loading.className = 'loading';


const DBService = class {
  constructor() {
    this.SERVER = 'https://api.themoviedb.org/3';
    this.API_KEY = 22%5 + 'd4c165832ba9416909b2d8884eb29e' + 23%5;
  }

  getData = async url => {
    const res = await fetch(url);
    if(res.ok) {
      return res.json();
    } else {
      throw new Error(`Did not get data ${url}`);
    }
  }

  getTestData = () => {
    return this.getData('test.json');
  }

  getTestCard = () => {
    return this.getData('card.json');
  }

  getSearchResult = query => this
    .getData(`${this.SERVER}/search/tv?api_key=${this.API_KEY}&language=ru-RU&page=1&query=${query}&include_adult=true`);

  getTvShow = id => this
    .getData(`${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`);
}

// console.log(new DBService().getSearchResult('Папа'));

const renderCard = response => {
  tvShowsList.textContent = '';

  response.results.forEach(item => {
    const {
            backdrop_path: backdrop,
            name: title,
            poster_path: poster,
            vote_average: vote,
            id
          } = item;

    const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
    const backdropIMG = backdrop ? IMG_URL + backdrop : '';
    const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

    const card = document.createElement('li');
    card.className = 'tv-shows__item';
    card.innerHTML = `
      <a href="#" id="${id}" class="tv-card">
          ${voteElem}
          <img class="tv-card__img"
               src="${posterIMG}"
               data-backdrop="${backdropIMG}"
               alt="${title}">
          <h4 class="tv-card__head">${title}</h4>
      </a>
    `;
    // console.dir(card);
    loading.remove();
    tvShowsList.append(card);
  });
};

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  const value = searchFormInput.value.trim();
  searchFormInput.value = '';
  if(value) {
    tvShows.append(loading);
    new DBService().getSearchResult(value).then(renderCard);
  }
});



//Opening and closing the menu
hamburger.addEventListener('click', () => {
  leftMenu.classList.toggle('openMenu');
  hamburger.classList.toggle('open');
});

document.addEventListener('click', e => {
  if(!e.target.closest('.left-menu')) {
    leftMenu.classList.remove('openMenu');
    hamburger.classList.remove('open');
  }
});

leftMenu.addEventListener('click', e => {
  e.preventDefault();
  const target = e.target;
  const dropdown = target.closest('.dropdown');

  if(dropdown) {
    dropdown.classList.toggle('active');
    leftMenu.classList.add('openMenu');
    hamburger.classList.add('open');
  }
});

//Changing card
const changeImage = e => {
  const card = e.target.closest('.tv-shows__item');

  if(card) {
    const img  = card.querySelector('.tv-card__img');

    if(img.dataset.backdrop) {
      [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
    }
  }
}

tvShowsList.addEventListener('mouseover', changeImage);
tvShowsList.addEventListener('mouseout', changeImage);


//Opening modal window
tvShowsList.addEventListener('click', e => {
  e.preventDefault();

  const target = e.target;
  const card = target.closest('.tv-card');

  if(card) {
    new DBService().getTvShow(card.id)
      .then(({
              poster_path: posterPath,
              name: title,
              genres,
              vote_average: voteAverage,
              overview,
              homepage
            }) => {        
        tvCardImg.src = IMG_URL + posterPath;
        tvCardImg.alt = title;
        modalTitle.textContent = title;
        genresList.innerHTML = genres.reduce((acc, item) =>  `${acc}<li>${item.name}</li>`, '');
        rating.textContent = voteAverage;
        description.textContent = overview;
        modalLink.href = homepage;
      })
      .then(() => {
        document.body.style.overflow = 'hidden';
        modal.classList.remove('hide');
      });
  }
});

//Closing modal window
modal.addEventListener('click', e => {
  // console.log(e.target.classList.contains('modal'));
  if(e.target.closest('.cross') ||
    e.target.classList.contains('modal')) {
    document.body.style.overflow = '';
    modal.classList.add('hide');
  }
});
