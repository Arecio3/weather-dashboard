var weatherKey = "5cdf849bdb222580b127afdee2a2acdb";
var todayEl = $("#today");
// click event on the search button

$("#search-button").on("click", function () {
    // hooks into the value thats inputted
    var searchValue = $("#search-value").val();
    console.log(searchValue);
    getWeather(searchValue);
    fiveDayCast(searchValue);
})

function getWeather(searchValue) {
    var queryUrl = "https://api.openweathermap.org/data/2.5/weather/?q=" + searchValue + "&appid=" + weatherKey + "&units=imperial";
    fetch(queryUrl)
        .then(function (response) {
            return response.json()

        }).then(function (data) {
            console.log(data);
            
        })
        
        var city = document.createElement("h3")
        var date = document.createElement("li")

        city.textContent = data.main.temp;
        todayEl.append(city);
}

function fiveDayCast (searchValue) {
    var queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=" + weatherKey + "&units=imperial";
    fetch(queryUrl)
        .then(function (response) {
            return response.json()

        }).then(function (data) {
            console.log(data);
            
        })
}


