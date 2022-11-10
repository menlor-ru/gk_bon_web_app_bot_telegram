import { API_USER_ORDERS } from './const.js'

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

export { sendPost }