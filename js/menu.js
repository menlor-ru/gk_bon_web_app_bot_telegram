import { LinksMenu, BODY_ELEMENT } from './const.js'
import { getContentCurrentPage } from './render.js'


const iconMenuElement = document.createElement('div');
const menuWrapperElement = document.createElement('div');
const mainMenuElement = document.createElement('menu');


const crateLinksMenu = () =>{
    // Создаёт или перерисовывает список ссылок меню
    if (location.hash === '' || location.hash.startsWith('#tgWebAppData=query_id')) {location.hash = '#/'}
    const ulOldMenu = mainMenuElement.querySelector('ul');
    if (ulOldMenu){
        ulOldMenu.remove();
    }
    const ulLinksElement = document.createElement('ul');
    LinksMenu.forEach(({textName, href})=>{
        if (location.hash.slice(1) === href){
            ulLinksElement.innerHTML = `${ulLinksElement.innerHTML}<li><b>${textName}</b></li>`
            return;
        }
        ulLinksElement.innerHTML = `${ulLinksElement.innerHTML}<li><a href="${href}">${textName}</a></li>`
    })
    mainMenuElement.append(ulLinksElement)
    setMenuLinkListner();
    getContentCurrentPage();
}

const closeMenu = () => {
    if (mainMenuElement.classList.contains('menu-show')) {
        mainMenuElement.classList.remove('menu-show');
        mainMenuElement.classList.add('menu-hide')
        menuWrapperElement.setAttribute('hidden', 'true');
        menuWrapperElement.removeEventListener('click', closeMenu)
    }
    
}

const showMenu = () =>{
    if (mainMenuElement.classList.contains('menu-hide')) {
        mainMenuElement.classList.remove('menu-hide')
        mainMenuElement.classList.add('menu-show');
        menuWrapperElement.removeAttribute('hidden');
        menuWrapperElement.addEventListener('click', closeMenu)
    }
}

const addMenuIconListner = () => {
    const iconMenuElement = BODY_ELEMENT.querySelector('.icon-menu');
    iconMenuElement.addEventListener('click', showMenu);
}

const addCloseMenuBtnListner = () => {
    const closeMenuBtnElement = mainMenuElement.querySelector('.close-menu-btn');
    closeMenuBtnElement.addEventListener('click', closeMenu);
}

const createMenu = () => {
    iconMenuElement.classList.add('icon-menu');
    iconMenuElement.textContent = '☰';

    menuWrapperElement.classList.add('menu-wrapper')
    menuWrapperElement.setAttribute('hidden', 'true')

    mainMenuElement.classList.add('main-menu');
    mainMenuElement.classList.add('menu-hide');
    mainMenuElement.innerHTML = `
        <div class="close-menu-btn">✖</div>
    `;

    BODY_ELEMENT.append(...[iconMenuElement, menuWrapperElement, mainMenuElement]);
    crateLinksMenu();
}

const setMenuLinkListner = () => {
    const ulMenuElement = mainMenuElement.querySelector('ul');
    ulMenuElement.addEventListener('click', (evt) => {
        if (evt.target.tagName === 'A'){
            evt.preventDefault();
            location.hash = evt.target.getAttribute('href');
            crateLinksMenu();
            closeMenu();
        }
    })
}

export { addMenuIconListner, addCloseMenuBtnListner, createMenu, setMenuLinkListner };
