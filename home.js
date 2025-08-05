const apikey = "f13345734de7794a933a91bf62a78474";
const cityInput = document.querySelector(".cityInput");
const weatherForm = document.querySelector(".weatherForm");
const searchbar = document.querySelector(".search-bar")
const errordisplay = document.getElementById("displayerror");
const aqilist = [`Good`, `Fair`, `Moderate`, `Poor`, `Very Poor`];

weatherForm.addEventListener("submit", async event =>{
    event.preventDefault();
    const city = cityInput.value;
    if(city){
        try{
            const weatherdata=await getweatherData(city);
            displayweatherInfo(weatherdata);
        }
        catch(error){
            console.error(error);
            displayError("Not found!");
        }
    } else {
        displayError("Please enter a city");
    }
});
async function getweatherData(city){
    const apiurl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
    const response = await fetch(apiurl);
    if(!response.ok){
        throw new Error("Not found!");
    }
    errordisplay.innerHTML="";
    return await response.json();
}
function displayweatherInfo(data){
    const {main:{temp,feel_like,humidity},
            weather:[{description,icon}],
            timezone,
            name,
            coord:{lat,lon},
            wind:{speed,gust,deg}}=data;

    const airqualilyurl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apikey}`;
    fetch(airqualilyurl).then(res => res.json()).then(data =>{
        const {co, no, no2, o3, so2, pm2_5, pm10, nh3} = data.list[0].components;
        const airquality = document.querySelector(".air-quality");
        airquality.innerHTML=`${aqilist[data.list[0].main.aqi-1]}`;
    }).catch(() =>{
        alert(`Failed to fecth Air Quality Index`);
    })

    const iconurl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    const location = document.getElementById("location");
    const tempdisplay = document.querySelector(".tempdisplay");
    const winddisplay = document.querySelector(".wind");
    const windgustdisplay = document.querySelector(".wind-gust");
    const weatherstatus = document.querySelector(".status");
    const time = document.querySelector(".time");
    const img = document.getElementById("img");


    location.value = name;
    location.innerHTML = name;
    time.innerHTML= `${currenttime(timezone)}`;
    img.src = iconurl;
    tempdisplay.innerHTML=`${(temp-273.15).toFixed(1)}°C`;
    winddisplay.innerHTML=`${degToCompass(deg)} ${speed} km/h`;
    windgustdisplay.innerHTML=`${gust} km/h`;
    weatherstatus.innerHTML=`${description}`;

    
}
function displayError(message){
    
    errordisplay.innerHTML=message;
}
function degToCompass(degrees) {
  const compassPoints = [
    "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
  ];

  const segmentSize = 360 / compassPoints.length;
  const index = Math.floor(((degrees + segmentSize / 2) % 360) / segmentSize);

  return compassPoints[index];
}

function currenttime(offsetInSeconds) {
  const now = new Date();

  const utcMilliseconds = now.getTime(); 
  const systemOffsetInSeconds = -now.getTimezoneOffset() * 60;
  const adjustmentSeconds = offsetInSeconds - systemOffsetInSeconds;
  const targetTimeMilliseconds = utcMilliseconds + (adjustmentSeconds * 1000);

  const targetDate = new Date(targetTimeMilliseconds);
  const hours = targetDate.getHours();
  const minutes = targetDate.getMinutes();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedHours = hours > 12 ? `${hours-12}` : `${hours}`;
  const a = hours <=12?"AM":"PM"

  return `${formattedHours}:${formattedMinutes} ${a}`;
}

cityInput.addEventListener('keyup', e => e.key === 'Enter' && getweatherData(city));