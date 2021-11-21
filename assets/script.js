
var apiKey = "ed836c8d5ab1b9ac09ecb3543843f83c";

var userFormEl = document.querySelector('#user-form');
var historyButtonsEl = document.querySelector('#history-buttons');
var nameInputEl = document.querySelector('#cityname');
var currentContainer = document.querySelector('#currentForcastCont');
var fiveDayContainer = document.querySelector('#fiveForcastCont');



//collect user input
var formSubmitHandler = function (event) {
  event.preventDefault();

  var city = nameInputEl.value.trim();

  if (city) {
    getUserCity(city);

    nameInputEl.value = '';
  } else {
    alert('Please enter a city name');
  }

  //add array to store city names to search history max 10 cities
    //add to search history 
    var buttonContainer = document.querySelector('#history-buttons');
    var addButton = document.createElement('button');
    addButton.setAttribute('value',city);
    addButton.classList = 'btnPrevious';
    addButton.textContent = city;
  
    buttonContainer.appendChild(addButton);
};

//if user clicks on a previous searched city button
var buttonClickHandler = function (event) {
  //when make a history button, add value= user input
  var previousCity = event.target.getAttribute('value');

  if (previousCity) {
    getUserCity(previousCity);
  }
};

//get city lon and lat for one call api
var getUserCity = function (city) {
  var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+ city + '&units=imperial&appid=' + apiKey;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          getFiveDayForcast(data.coord.lat, data.coord.lon, city);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to Weather Data');
    });
};

//get the one call api with the lat and lon we recieved from the weather api
var getFiveDayForcast = function (lat, lon, city){
  var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat  + '&lon=' + lon  + '&units=imperial&appid=' + apiKey; 

  fetch(apiUrl)
  .then(function (response) {
    if (response.ok) {
      console.log(response);
      response.json().then(function (data) {
        console.log(data);
        displayForcast(city,data);
      });
    } else {
      alert('Error: ' + response.statusText);
    }
  })
  .catch(function (error) {
    alert('Unable to connect to Weather Data');
  }); 
};

//check to see if there are child nodes in container
//if there are, delete the old

var removeAllChildNodes = function(parent) {
  while(parent.firstChild){
    parent.removeChild(parent.firstChild);
  }
};

//display all recieving information into the html file
var displayForcast = function (city,data) {
  if (data.length === 0) {
    currentContainer.textContent = 'No weather data found.';
    return;
  }

  //remove all previous nodeChilds of current container
  removeAllChildNodes(currentContainer);
  removeAllChildNodes(fiveDayContainer);

  //add header div to store city name and icon
  var header = document.createElement('div');
  header.classList = "flex-row"

  var title = document.createElement('h1');
  title.textContent = city;
  // import icon from website with code
  var icon = document.createElement('img');
  icon.setAttribute('src', "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png");
  icon.classList = "icon";
  //append to header div
  header.appendChild(title);
  header.appendChild(icon);

  //add p elements with needed info
  var date = document.createElement('p');
  var dateConv = data.current.dt * 1000;
  var dateObj = new Date(dateConv);
  date.textContent = dateObj.toLocaleString();

  var temp = document.createElement('p');
  temp.textContent = "Temp: " + data.current.temp + "F";

  var wind = document.createElement('p');
  wind.textContent = "Wind: " + data.current.wind_speed + 'MPH';

  var humid = document.createElement('p');
  humid.textContent = "Humidity: " + data.current.humidity + '%';

  var UVindex = document.createElement('p');
  if(parseInt(data.current.uvi) < 3 ){
    UVindex.classList = 'favorable';
  }
  if(parseInt(data.current.uvi) > 5){
    UVindex.classList = 'severe';
  }
  if(parseInt(data.current.uvi) > 2 || parseInt(data.current.uvi) < 6){
    UVindex.classList = 'moderate';
  }
  UVindex.textContent = "UV Index: " + data.current.uvi;
  // append all children to parent current day container
  currentContainer.appendChild(header);
  currentContainer.appendChild(date);
  currentContainer.appendChild(temp);
  currentContainer.appendChild(wind);
  currentContainer.appendChild(humid);
  currentContainer.appendChild(UVindex);

  //itterate over 5 days, skipping the current int the daily array to display
  //next five day forcast and push them into the html file
  for( var i=1; i < 6; i++){
    var dayContainer = document.createElement('div');
    dayContainer.classList = "card-body forcast";

    var icons = document.createElement('img');
    icons.setAttribute('src', "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png");
    icons.classList = "icon";

    var dates = document.createElement('p');
    var dateConversion = data.daily[i].dt * 1000;
    var dateObject = new Date(dateConversion);
    dates.textContent = dateObject.toLocaleString();

    var temps = document.createElement('p');
    temps.textContent = "Temp: " + data.daily[i].temp.day + "F";
  
    var winds = document.createElement('p');
    winds.textContent = "Wind: " + data.daily[i].wind_speed + 'MPH';
  
    var humids = document.createElement('p');
    humids.textContent = "Humidity: " + data.daily[i].humidity + '%';

    dayContainer.appendChild(dates);
    dayContainer.appendChild(icons);
    dayContainer.appendChild(temps);
    dayContainer.appendChild(winds);
    dayContainer.appendChild(humids);

    fiveDayContainer.appendChild(dayContainer);
  };

};

userFormEl.addEventListener('submit', formSubmitHandler);
historyButtonsEl.addEventListener('click', buttonClickHandler);