import { sendPost } from './requests.js'
import { createOrders, createCloseDialog, switchTheme, setColorTheme } from "./render.js";
import { API_USER_ORDERS, API_CLOSE_ORDER } from './const.js'

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


setThemeBody();

(async () => {
    // const responseJson = await sendPost(API_USER_ORDERS, {initData: 'query_id=AAH3VZUwAAAAAPdVlTB7ve9F&user=%7B%22id%22%3A815093239%2C%22first_name%22%3A%22%F0%9D%94%BC%F0%9D%95%98%F0%9D%95%A0%F0%9D%95%A3%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22menlor%22%2C%22language_code%22%3A%22ru%22%7D&auth_date=1667667409&hash=1a7a95ac21d8640bdad7e48996682e3ab9ecc799f277605fc47738018cea90b4'});
    const responseJson = await sendPost(API_USER_ORDERS, {initData: window.Telegram.WebApp.initData});
    createOrders(responseJson);
    globalListener();
})()

function globalListener(){
    const sectionOrders = document.querySelector('.orders');
    sectionOrders.addEventListener('click', (evt) => {
        if (evt.target.classList.contains('show-hide-button')){
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
            return
        }
        if (evt.target.classList.contains('order-done')){
            const orderCard = evt.target.closest('.order');
            orderCard.append(createCloseDialog(orderCard.dataset.orderId))
            return;
        }

        if (evt.target.classList.contains('close-order-btn')){
            const orderCard = evt.target.closest('.order');
            evt.target.closest('.close-dialog').innerHTML = '<div class="loader"></div>';
            (async () => {
                const re_json = await sendPost(API_CLOSE_ORDER, {id: orderCard.dataset.orderId});
                if (re_json['result']){
                    orderCard.style.maxHeight = '0px';
                    setTimeout(()=>{
                        orderCard.parentNode.removeChild(orderCard)
                    }, 1000)
                }else{
                    orderCard.removeChild(orderCard.querySelector('.close-dialog'));
                    const errorMessage = document.createElement('div');
                    errorMessage.classList.add('error-message');
                    errorMessage.textContent = 'ОШИБКА ЗАКРЫТИЯ ЗАЯВКИ';
                    const orderBody = orderCard.querySelector('.order__body');
                    orderCard.insertBefore(errorMessage, orderBody);
                    orderBody.removeChild(orderBody.querySelector('.order-done'))
                }
            })()
            return;
        }
        if (evt.target.classList.contains('cancel-order-btn')) {
            const orderCard = evt.target.closest('.order');
            orderCard.removeChild(orderCard.querySelector('.close-dialog'))
        }
    })
}

