function convertingToHtml (parseStr){
    // конвертирует (парсит?) в HTML заявку полученную с сервера
    const matches = (() => {
        return [...parseStr.matchAll(new RegExp('([0-9]|[-()+]){7,}', 'g'))];
    })()
    matches.forEach((math) => {
        let numberPhone = math[0].replaceAll(new RegExp('[\+()-]', 'g'), '');
        if (numberPhone.startsWith('7')){
            numberPhone = `+${numberPhone}`
        }
        numberPhone = `<b class="telephone">${numberPhone}</b>`;
        parseStr = parseStr.replaceAll(math[0], numberPhone);
    });
    parseStr = parseStr.replaceAll('\n', '<br/>');
    return parseStr;
}

export { convertingToHtml }