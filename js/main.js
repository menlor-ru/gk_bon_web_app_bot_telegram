import { addMenuIconListner, addCloseMenuBtnListner, createMenu, setMenuLinkListner } from './menu.js';
import { switchTheme, setColorTheme } from "./render.js";


function setThemeBody(){
    // разворачиваем приложение во всю доступную высоту
    if (!window.Telegram.WebApp.isExpanded) {window.Telegram.WebApp.expand()}
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
