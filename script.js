/* Active nav links */
const navLinks = document.querySelectorAll('nav > ul > li > a');
const sections = [...document.getElementsByClassName('slider'), ...document.querySelectorAll('main > div')];

const changeLinkState = () => {
  let index = sections.length;

  while (--index && ((window.innerHeight - sections[index].getBoundingClientRect().y) / window.innerHeight) * 100 < 65) {
  }

  navLinks.forEach(link => link.classList.remove('active'));
  navLinks[index].classList.add('active');
}

changeLinkState();
window.addEventListener('scroll', changeLinkState);


/* Slider */
const arrows = {
  left: document.getElementsByClassName('slider__left')[0],
  right: document.getElementsByClassName('slider__right')[0]
};

const animation = 'transition: .7s ease-out;';
const colors = [{bg: '#f06c64', border: '#ea676b'}, {bg: '#648BF0', border: '#647df0'}];
const sliderContainer = document.getElementsByClassName('slider')[0];
const parent = document.getElementsByClassName('slider__slides')[0];
const getSlides = () => [...parent.childNodes].filter(el => el.nodeType === 1);
// init carousel
getSlides()[0].style = `opacity: 0; margin-left: -${getSlides()[0].offsetWidth}px`;
getSlides()[2].style = `opacity: 0`;

const doSlideAnimation = (evt) => {
  let slides = getSlides();
  if (!slides || !slides.length) {
    return;
  }

  let slideNumber = (evt.target === arrows.left ? slides[0] : slides[slides.length - 1]).id.replace(/^.+[^0-9]/, '') % 2;
  sliderContainer.style = `${animation} border-bottom: 6px solid ${colors[slideNumber].bg}; background-color:  ${colors[slideNumber].border};`

  let animationStyle = `${animation}  opacity: 0;`;

  if (evt.target === arrows.left) {
    slides[0].style = `${animation}  opacity: 1; margin-left: 0px`;
    slides[1].style = `${animation} opacity: 0`;
  } else {
    slides[1].style = `${animationStyle} opacity: 0; margin-left: -${slides[1].offsetWidth}px;`;
    slides[2].style = `${animation} opacity: 1`;
  }
  Object.values(arrows).forEach(ar => ar.style = slideNumber ? `${animation} filter: hue-rotate(225deg);` : `${animation} filter: hue-rotate(0deg)`);

  let timer = setInterval(function () {
    if (evt.target === arrows.left) {
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

