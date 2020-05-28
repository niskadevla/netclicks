'use strict';

const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const API_KEY = '2d4c165832ba9416909b2d8884eb29e3';

const leftMenu = document.querySelector('.left-menu'),
  hamburger = document.querySelector('.hamburger'),
  tvShowsList = document.querySelector('.tv-shows__list'),
  modal = document.querySelector('.modal');


const DBService = class {
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
}


const renderCard = response => {
  console.log(response);
  tvShowsList.textContent = '';

  response.results.forEach(item => {
    const {
            backdrop_path: backdrop,
            name: title,
            poster_path: poster,
            vote_average: vote
          } = item;

    const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
    const backdropIMG = backdrop ? IMG_URL + backdrop : '';
    const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

    const card = document.createElement('li');
    card.className = 'tv-shows__item';
    card.innerHTML = `
      <a href="#" class="tv-card">
          ${voteElem}
          <img class="tv-card__img"
               src="${posterIMG}"
               data-backdrop="${backdropIMG}"
               alt="${title}">
          <h4 class="tv-card__head">${title}</h4>
      </a>
    `;

    tvShowsList.append(card);
    console.log(card);
  });
};

new DBService().getTestData().then(renderCard);



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
    document.body.style.overflow = 'hidden';
    modal.classList.remove('hide');
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
