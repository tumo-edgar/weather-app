const { format } = require("date-fns")
let currentTempType = 'c'
let currentTheme = 'light'


const setTimeBlock = (city, date) => {
    let cityBlock = document.getElementById('city')
    let timeBlock = document.getElementById('time')
    let dateBlock = document.getElementById('currentDate')
    const arr = date.split(' ')
    const dateObj = new Date(date)

    dateBlock.innerText = format(dateObj, 'EEEE, dd LLL')
    cityBlock.innerText = city
    timeBlock.innerText = arr[1]
}

const setMainImage = (text) =>{

    if(text.toLowerCase().includes('sun')){
        return './images/sun.png'
    } else if(text.toLowerCase().includes('rain')){
        return './images/drizzle.png'
    } else if(text.toLowerCase().includes('partly')){
        return './images/mist.png'
    } else if(text.toLowerCase().includes('snow')){
        return './images/snow.png'
    }else if(text.toLowerCase().includes('cloud')){
        return './images/clouds.png'
    }  else if(text.toLowerCase().includes('clear')){
        return './images/clear.png'
    }  
}

const arrowDirection = {
    'N': '0deg',
    'NNE': '23deg',
    'NE': '45deg',
    'ENE': '60deg',
    'E': '90deg',
    'ESE': '100deg',
    'SE': '130deg',
    'SSE': '160deg',
    'S': '180deg',
    'SSW': '-160deg',
    'SW': '-130deg',
    'WSW': '-100deg',
    'W': '-90deg',
    'WNW': '-60deg',
    'NW': '-45deg',
    'NNW': '-23deg',
}

const setMainBlock = (value, astro) => {
    let block = document.getElementById('mainTemp')
    let feelsLikeBlock = document.getElementById('feelsLike')
    let conditionText = document.getElementById('conditionText')
    let uvAmount = document.querySelector('#uv .amount')
    let windAmount = document.querySelector('#wind .amount')
    let humidityAmount = document.querySelector('#humidity .amount')
    let pressureAmount = document.querySelector('#pressure .amount')
    let sunriseTime= document.getElementById('sunriseTime')
    let sunsetTime= document.getElementById('sunsetTime')

    let type = currentTempType === 'c' ? '°C' : '°F'
    let temp = currentTempType === 'c' ? value.temp_c : value.temp_f
    let feelsLikeTemp = currentTempType === 'c' ? value.feelslike_c : value.feelslike_f

    conditionText.innerText = value.condition.text;

    const path = setMainImage(value.condition.text)
    let mainImage = document.getElementById('mainImage')
    mainImage.src=path

    block.innerText = `${temp}${type}`
    feelsLikeBlock.innerText = `${feelsLikeTemp}${type}`
    uvAmount.innerText = value.uv
    windAmount.innerText = `${value.wind_kph}km/h`
    humidityAmount.innerText = `${value.humidity}%`
    pressureAmount.innerText = `${value.pressure_mb}hPa`
    sunriseTime.innerText = astro.sunrise
    sunsetTime.innerText = astro.sunset
}

const setForecastBlock = (value) => {
    const parent = document.querySelector('.forecast-block .wrapper')
    parent.innerHTML = ''
    value.forEach((item)=> {
        const amount = currentTempType === 'c' ? `${item.day.maxtemp_c}°C` : `${item.day.maxtemp_f}°F`
        const path = setMainImage(item.day.condition.text)
        const date = format(new Date(item.date), 'EEEE, dd LLL')
        const row = document.createElement('div')
        row.classList.add('row')

        row.innerHTML = `<img src="${path}" alt="">
        <p class="amount">${amount}</p>
        <p class="text">${date}</p>`

        parent.appendChild(row)
    })
    
}

const setHourlyBlock = (value)=>{
    const parent = document.querySelector('.hourly-info-wrapper')
    const arr = value.hour.filter(item=>item.time.match(/12:00|15:00|18:00|21:00|00:00/))
    parent.innerHTML = ''
    arr.forEach((item)=>{
        const block = document.createElement('div')
        block.classList.add('hourly-info')
        const hour = item.time.split(' ')[1]
        const amount = currentTempType === 'c' ? `${item.temp_c}°C` : `${item.temp_f}°F`
        const wind = item.wind_kph

        if(hour === '21:00' || hour === '00:00'){
            block.classList.add('night')
        }
        

        block.innerHTML = ` <p class="hour">${hour}</p>
        <img class="hourly-icon" src="./images/sun.png" alt="">
        <p class="hourly-temp">${amount}</p>
        <img class="arrow" style="transform: rotate(${arrowDirection[item.wind_dir]})" src="./images/arrow.png" alt="">
        <p class="hourly-amount">${wind}km/h</p>`
        parent.appendChild(block)
    })
}

const getData = async(city = 'Yerevan') => {
    try{
        let response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=076a7738d62f4fe2bc0163933240307&q=${city}&days=5&aqi=no&alerts=no`)

        if(!response.ok){
            console.log("Somethig went wrong")
            return
        }
        let objectResponse = await response.json()

        setTimeBlock(objectResponse.location.name, objectResponse.location.localtime)
        setMainBlock(objectResponse.current, objectResponse.forecast.forecastday[0].astro)
        setForecastBlock(objectResponse.forecast.forecastday)
        setHourlyBlock(objectResponse.forecast.forecastday[0])

    }catch(error){
        console.log(error)
        console.log("Somethig went wrong")
    }
  
}

getData()


const mainBlock = document.querySelector('#main')
const themeToggle = document.querySelector('#themeToggle')

themeToggle.addEventListener('click', ()=>{
    mainBlock.classList.toggle('dark')
})

const searchInput = document.querySelector('#searchInput')
const searchButton = document.querySelector('#searchButton')


searchButton.addEventListener('click', ()=>{
   getData(searchInput.value)
})
