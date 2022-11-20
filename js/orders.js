import { sendPost } from './requests.js'
import { createOrders, createCloseDialog, createSorterElement, showLoader, hideLoader } from "./render.js";
import { API_USER_ORDERS, API_CLOSE_ORDER, INIT_DATA_MOCK, BODY_ELEMENT } from './const.js';



const getPageOrders = () => {
    // запрашивает и выводит любые страницы кроме главной (Заявки)
    createSorterElement();
    (async () => {
        showLoader();
        let responseJson;
        const initDataTg = window.Telegram.WebApp.initData === ''?  INIT_DATA_MOCK : window.Telegram.WebApp.initData;
        responseJson = await sendPost(API_USER_ORDERS, {initData: initDataTg});
        if (responseJson){
            sessionStorage.setItem("ordersJson", [JSON.stringify(responseJson)])
            const selectFied = document.querySelector('select[name=sorter]');
            sortingOrders(selectFied.value)
            selectFied.addEventListener('change', (evt)=>{
                sortingOrders(evt.target.value);
            });
            hideLoader();
            return undefined;
        }
        BODY_ELEMENT.innerHTML = '<h1>Заявок нет!</h1>';
        hideLoader();
        return undefined;
        })()
}

const showHideOrderCard = (evt) => {
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

const closeOrder = (evt) => {
    const orderCard = evt.target.closest('.order');
    evt.target.closest('.close-dialog').innerHTML = '<div class="loader"></div>';
    (async () => {
        const initDataTg = window.Telegram.WebApp.initData === ''?  INIT_DATA_MOCK : window.Telegram.WebApp.initData;
        const responseJson = await sendPost(API_CLOSE_ORDER, {
            initData: initDataTg,
            id: orderCard.dataset.orderId});
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

const ordersSectionListener = () => {
    const sectionOrders = document.querySelector('.orders');
    sectionOrders.addEventListener('click', (evt) => {
        if (evt.target.classList.contains('show-hide-button')){
            showHideOrderCard(evt);
            return;
        }
        if (evt.target.classList.contains('order-done')){
            const orderCard = evt.target.closest('.order');
            orderCard.append(createCloseDialog())
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
    // Соритрует, создаёт и добавляет слушателя на заявки
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
    ordersSectionListener();
}

export { getPageOrders }
