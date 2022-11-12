import { sendPost } from './requests.js'
import { createOrders, createCloseDialog, switchTheme, setColorTheme } from "./render.js";
import { API_USER_ORDERS, API_CLOSE_ORDER } from './const.js'


setThemeBody();

(async () => {
    // const responseJson = await sendPost(API_USER_ORDERS, {initData: 'query_id=AAH3VZUwAAAAAPdVlTB7ve9F&user=%7B%22id%22%3A815093239%2C%22first_name%22%3A%22%F0%9D%94%BC%F0%9D%95%98%F0%9D%95%A0%F0%9D%95%A3%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22menlor%22%2C%22language_code%22%3A%22ru%22%7D&auth_date=1667667409&hash=1a7a95ac21d8640bdad7e48996682e3ab9ecc799f277605fc47738018cea90b4'});
    const responseJson = await sendPost(API_USER_ORDERS, {initData: window.Telegram.WebApp.initData});

    if (responseJson){
        sessionStorage.setItem("ordersJson", [JSON.stringify(responseJson)])
        const selectFied = document.querySelector('select[name=sorter]');
        sortingOrders(selectFied.value)
        selectFied.addEventListener('change', (evt)=>{
            sortingOrders(evt.target.value);
        });
        return;
    }
    document.querySelector(body).innerHTML = '<h1>Заявок нет!</h1>'
    })()

// FUNCTION SECTION START

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

function globalListener(){
    const sectionOrders = document.querySelector('.orders');
    sectionOrders.addEventListener('click', (evt) => {
        if (evt.target.classList.contains('show-hide-button')){
            showHideOrderCard(evt);
            return;
        }
        if (evt.target.classList.contains('order-done')){
            const orderCard = evt.target.closest('.order');
            orderCard.append(createCloseDialog(orderCard.dataset.orderId))
            return;
        }

        if (evt.target.classList.contains('close-order-btn')){
            closeOrder(evt);
            return;
        }
        if (evt.target.classList.contains('cancel-order-btn')) {
            const orderCard = evt.target.closest('.order');
            orderCard.removeChild(orderCard.querySelector('.close-dialog'))
        }
    })
}

function sortingOrders(selectValue){
    let [column, type] = selectValue.split('-');
    const ordersJson = JSON.parse(sessionStorage.getItem("ordersJson"));
    ordersJson.sort((a, b) => {
        if (type === 'asc'){
            if(column === 'no'){
                return (parseInt(a[column].split('-')[1]) > parseInt(b[column].split('-')[1]) ? 1 : -1);
            }
            return (a[column] > b[column] ? 1 : -1);
        }
        if(column === 'no'){
            return (parseInt(a[column].split('-')[1]) > parseInt(b[column].split('-')[1]) ? -1 : 1);
        }
        return (a[column] > b[column] ? -1 : 1);      
    } )
    sessionStorage.setItem("ordersJson", [JSON.stringify(ordersJson)])
    const orders = document.querySelector('.orders');
    if (orders) {orders.remove();}
    createOrders(ordersJson);
    globalListener();
}

function showHideOrderCard(evt){
    const parentDiv = evt.target.parentElement;
    const title = parentDiv.querySelector('.title')
    if (evt.target.dataset.hidden === 'true'){
        parentDiv.classList.remove('order-hide');
        parentDiv.classList.add('order-show');

        title.classList.remove('title-hide');
        title.classList.add('title-show');

        evt.target.dataset.hidden = 'false';
        evt.target.textContent = '▲ Скрыть ▲'
        return
    }
    parentDiv.classList.remove('order-show');
    parentDiv.classList.add('order-hide');

    title.classList.remove('title-show');
    title.classList.add('title-hide');

    evt.target.dataset.hidden = 'true';
    evt.target.textContent = '▼ Показать ▼';
}

function closeOrder(evt){
    const orderCard = evt.target.closest('.order');
    evt.target.closest('.close-dialog').innerHTML = '<div class="loader"></div>';
    (async () => {
        const responseJson = await sendPost(API_CLOSE_ORDER, {id: orderCard.dataset.orderId});
        if (responseJson['result']){
            let ordersJson = JSON.parse(sessionStorage.getItem("ordersJson"));
            ordersJson = ordersJson.filter((order) => order.id !== parseInt(orderCard.dataset.orderId));
            sessionStorage.setItem("ordersJson", [JSON.stringify(ordersJson)]);
            orderCard.style.maxHeight = '0px';
            setTimeout(()=>{
                orderCard.parentNode.removeChild(orderCard);
            }, 1000)
        }else{
            orderCard.removeChild(orderCard.querySelector('.close-dialog'));
            const errorMessage = document.createElement('div');
            errorMessage.classList.add('error-message');
            errorMessage.textContent = 'ОШИБКА ЗАКРЫТИЯ ЗАЯВКИ';
            const orderBody = orderCard.querySelector('.order__body');
            orderCard.insertBefore(errorMessage, orderBody);
            orderBody.removeChild(orderBody.querySelector('.order-done'));
        }
    })()
}

// FUNCTIONS SECTION END

