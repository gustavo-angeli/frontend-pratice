const mainContent = document.querySelector('#content')

let debounceTimeout;

async function getData() {
    return fetch('https://api.coincap.io/v2/assets')
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}
function formatNumber(value) {
    const number = parseFloat(value);
    if (isNaN(number)) {
        console.error('The value must be a number.');
        return value;
    }
    if (number >= 1_000_000_000_000) {
        return (number / 1_000_000_000_000).toFixed(2) + 'T';
    } else if (number >= 1_000_000_000) {
        return (number / 1_000_000_000).toFixed(2) + 'B';
    } else if (number >= 1_000_000) {
        return (number / 1_000_000).toFixed(2) + 'M';
    } else if (number >= 1_000) {
        return (number / 1_000).toFixed(2) + 'K';
    } else {
        return number.toString();
    }
}
function createElement(tag, options = {}) {
    const element = document.createElement(tag)
    if (options.textContent) element.textContent = options.textContent;
    if (options.innerHTML) element.innerHTML = options.innerHTML;
    if (options.style) Object.assign(element.style, options.style);
    if (options.classList) element.classList.add(options.classList);
    return element;
}

function appendDataInContent(data, isMobile) {
    const fragment = document.createDocumentFragment();

    const firstCol = createElement('div', {innerHTML: `<p class='column-title'>Name</p>`, classList : 'column'})

    if (isMobile) {
        const secondCol = createElement('div', {innerHTML: `<p class='column-title'>Price/Change24h</p>`, classList : 'column'})
        const thirdCol =  createElement('div', {innerHTML : `<p class='column-title'>Cap/Vol</p>`, classList : 'column'})

        fragment.append(firstCol, secondCol, thirdCol)

        data.forEach(coin => {
            const firstCel = document.createElement('div')
            const symbol = createElement('p', {textContent : coin.symbol, classList: 'symbol'})
            const name = createElement('p', {textContent : coin.name, classList: 'name'})
            firstCel.append(symbol, name)
            firstCol.append(firstCel)
            
            const secondCel = document.createElement('div')
            const price = createElement('p', {textContent : `$${parseFloat(coin.priceUsd).toFixed(2)}`, classList: 'symbol'})
            const changePercent24Hr = createElement('p', {
                textContent : `${parseFloat(coin.changePercent24Hr).toFixed(2)}%`,
                style : {
                    color: coin.changePercent24Hr > 0 ? 'green' : 'red'
                },
                classList: 'name'
            })
            secondCel.append(price, changePercent24Hr)
            secondCol.append(secondCel)
            
            const thirdCel = document.createElement('div')
            const marketCapUsd = createElement('p', {textContent : formatNumber(coin.marketCapUsd), classList: 'symbol'})
            const volumeUsd24Hr = createElement('p', {textContent : formatNumber(coin.volumeUsd24Hr), classList: 'name'})
            thirdCel.append(marketCapUsd, volumeUsd24Hr)
            thirdCol.append(thirdCel)
        })
    } else {
        const secondCol = createElement('div', {innerHTML:  `<p class='column-title'>Price</p>`, classList : 'column'})
        const thirdCol =  createElement('div', {innerHTML : `<p class='column-title'>Change</p>`, classList : 'column'})
        const fourthCol = createElement('div', {innerHTML : `<p class='column-title'>24h Volume</p>`, classList : 'column'})
        const fifthCol =  createElement('div', {innerHTML : `<p class='column-title'>Market Cap</p>`, classList : 'column'})

        fragment.append(firstCol, secondCol, thirdCol, fourthCol, fifthCol)

        data.forEach(coin => {
            const name = createElement('div', {innerHTML : `<p class='symbol spacing-between-p'>${coin.symbol}</p> <p class='name'>${coin.name}</p>`})
            firstCol.append(name)

            const price = createElement('div', {innerHTML : `<p class='symbol'>$${parseFloat(coin.priceUsd).toFixed(2)}</p>`})
            secondCol.append(price)

            const changePercent24Hr = createElement('div', {
                innerHTML : `<p class='symbol'>${parseFloat(coin.changePercent24Hr).toFixed(2)}%</p>`,
                style : {
                    color: coin.changePercent24Hr > 0 ? 'green' : 'red'
                }
            })
            thirdCol.append(changePercent24Hr)

            const volumeUsd24Hr = createElement('div', {innerHTML : `<p class='symbol'>${formatNumber(coin.volumeUsd24Hr)}</p>`})
            fourthCol.append(volumeUsd24Hr)

            const marketCapUsd = createElement('div', {innerHTML : `<p class='symbol'>${formatNumber(coin.marketCapUsd)}</p>`})
            fifthCol.append(marketCapUsd)
        })
    }

    mainContent.innerHTML = ''
    mainContent.append(fragment)
}

let data = '';

async function updateElements() {
    if (data == '') {
        data = await getData();
    }
    if (window.innerWidth < 1080) {
        appendDataInContent(data.data, true)
    } else {
        appendDataInContent(data.data, false)
    }
}
updateElements();

window.addEventListener('resize', () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(updateElements, 100);
});