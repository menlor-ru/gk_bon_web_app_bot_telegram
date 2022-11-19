import { addMenuIconListner, addCloseMenuBtnListner, createMenu } from './menu.js';
import { switchTheme, setColorTheme } from "./render.js";
import { LinksMenu } from './const.js';

function setThemeBody(){
    if (window.Telegram.WebApp.colorScheme){
        switchTheme(window.Telegram.WebApp.colorScheme);
        if (Object.keys(window.Telegram.WebApp.themeParams).length > 0){
            setColorTheme(window.Telegram.WebApp.themeParams);
        }
        return;
    }
    setTimeout(setThemeBody, 1000);
    }

createMenu();
addMenuIconListner();
addCloseMenuBtnListner();

setThemeBody();

// Выполняем функцию получения контента текущей страницы
const currentPage = LinksMenu.filter(({href})=>href === location.pathname);
if (currentPage.length === 1){
    const contentPage = await currentPage[0].func('/instruction');
    if (contentPage){
        const bodyElement = document.querySelector('body');
        bodyElement.innerHTML = `${bodyElement.innerHTML} ${contentPage.slice(1, -1)}`;
    }
}
// FUNCTION SECTION START



// FUNCTIONS SECTION END

