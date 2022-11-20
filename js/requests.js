import { API_GET_HTML } from './const.js'

async function sendPost(url, sendObj){
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(sendObj)
    })

    return response.json()
}

async function getPageContent(url) {
    let responseJson;
    if (location.host === '127.0.0.1:5500'){
        responseJson = await sendPost(`${API_GET_HTML}${url}`, {initData: 'query_id=AAH3VZUwAAAAAPdVlTB7ve9F&user=%7B%22id%22%3A815093239%2C%22first_name%22%3A%22%F0%9D%94%BC%F0%9D%95%98%F0%9D%95%A0%F0%9D%95%A3%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22menlor%22%2C%22language_code%22%3A%22ru%22%7D&auth_date=1667667409&hash=1a7a95ac21d8640bdad7e48996682e3ab9ecc799f277605fc47738018cea90b4'});
    } else {
        responseJson = await sendPost(`${API_GET_HTML}${url}`, {initData: window.Telegram.WebApp.initData});
    }
    if (responseJson){
        return JSON.stringify(responseJson['result']);
    }
    return undefined;
}

export { sendPost, getPageContent }