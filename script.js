var city, state, breweryChosen, checkedIn, filterArr, breweryArr, breweryDatabaseArr;
var breweriesVisitedArr = JSON.parse(localStorage.getItem('checked-in')) || [];
var toVisitArr = JSON.parse(localStorage.getItem('visit-later')) || [];
var favoritesArr = JSON.parse(localStorage.getItem('favorites')) || [];
// var apiKey = '07fd8e30-8eae-4f5f-a07d-ad2608235d7d';
var googleAPIKey = 'AIzaSyCVSbsCoys4-y9UHlX6z93OzyWKnOgnTGw';
var userLat, userLng;

// Set local storage data counter data to the page
renderCounts = () => {
    $('#brewery-checkin').text(breweriesVisitedArr.length);
    $('#brewery-visitLater').text(toVisitArr.length);
    $('#brewery-favorites').text(favoritesArr.length);
    if (favoritesArr.length >= 2) {
        $('#favorites-text').text('Favorites');
    } else {
        $('#favorites-text').text('Favorite');
    }
}
renderCounts();

// Set local storage data for respective breweries list
displayLists = () => {
    $('#checkedInBreweryList, #favoritedBreweryList, #futureBreweryList').empty();
    for (var c = 0; c < breweriesVisitedArr.length; c++) {
        var beerIcon = `<i class="fas fa-beer fa-1x uk-margin-small-right"></i>`;
        var theVisitedList = `${beerIcon} ${breweriesVisitedArr[c]}<br>`;
        $('#checkedInBreweryList').append(theVisitedList);
    }
    for (var d = 0; d < favoritesArr.length; d++) {
        var thumbsUpIcon = `<i class="far fa-thumbs-up fa-1x uk-margin-small-right"></i>`;
        var deleteIcon = `<i class="fas fa-times uk-align-right" id="deleteItem" data-index="${d}"></i>`;
        var theFavList = `${thumbsUpIcon} ${favoritesArr[d]} ${deleteIcon}<br>`;
        $('#favoritedBreweryList').append(theFavList);
    }
    for (var e = 0; e < toVisitArr.length; e++) {
        var pinIcon = `<i class="fas fa-map-pin fa-1x uk-margin-small-right"></i>`;
        var checkIcon = `<i class="fas fa-check" id="checkOff" data-index="${e}"></i>`;
        var theVisitLaterList = `${pinIcon} ${toVisitArr[e]} ${checkIcon}<br>`;
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
                <button type="button" class="breweryBtn uk-width-1-1 uk-button uk-button-text uk-margin-small-top">${breweryName}</button>
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
                <button type="button" class="uk-button uk-button-default uk-button-small" id="checkInBtn" data-name="${brewery.name}">Check-in</button> |  
                <button type="button" class="uk-button uk-button-default uk-button-small" id="favoritesBtn" data-name="${brewery.name}">Favorite</button> | 
                <button type="button" class="uk-button uk-button-default uk-button-small" id="visitLaterBtn" data-name="${brewery.name}">Save For Later</button> 
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
    $('#inputText').val('');
    $('.statesList option[selected]').prop('selected', true);
    renderList();
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
        localStorage.setItem("checked-in", JSON.stringify(breweriesVisitedArr));
        localStorage.setItem("total-visited", breweriesVisitedArr.length);
        $('#brewery-checkin').text(breweriesVisitedArr.length);
    } 
    displayLists();
});

// Event listener for the favorites button
$('#infoDiv').on('click', '#favoritesBtn', function() {
    var breweryName = $(this).attr('data-name');
    if (favoritesArr.indexOf(breweryName) == -1) {
        favoritesArr.push(breweryName);
        if (favoritesArr.length >= 2) {
            $('#favorites-text').text('Favorites');
        } else {
            $('#favorites-text').text('Favorite');
        }
        localStorage.setItem("favorites", JSON.stringify(favoritesArr));
        localStorage.setItem("total-favs", favoritesArr.length);
        $('#brewery-favorites').text(favoritesArr.length);
    } 
    displayLists();
});

// Event listener for delete favorites item buttons
$('#favoritedBreweryList').on('click', '#deleteItem', function() {
    var breweryIndex = $(this).attr('data-index');
    favoritesArr.splice(breweryIndex, 1);
    localStorage.setItem("favorites", JSON.stringify(favoritesArr));
    localStorage.setItem("total-favs", favoritesArr.length);
    displayLists();
    renderCounts();
})

// Event listener for the visit later button
$('#infoDiv').on('click', '#visitLaterBtn', function() {
    var breweryName = $(this).attr('data-name');
    if (toVisitArr.indexOf(breweryName) == -1) {
        toVisitArr.push(breweryName);
        localStorage.setItem("visit-later", JSON.stringify(toVisitArr));
        localStorage.setItem("total-visit-later", toVisitArr.length);
        $('#brewery-visitLater').text(toVisitArr.length);
    } 
    displayLists();
});

// Event listener for visit later delete buttons
$('#futureBreweryList').on('click', '#checkOff', function() {
    var breweryIndex = $(this).attr('data-index');
    toVisitArr.splice(breweryIndex, 1);
    localStorage.setItem("visit-later", JSON.stringify(toVisitArr));
    localStorage.setItem("total-visit-later", toVisitArr.length);
    displayLists();
    renderCounts();
})

// Event listener for the search button
$('#inputButton').on('click', userSearch);