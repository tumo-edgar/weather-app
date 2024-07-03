const getData = async() => {
    try{
        let response = await fetch('http://api.weatherapi.com/v1/forecast.json?key=076a7738d62f4fe2bc0163933240307&q=Yerevan&days=3&aqi=no&alerts=no')

        if(!response.ok){
            console.log("Somethig went wrong")
            return
        }
        let objectReponse = await response.json()

        setCityValue(objectReponse.location.name)
        setTimeValue(objectReponse.location.localtime)
        console.log(objectReponse)
    }catch(error){
        console.log(error)
        console.log("Somethig went wrong")
    }
  
}

getData()

const setCityValue = (value)=>{
    let city = document.getElementById('city')
    city.innerText = value
}

const setTimeValue = (value)=>{
    let time = document.getElementById('time')
    const arr = value.split(' ')

    time.innerText = arr[1]
}