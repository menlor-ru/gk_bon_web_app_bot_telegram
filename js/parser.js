function convertingToHtml (parseStr){
    const matches = (() => {
        return [...parseStr.matchAll(new RegExp('([0-9]|[-()+]){7,}', 'g'))];
    })()
    matches.forEach((math) => {
        let numberPhone = math[0].replaceAll(new RegExp('[\+()-]', 'g'), '');
        if (numberPhone.startsWith('7')){
            numberPhone = `+${numberPhone}`
        }
        // numberPhone = `<a href="tel:${numberPhone}">${math[0]}</a>`;
        numberPhone = `<b class="telephone">${numberPhone}</b>`;
        parseStr = parseStr.replaceAll(math[0], numberPhone);
    });
    parseStr = parseStr.replaceAll('\n', '<br/>');
    return parseStr;
}

export { convertingToHtml }