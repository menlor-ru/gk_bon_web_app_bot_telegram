import { sendPost } from './requests.js'
import { API_WATCHED_ORDER, INIT_DATA_MOCK, LinksMenu, BODY_ELEMENT, LOADER_ELEMENT } from './const.js'
import { convertingToHtml } from './parser.js'

const showLoader = () => {
    if (LOADER_ELEMENT.attributes['hidden']){
        LOADER_ELEMENT.removeAttribute('hidden');
    }
}

const hideLoader = () => {
    if (!LOADER_ELEMENT.attributes['hidden']){
        LOADER_ELEMENT.setAttribute('hidden', 'true');
    }
}

const createSorterElement = () => {
    const sorterTemplate = BODY_ELEMENT.querySelector('#sorter-template').content.cloneNode(true);
    const contentPage = BODY_ELEMENT.querySelector('.content-page');
    contentPage.append(sorterTemplate);
}

const getContentCurrentPage = () => { 
    (async () => {
        showLoader();
        const contentElement = document.querySelector('.content-page');
        contentElement.innerHTML = '';
        const currentPage = LinksMenu.filter(({href})=>href === location.hash.slice(1));
        if (currentPage.length === 1){
            if (location.hash === '#/'){
                await currentPage[0].func();
            } else {
                const contentPage = await currentPage[0].func(location.hash.slice(1));
                if (contentPage){
                    // contentPage - текстовая строка типа "<a href=\"#\">Скачать инструкцию</a>"
                    // первый и последний символ <"> слайсом убираем их. Затем заменой убераем экранирование <\"> со всех <">
                    contentElement.innerHTML = contentPage.slice(1, -1).replaceAll('\\', '');
                    BODY_ELEMENT.append(contentElement);
                    hideLoader();
                    return;
                }
                contentElement.innerHTML = `<h1>Пусто</h1><p>Тут ничего нет</p>`;
                BODY_ELEMENT.append(contentElement);
                hideLoader();
            }
            
        }
    }
    )();
}

const switchTheme = (theme = 'light') => {
    if (BODY_ELEMENT.classList.contains(`body-${theme}`)){
        return
    }
    BODY_ELEMENT.classList.remove(...BODY_ELEMENT.classList);
    BODY_ELEMENT.classList.add(`body-${theme}`)
}

const setColorTheme = (themeParams) => {
    const style = document.createElement('style')
    style.setAttribute('type', 'text/css');
    style.textContent = `
        body {background-color: ${themeParams['bg_color']}; color: ${themeParams['text_color']}}
        a {color: ${themeParams['link_color']}; } 
        details {border-color: ${themeParams['text_color']};}
        .order, .main-menu {background-color: ${themeParams['secondary_bg_color']};}
        .telephone {color: ${themeParams['link_color']}; text-decoration: underline; }
    `;
    document.head.appendChild(style);
}


const createOrders = (jsonOrders) => {
    const sectionOrders = document.createElement('section');
    sectionOrders.classList.add('orders')
    if (jsonOrders.length === 0){
        sectionOrders.innerHTML = '<h2>Заявок нет.</h2>';
    } else {
        jsonOrders.forEach((order) => {
            sectionOrders.append(createOrderCard(order));
        })
    }
    BODY_ELEMENT.querySelector('.content-page').append(sectionOrders);
}

const createOrderCard = (order) => {
    const orderCard = document.querySelector('#order-card').content.querySelector('.order').cloneNode(true);
    orderCard.dataset.orderId = order['id'];
    orderCard.querySelector('.no').textContent = order['no'];
    orderCard.querySelector('.date').textContent = order['date_open'];
    orderCard.querySelector('.address').innerHTML = `<b>${order['address']}</b>`;

    orderCard.querySelector('.description').innerHTML = convertingToHtml(order['description']);

    const code = order['code'] ? order['code'] : ''
    orderCard.querySelector('.code').innerHTML = `<b>Код:</b> ${code}`;
    const gps = order['gps'] ? order['gps'] : ''
    orderCard.querySelector('.gps').innerHTML = `<b>GPS:</b> ${gps}`;
    // orderCard.querySelector('.order-done').setAttribute('id', order['id']);
    if (!order['watched']){
        orderCard.classList.remove('border')
        orderCard.classList.add('border-new')
        const title = orderCard.querySelector('.title');
        title.classList.remove('border');
        title.classList.add('border-new');
        const showButton = orderCard.querySelector('.show-hide-button');
        showButton.style.backgroundColor = '#4bab71';
        showButton.addEventListener('click', ()=>{
            (async () => {
                const initDataTg = window.Telegram.WebApp.initData === ''?  INIT_DATA_MOCK : window.Telegram.WebApp.initData; 
                const response = await sendPost(API_WATCHED_ORDER, {
                    initData: initDataTg,
                    id: order['id']});
                if (response['result']){
                    orderCard.classList.remove('border-new')
                    orderCard.classList.add('border')
                    const title = orderCard.querySelector('.title');
                    title.classList.remove('border-new');
                    title.classList.add('border');
                    showButton.style.backgroundColor = '';
                    // сохранем в сессию список Заявок с обновленным полем watched
                    let ordersJson = JSON.parse(sessionStorage.getItem("ordersJson"));
                    ordersJson = ordersJson.map((element) => {
                        if (element.id === order.id){
                            element.watched = true;
                            return element;
                        }
                        return element;
                    });
                    sessionStorage.setItem("ordersJson", [JSON.stringify(ordersJson)]);
                }
            })()
        }, {once: true})
    }
    return orderCard
}

const createCloseDialog = () => {
    const closeDialog = document.querySelector('#close-order-dialog').content.querySelector('.close-dialog').cloneNode(true);
    return closeDialog;
}

export { getContentCurrentPage, createOrders, createCloseDialog, 
    switchTheme, setColorTheme, createSorterElement,
    showLoader, hideLoader }