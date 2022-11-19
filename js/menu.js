import { LinksMenu } from './const.js'

const body = document.querySelector('body');

const iconMenuElement = document.createElement('div');
iconMenuElement.classList.add('icon-menu');
iconMenuElement.textContent = '☰';

const menuWrapperElement = document.createElement('div');
menuWrapperElement.classList.add('menu-wrapper')
menuWrapperElement.setAttribute('hidden', 'true')

const mainMenuElement = document.createElement('menu');
mainMenuElement.classList.add('main-menu');
mainMenuElement.classList.add('menu-hide');
mainMenuElement.innerHTML = `
    <div class="close-menu-btn">✖</div>
`;

const closeMenuBtnElement = mainMenuElement.querySelector('.close-menu-btn');

const crateLinksMenu = () =>{
    const ulLinksElement = document.createElement('ul');
    LinksMenu.forEach(({textName, href})=>{
        if (href === location.pathname){
            ulLinksElement.innerHTML = `${ulLinksElement.innerHTML}<li><b>${textName}</b></li>`
            return;
        }
        ulLinksElement.innerHTML = `${ulLinksElement.innerHTML}<li><a href="${href}">${textName}</a></li>`
    })
    mainMenuElement.append(ulLinksElement)
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
    iconMenuElement.addEventListener('click', showMenu)
}

const addCloseMenuBtnListner = () => {
    closeMenuBtnElement.addEventListener('click', closeMenu)
}

const createMenu = () => {
    body.append(...[iconMenuElement, menuWrapperElement, mainMenuElement]);
    crateLinksMenu();
    // iconMenuElement = body.querySelector('.icon-menu')
}

export { addMenuIconListner, addCloseMenuBtnListner, createMenu };
