function getTopCurreniesNames() {
    return ['USD', 'RUB', 'EUR'];
};

function getTopCurrenies(currencies) {
    const topCurrenciesNames = getTopCurreniesNames();
    let topCurrencies = [];
    for (let currency of currencies) {

        for (let name of topCurrenciesNames) {
            if (currency.cc === name) {
                topCurrencies.push(currency);
            }
        };
    };
    return topCurrencies;
};

async function initeTopCurrencies(topCurrencies, topCurrenciesElementsArray) {
    for (let i = 0; i < topCurrenciesElementsArray.length; i++) {
        let currencyCodeName = topCurrencies[i].cc;
        let todayRate = (1 / topCurrencies[i].rate);
        let element = topCurrenciesElementsArray[i];

        element.setAttribute('nameCode', currencyCodeName);
        element.children[0].textContent = `Курс ${currencyCodeName}`;
        element.children[1].textContent = todayRate.toFixed(2);
    };
};

function createCurrenciesOptions(select, currencies) {
    currencies.forEach(currency => {
        let option = document.createElement('option');
        option.value = currency.cc;
        option.text = `${currency.cc} - ${currency.txt}`
        select.appendChild(option);
    });
};


function convert(UAHField, convertField, select, currenciesData) {
    if (UAHField.value === '') {
        convertField.value = ''
    };

    let value = (parseFloat(UAHField.value) / currenciesData.find(item => item.cc === select.value).rate).toFixed(2);

    if (!isNaN(value)) {
        convertField.value = value;
    };
};


async function getCurrencies() {
    const response = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
    const currenciesData = await response.json()
    return currenciesData;

};


async function initeConverter() {
    let currenciesData = await getCurrencies();

    const selectElement = document.querySelector('#currencies-select');
    const inputUAHElement = document.querySelector('#UAH-value');
    const convertFieldElement = document.querySelector('#currencies-value');
    const topCurrenciesElements = document.querySelectorAll('.top-currency-item');

    const topCurrencies = getTopCurrenies(currenciesData);

    initeTopCurrencies(topCurrencies, topCurrenciesElements);

    createCurrenciesOptions(selectElement, currenciesData);

    inputUAHElement.addEventListener('input', () => {
        const value = inputUAHElement.value;
        inputUAHElement.value = value.replace(/[^0-9\.]/g, '');
        convert(inputUAHElement, convertFieldElement, selectElement, currenciesData);
    });

    selectElement.addEventListener('change', () => {
        convert(inputUAHElement, convertFieldElement, selectElement, currenciesData);
    });

    for (let element of topCurrenciesElements) {
        element.addEventListener('click', () => {
            selectElement.value = element.getAttribute('nameCode');
            convert(inputUAHElement, convertFieldElement, selectElement, currenciesData);
        })
    };

};

initeConverter();