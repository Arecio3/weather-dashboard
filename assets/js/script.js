var weatherKey = "5cdf849bdb222580b127afdee2a2acdb";

var fiveDay = moment().add(1, 'days').calendar();
var todayEl = document.getElementById("today");
var historyEl = document.getElementById("history");
var forecastElement = document.getElementById("forecast");
// gets items from local storage parses it, empty array allows for there to be no history
var cities = JSON.parse(localStorage.getItem("cities")) || [];
var ulEl = document.createElement("ul")

var searchBtn = document.getElementById("search-button");


searchBtn.addEventListener("click", saveSearch);

saveSearchValue();

function saveSearch() {
    // hooks into the value thats inputted

    var searchValue = document.getElementById("search-value").value;

    if (!cities.includes(searchValue)) {
        // this puts the last city that was searched in the front of the array, length of array
        cities.unshift(searchValue);
        localStorage.setItem("cities", JSON.stringify(cities));

        console.log(searchValue);
        getWeather(searchValue);
        fiveDayCast(searchValue);
        saveSearchValue();
    }

}


function saveSearchValue () {
    // get or set HTML mark up that was set or added 
    historyEl.innerHTML = "";
    console.log(cities);
    // goes through the array of cities that was searched and makes a button out of each them
    for (var i = 0; i < cities.length; i++) {
        var previousCity = document.createElement("button");
        // setting value of cityname to the array
        previousCity.setAttribute("cityName", cities[i])
        // puts the name of the city that was searched on the button
        previousCity.textContent = cities[i];
       
        // tells to run getweather function and gets the attribute cityName
        previousCity.addEventListener("click", function () {
            getWeather(this.getAttribute("cityName"));
            fiveDayCast(this.getAttribute("cityName"));
        })
        // puts it on the page 
        historyEl.appendChild(previousCity);
        
    }
}



function getWeather(searchValue) {


    var queryUrl = "https://api.openweathermap.org/data/2.5/weather//?q=" + searchValue + "&appid=" + weatherKey + "&units=imperial";
    fetch(queryUrl)

        .then(function (response) {
            return response.json()

        }).then(function (data) {
            // clearing contents inside element so you can add the new data 
            todayEl.innerHTML = "";
            var dateEl = moment().format("MM/DD/YYYY");
            
            console.log("This is the data----");
            console.log(data);
            // hook into data 
            var cityName = data.name;
            var temp = data.main.temp;
            var wind = data.wind.speed
            var humidity = data.main.humidity
            var longitude = data.coord.lon;
            var latitude = data.coord.lat;
            //calls function with specific value 
            uvIndex(latitude, longitude);

            var iconUrl = "https://openweathermap.org/img/wn/" + data.weather[0].icon + ".png";

            // create elements for data
            var iconImage = document.createElement("img");
            var cityNameEl = document.createElement("h1");
            var windliEl = document.createElement("li");
            var templiEl = document.createElement("li");
            var humidityliEl = document.createElement("li");
            
            // sets img attr = to icon data
            iconImage.setAttribute("src", iconUrl);



            // putting the text of the city name + date
            $(cityNameEl).text(cityName + " " + dateEl);
            todayEl.append(cityNameEl);
            todayEl.append(iconImage);
            
            $(windliEl).text("Windspeed: " + wind + " MPH")
            todayEl.append(windliEl)

            $(templiEl).text("Temp: " + temp + "°F")
            todayEl.append(templiEl);

            $(humidityliEl).text("Humidity: " + humidity + " %")
            todayEl.append(humidityliEl);
            // todays weather container css
            $(todayEl).css({ "border": "black solid 2px", "border-radius": "0.5em", "padding": "10px" });

        





        })
        // sets everything that was added to actually markup 
    


}



function uvIndex(latitude, longitude) {
    var uvUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&appid=" + weatherKey;
    fetch(uvUrl)
        .then(function (response) {
            return response.json()

        }).then(function (data) {
            console.log(data);

            var uviValue = data.current.uvi;
            console.log(uviValue);


            var uviEl = document.createElement("li");
            uviEl.style.width = "max-content";
            uviEl.style.padding = "5px";
            uviEl.innerHTML = "UV Index: " + uviValue;
            
            if (uviValue < 3) {
                uviEl.style.backgroundColor = "green"
            } else if (uviValue < 6) {
                uviEl.style.backgroundColor = "yellow"
            } else if (uviValue < 8) {
                uviEl.style.backgroundColor = "orange"
            } else if (uviValue < 11) {
                uviEl.style.backgroundColor = "red"
            } else {
                uviEl.style.backgroundColor = "purple"
            }
            todayEl.append(uviEl);
        })

}


function fiveDayCast(searchValue) {
    var queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=" + weatherKey + "&units=imperial";
    fetch(queryUrl)
        .then(function (response) {
            return response.json()

        }).then(function (data) {
            console.log(data);
            
            forecastElement.innerHTML = "";
            // sets the variable to get the dates of all 5 days in the for loop
            // var day = 1;
            for (var i = 0; i < data.list.length; i++) {
                // if that date text is equal to 3:00 grab it
                if (data.list[i].dt_txt.indexOf("15:00:00")!== -1){
                    // var todayDate = moment().add(day, 'days').format("MM/DD/YYYY");
                    var todayDate = moment.unix(data.list[i].dt).format("MM/DD/YYYY");
                    var iconUrl = "https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + ".png";
                    var temp = "Temp:" + " " + data.list[i].main.temp + "°F";
                    var wind = "Wind-speed:" + " " + data.list[i].wind.speed + " " + "MPH";
                    var humidity = "Humidity" + " " + data.list[i].main.humidity + "%";
                    var fiveDayDate = todayDate;

                    var cardEl = document.createElement("div");
                    cardEl.setAttribute("class", "card");

                    var iconImage = document.createElement("img");
                    var fiveDateEl = document.createElement("h4");
                    var windliEl = document.createElement("li");
                    var templiEl = document.createElement("li");
                    var humidityliEl = document.createElement("li");


                    iconImage.setAttribute("src", iconUrl);

                    fiveDateEl.textContent = fiveDayDate;
                    templiEl.textContent = temp;
                    windliEl.textContent = wind;
                    humidityliEl.textContent = humidity;

                    cardEl.append(fiveDateEl);
                    cardEl.append(iconImage)
                    cardEl.append(templiEl);
                    cardEl.append(windliEl);
                    cardEl.append(humidityliEl);

                    forecastElement.append(cardEl);


                    // day++;
                }
            }

        

        })
}

