'use strict';

const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShows = document.querySelector('.tv-shows');

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

tvShows.addEventListener('mouseover', e => {
  const target = e.target;
  const tvCard = target.closest('.tv-card');

  if(tvCard) {
    const img = tvCard.querySelector('.tv-card__img');
    const src = img.src;

    img.src = img.dataset.backdrop;
    tvCard.onmouseout = () => img.src = src;
  }
})
