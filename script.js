var city, state, breweryChosen, checkedIn, filterArr, breweryArr, breweryDatabaseArr;
var totalVisitedCounter = JSON.parse(localStorage.getItem('total-visited')) || 0;
var breweriesVisitedArr = JSON.parse(localStorage.getItem('checked-in')) || [];
var visitLaterCounter = JSON.parse(localStorage.getItem('total-visit-later')) || 0;
var toVisitArr = JSON.parse(localStorage.getItem('visit-later')) || [];
var favoritesCounter = JSON.parse(localStorage.getItem('total-favs')) || 0;
var favoritesArr = JSON.parse(localStorage.getItem('favorite')) || [];
var apiKey = '07fd8e30-8eae-4f5f-a07d-ad2608235d7d';
var googleAPIKey = 'AIzaSyCVSbsCoys4-y9UHlX6z93OzyWKnOgnTGw';
var userLat, userLng;

// Set local storage data counter data to the page
renderCounts = () => {
    $('#brewery-checkin').text(totalVisitedCounter);
    $('#brewery-visitLater').text(visitLaterCounter);
    $('#visitLaterBreweryList').text(toVisitArr);
    $('#brewery-favorites').text(favoritesCounter);
    $('#favoritedBreweryList').text(favoritesArr);
    if (favoritesCounter >= 2) {
        $('#favorites-text').text('Favorites');
    } else {
        $('#favorites-text').text('Favorite');
    }
}
renderCounts();

// Set local storage data for checked in breweries
displayLists = () => {
    $('#checkedInBreweryList, #favoritedBreweryList, #futureBreweryList').empty();
    for (var c = 0; c < breweriesVisitedArr.length; c++) {
        var beerIcon = `<i class="fas fa-beer fa-2x"></i>`
        var theVisitedList = `${beerIcon} ${breweriesVisitedArr[c]}<br>`
        $('#checkedInBreweryList').append(theVisitedList);
    }
    for (var c = 0; c < favoritesArr.length; c++) {
        var thumbsUpIcon = `<i class="far fa-thumbs-up fa-2x"></i>`
        var theFavList = `${thumbsUpIcon} ${favoritesArr[c]} <br>`
        $('#favoritedBreweryList').append(theFavList);
    }
    for (var c = 0; c < toVisitArr.length; c++) {
        var pinIcon = `<i class="fas fa-map-pin fa-2x"></i>`
        var theVisitLaterList = `${pinIcon} ${toVisitArr[c]} <br>`
        $('#futureBreweryList').append(theVisitLaterList);
    }
} 
displayLists();

// Render list of nearby breweries
renderList = () => {
    $('#listDiv').empty();
    // Ajax call for breweries nearby
    var queryURL = `https://api.openbrewerydb.org/breweries?by_city=${city}&by_state=${state}`;
    $.ajax({
        url: queryURL, 
        method: "GET"
    }).then(function(response) {
        breweryArr = response;
        for (var i = 0; i < breweryArr.length; i++) {
            // List available brewery names
            var breweryName = breweryArr[i].name;
            var breweryLi = `
                <button type="button" class="breweryBtn uk-width-1-1">${breweryName}</button>
            `
            $('#listDiv').append(breweryLi);
        }
        if (breweryArr.length === 0) {
            var errorAlert = `<p>Nothing nearby :( </p>`
            $('#listDiv').append(errorAlert);
        }
    })
}

// Render information about the brewery chosen
renderBreweryInfo = () => {
    $('#infoDiv').empty();
    for (var i = 0; i < breweryArr.length; i++) {
        if (breweryArr[i].name === breweryChosen) {
            var brewery = breweryArr[i];
            var zipcode = brewery.postal_code.substr(0,5);
            var breweryNumber = `${brewery.phone.substr(0, 3)}-${brewery.phone.substr(3, 3)}-${brewery.phone.substr(6,4)}`;
            var breweryAddress = breweryArr[i].street + " " + breweryArr[i].city + " " + breweryArr[i].state + " " + breweryArr[i].postal_code.substr(0,5)
            var breweryInfo = `
                <h3>${brewery.name}</h3>
                <p>${brewery.street}, ${brewery.city}, ${brewery.state} ${zipcode}</p>
                <p>${breweryNumber}</p>
                <p>Type of brewery: ${brewery.brewery_type}</p>
                <a href="${brewery.website_url}" target="_blank">Click me to view their website</a><br>
                <button type="button" id="checkInBtn" data-name="${brewery.name}">Check-in</button> |  
                <button type="button" id="favoritesBtn" data-name="${brewery.name}">Favorite</button> | 
                <button type="button" id="visitLaterBtn" data-name="${brewery.name}">Save For Later</button> 
            `
            $('#infoDiv').append(breweryInfo);
            if(!breweryArr[i].latitude) {
                var geocodeURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + breweryAddress + "&key=" + googleAPIKey;
                $.ajax({
                    url: geocodeURL,
                    method: "GET"
                }).then(function(response){
                    var geocodeArr = response;
                    //console.log(geocodeArr);
                    var geocodeLat = geocodeArr.results[0].geometry.location.lat;
                    var geocodeLng = geocodeArr.results[0].geometry.location.lng;
                   
                    initMap(geocodeLat, geocodeLng);
                })
            } else{
                initMap(parseFloat(breweryArr[i].latitude), parseFloat(breweryArr[i].longitude));
            }
        }
    }
}

// Map function. (kyle)
function initMap(lat, lng) {
    
    if (navigator.geolocation) {
        //console.log("Test1")
        if (!userLat) {
            navigator.geolocation.getCurrentPosition(function(position) {
                userLat = position.coords.latitude;
                userLng = position.coords.longitude;
                var map = new google.maps.Map(document.getElementById('mapDiv'), {
                    zoom:13,
                    center:{lat: userLat,lng: userLng}
                })
                  //console.log("test2")
                var pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                };
                var marker = new google.maps.Marker({
                  position: pos,
                  map: map,
                  animation: google.maps.Animation.DROP,
                  icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png' 
                })
                map.setCenter(pos);
              });
        } else {
            var myLatLng = {lat: lat,lng: lng};
    
            var options = {
                zoom:13,
                center:{lat: lat,lng: lng}
            }
            var map = new google.maps.Map(document.getElementById('mapDiv'), options)
        
            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                animation: google.maps.Animation.DROP
            });

            var userMarker = new google.maps.Marker({
                position: {lat:userLat, lng:userLng},
                map: map,
                animation: google.maps.Animation.DROP,
                icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
            });
        }
        
    }
}

// Function to grab user inputs
userSearch = (e) => {
    e.preventDefault();

    city = $('#inputText').val().trim();
    state = $('.statesList option:selected').val();
    renderList();
    $('#inputText').val('');
}

// Event listener for the brewery buttons
$('#listDiv').on('click', '.breweryBtn', function() {
    breweryChosen = $(this).text();
    if ($('#centerdiv').css('display') === 'none') {
        $('#centerdiv').attr('style', 'display:block');
    }
    renderBreweryInfo();
});

// Event listener for the check in button
$('#infoDiv').on('click', '#checkInBtn', function() {
    var breweryName = $(this).attr('data-name');
    if (breweriesVisitedArr.indexOf(breweryName) == -1) {
        breweriesVisitedArr.push(breweryName);
        totalVisitedCounter++;
        localStorage.setItem("checked-in", JSON.stringify(breweriesVisitedArr));
        localStorage.setItem("total-visited", totalVisitedCounter);
        $('#brewery-checkin').text(totalVisitedCounter);
    } 
    displayLists();
});

// Event listener for the favorites button
$('#infoDiv').on('click', '#favoritesBtn', function() {
    var breweryName = $(this).attr('data-name');
    if (favoritesArr.indexOf(breweryName) == -1) {
        favoritesArr.push(breweryName);
        favoritesCounter++;
        if (favoritesCounter >= 2) {
            $('#favorites-text').text('Favorites');
        } else {
            $('#favorites-text').text('Favorite');
        }
        localStorage.setItem("favorite", JSON.stringify(favoritesArr));
        localStorage.setItem("total-favs", favoritesCounter);
        $('#brewery-favorites').text(favoritesCounter);
    } 
    displayLists();
});

// Event listener for the visit later button
$('#infoDiv').on('click', '#visitLaterBtn', function() {
    var breweryName = $(this).attr('data-name');
    if (toVisitArr.indexOf(breweryName) == -1) {
        toVisitArr.push(breweryName);
        visitLaterCounter++
        localStorage.setItem("visit-later", JSON.stringify(toVisitArr));
        localStorage.setItem("total-visit-later", visitLaterCounter);
        $('#brewery-visitLater').text(visitLaterCounter);
    } 
    displayLists();
});

// Event listener for the search button
$('#inputButton').on('click', userSearch);

