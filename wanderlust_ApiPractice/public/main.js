// Foursquare API Info
const clientId = 'US5C3SPOQNT00TPBYIKA5IAOAXZHAHUJJZD2EF144HCW0XW0';
const clientSecret = 'JX4312FOQT1D3WK4FIXFH5KUHAU1S1JFVUASX5PQA5MW0W55';
const url = 'https://api.foursquare.com/v2/venues/explore?near='; // Explore venue

// OpenWeather Info
const openWeatherKey = '12d401d4fc920f36e7501f4e1c98cb46';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4")];
const $weatherDiv = $("#weather1");
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Add AJAX functions here:
const getVenues = async () => {
    const city = $input.val();
    const toDay = new Date();
    const toDayYear = toDay.getFullYear().toString();
    const toDayMonth = (toDay.getMonth() + 1).toString();
    const toDayMonthStr = toDayMonth.length === 1 ? '0' + toDayMonth : toDayMonth;
    const toDayDay = toDay.getDate().toString();
    const toDayDayStr = toDayDay.length === 1 ? '0' + toDayDay : toDayDay;
    const thisDay = toDayYear + toDayMonthStr + toDayDayStr;
    // console.log(thisDay);
    const urlToFetch = url + city + '&limit=10' + '&client_id=' + clientId + '&client_secret=' + clientSecret + '&v=' + thisDay;
    console.log(urlToFetch);
    try {
        const response = await fetch(urlToFetch);
        if (response.ok) {
            const jsonResponse = await response.json();
            const venues = jsonResponse.response.groups[0].items.map(item => item.venue);
            console.log(venues);
            return venues;
        }
    } catch (error) {
        console.log(error);
    }
}

const getForecast = async () => {
    const urlToFetch = weatherUrl + '?&q=' + $input.val() + '&APPID=' + openWeatherKey + '&units=metric';
    try {
        const response = await fetch(urlToFetch);
        if (response.ok) {
            const jsonResponse = await response.json();
            console.log(jsonResponse);
            return jsonResponse;
        }
    } catch (error) {
        console.log(error);
    }
}


// Render functions
const renderVenues = (venues) => {
    $venueDivs.forEach(($venue, index) => {
        // Add your code here:
        const venue = venues[index];
        const venueIcon = venue.categories[0].icon;
        const venueImgSrc = venueIcon.prefix + 'bg_64' + venueIcon.suffix;
        let venueContent = createVenueHTML(venue.name, venue.location, venueImgSrc);
        $venue.append(venueContent);
    });
    $destination.append(`<h2>${venues[0].location.city}</h2>`);
}

const renderForecast = (day) => {
    // Add your code here:
    let weatherContent = createWeatherHTML(day);
    $weatherDiv.append(weatherContent);
}

const executeSearch = () => {
    $venueDivs.forEach(venue => venue.empty());
    $weatherDiv.empty();
    $destination.empty();
    $container.css("visibility", "visible");
    getVenues().then((venues) => renderVenues(venues));
    getForecast().then((forecast) => renderForecast(forecast));
    return false;
}

$submit.click(executeSearch)