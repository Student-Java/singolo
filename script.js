const animation = 'transition: .7s ease-out;';
const getByClassNames = (...classNames) => classNames.map(name => [...document.getElementsByClassName(name)]).flat();

/* Active nav links */
const navLinks = document.querySelectorAll('nav > ul > li > a');
const sections = [...document.getElementsByClassName('slider'), ...document.querySelectorAll('main > div')];

const changeLinkState = (e) => {
  let index = sections.length;

  while (--index && ((window.innerHeight - sections[index].getBoundingClientRect().y) / window.innerHeight) * 100 < 65) {
  }

  navLinks.forEach(link => link.classList.remove('active'));
  navLinks[index].classList.add('active');
}

changeLinkState();
window.addEventListener('scroll', changeLinkState);


/* Phone on/off */
let turnOffPhone = (e) => [...e.target.parentElement.childNodes].filter(node => node.nodeType === 1)[2].classList.toggle('visually-hidden');

let initPhonePowerEvents = () => getByClassNames('phone-vert__base', 'phone-vert__screen', 'phone-hor__base', 'phone-hor__screen')
  .forEach(el => el.addEventListener('click', turnOffPhone));

initPhonePowerEvents();


/* Slider */
const arrows = {
  left: getByClassNames('slider__left')[0],
  right: getByClassNames('slider__right')[0]
};

const colors = [{bg: '#f06c64', border: '#ea676b'}, {bg: '#648BF0', border: '#647df0'}];
const sliderContainer = getByClassNames('slider')[0];
const getSlides = () => getByClassNames('slide');

// init carousel
let initialSlides = getSlides();
initialSlides.unshift(initialSlides[1].cloneNode(true));
initialSlides[0].style = `opacity: 0; margin-left: -${initialSlides[2].offsetWidth}px`;
initialSlides[2].style = `opacity: 0`;

const parent = initialSlides[1].parentElement;
parent.innerHTML = '';
parent.append(...initialSlides);

const doSlideAnimation = (e) => {
  let slides = getSlides();
  if (!slides || !slides.length) {
    return;
  }

  let slideNumber = (e.target === arrows.left ? slides[0] : slides[slides.length - 1]).id.replace(/^.+[^0-9]/, '') % 2;
  sliderContainer.style = `${animation} border-bottom: 6px solid ${colors[slideNumber].bg}; background-color:  ${colors[slideNumber].border};`

  let animationStyle = `${animation}  opacity: 0;`;

  if (e.target === arrows.left) {
    slides[0].style = `${animation}  opacity: 1; margin-left: 0px`;
    slides[1].style = `${animation} opacity: 0`;
  } else {
    slides[1].style = `${animationStyle} opacity: 0; margin-left: -${slides[1].offsetWidth}px;`;
    slides[2].style = `${animation} opacity: 1`;
  }
  Object.values(arrows).forEach(ar => ar.style = slideNumber ? `${animation} filter: hue-rotate(225deg);` : `${animation} filter: hue-rotate(0deg)`);

  let timer = setInterval(function () {
    if (e.target === arrows.left) {
      slides.pop();
      slides.unshift(slides[slides.length - 1].cloneNode(true));
      slides[0].style = `opacity: 0; margin-left: -${slides[slides.length - 1].offsetWidth}px`;
    } else {
      slides.shift();
      slides.push(slides[0].cloneNode(true));
      slides[slides.length - 1].style = 'opacity: 0;';
    }
    parent.innerHTML = '';
    parent.append(...slides);
    if (slideNumber) {
      initPhonePowerEvents();
    }

    clearInterval(timer);
  }, 700);
};

const throttle = (callback, limit) => {
  let wait = false;
  return function () {
    if (!wait) {
      callback.apply(null, arguments);
      wait = true;
      setTimeout(function () {
        wait = false;
      }, limit);
    }
  }
}

Object.values(arrows).forEach(arrow => arrow.addEventListener('click', throttle(doSlideAnimation, 700)));

/* Tags */
const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const getWorks = () => getByClassNames('works__work').map(el => el.childNodes[0]);

let refreshGallery = (e) => {
  getByClassNames('tags__link').forEach(link => link.classList.remove('tags__link-active'));
  e.target.classList.add('tags__link-active');

  let parentNodes = getByClassNames('works__work');
  let shuffledPictures = shuffle(parentNodes.map(el => el.childNodes[0]));
  shuffledPictures.forEach(el => el.classList.remove('active-work'));
  parentNodes.forEach((el, ind) => el.replaceChild(shuffledPictures[ind].cloneNode(), el.childNodes[0]));
  initGalleryPicturesEvents();
}

getByClassNames('tags__link').forEach(el => el.addEventListener('click', refreshGallery))


/* Gallery pictures */
const changeActiveWork = (e) => {
  getWorks().forEach(el => el.classList.remove('active-work'));
  e.target.classList.add('active-work');
};

const initGalleryPicturesEvents = () => getWorks().forEach(el => el.addEventListener('click', changeActiveWork));
initGalleryPicturesEvents();
