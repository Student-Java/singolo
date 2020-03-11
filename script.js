/* Active nav links */
const navLinks = document.querySelectorAll('body > header > div > nav > ul > li > a');
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
