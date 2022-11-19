import { sendPost } from './requests.js'
import { API_WATCHED_ORDER } from './const.js'
import { convertingToHtml } from './parser.js'

const bodyElement = document.querySelector('body');

function switchTheme(theme= 'light'){
    if (bodyElement.classList.contains(`body-${theme}`)){
        return
    }
    bodyElement.classList.remove(...bodyElement.classList);
    bodyElement.classList.add(`body-${theme}`)
}

function setColorTheme(themeParams){
    bodyElement.style.backgroundColor = themeParams['bg_color'];
    bodyElement.style.color = themeParams['text_color'];
    bodyElement.querySelector('.main-menu').style.backgroundColor = themeParams['secondary_bg_color'];

    const style = document.createElement('style')
    style.setAttribute('type', 'text/css');
    style.textContent = `a { color: ${themeParams['link_color']} } `;
    // Если главная страница устанавливаем стили для заявок
    if (location.pathname === '/'){
        document.querySelector('#order-card').content.querySelector('.order').style.backgroundColor = themeParams['secondary_bg_color'];
        style.textContent = `${style.textContent}.telephone { color: ${themeParams['link_color']}; text-decoration: underline; }`;
    }
    document.head.appendChild(style);
}


function createOrders(jsonOrders){
    const loader = bodyElement.querySelector('.loader')
    if (loader) {loader.remove();}
    const sectionOrders = document.createElement('section');
    sectionOrders.classList.add('orders')
    if (jsonOrders.length === 0){
        sectionOrders.innerHTML = '<h2>Заявок нет.</h2>';
    } else {
        const newOrder = jsonOrders.forEach((order) => {
            sectionOrders.append(createOrderCard(order));
        })
    }
    bodyElement.append(sectionOrders);
}

function createOrderCard(order){
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
                const response = await sendPost(API_WATCHED_ORDER, {id: order['id']});
                if (response['result']){
                    orderCard.classList.remove('border-new')
                    orderCard.classList.add('border')
                    const title = orderCard.querySelector('.title');
                    title.classList.remove('border-new');
                    title.classList.add('border');
                    showButton.style.backgroundColor = '';
                }
            })()
        }, {once: true})
    }
    return orderCard
}

function createCloseDialog(id_order){
    const closeDialog = document.querySelector('#close-order-dialog').content.querySelector('.close-dialog').cloneNode(true);
    return closeDialog;
}

export { createOrders, createCloseDialog, switchTheme, setColorTheme }