var city, state, breweryChosen, checkedIn, filterArr, breweryArr, breweryDatabaseArr;
var totalVisitedCounter = JSON.parse(localStorage.getItem('total-visited')) || 0;
var breweriesVisitedArr = JSON.parse(localStorage.getItem('checked-in')) || [];
var visitLaterCounter = JSON.parse(localStorage.getItem('total-visit-later')) || 0;
var toVisitArr = JSON.parse(localStorage.getItem('visit-later')) || [];
var favoritesCounter = JSON.parse(localStorage.getItem('total-favs')) || 0;
var favoritesArr = JSON.parse(localStorage.getItem('favorite')) || [];
var apiKey = '07fd8e30-8eae-4f5f-a07d-ad2608235d7d';

// Set local storage counter values on nav bar
renderCount = () => {
    $('#brewery-checkin').text(totalVisitedCounter);
    $('#brewery-visitLater').text(visitLaterCounter);
    $('#brewery-favorites').text(favoritesCounter);
    if (favoritesCounter >= 2) {
        $('#favorites-text').text('Favorites');
    } else {
        $('#favorites-text').text('Favorite');
    }
}
renderCount();

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
            initMap(parseFloat(breweryArr[i].latitude), parseFloat(breweryArr[i].longitude));
        }
    }
}

// Map function. (kyle)
function initMap(lat, lng) {
    var myLatLng = {lat: lat,lng: lng};
    
    var options = {
        zoom:14,
        center:{lat: lat,lng: lng}
    }
    var map = new google.maps.Map(document.getElementById('mapDiv'), options)

    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        animation: google.maps.Animation.DROP
    });

}

// Render more info for breweries
// getBreweryID = () => {
//     var query2Url = "https://cors-anywhere.herokuapp.com/https://api.catalog.beer/brewer/?count=7000";
//     $.ajax({
//         url: query2Url,
//         method: "GET",
//         headers: {
//             "Authorization": "Basic " + btoa("07fd8e30-8eae-4f5f-a07d-ad2608235d7d : ")
//         }
//     }).then(function (response) {
//         breweryDatabaseArr = response.data;
//         console.log(breweryDatabaseArr);
//         for (var y = 0; y < breweryDatabaseArr.length; y++) {
//             for (var x = 0; x < breweryDatabaseArr[y].length; x++) {
//                 if (response.data[y][x].name.includes(breweryChosen)) {
//                     console.log(breweryDatabaseArr[y][x].name)
//                 } else {
//                     console.log('cannot find');
//                 }
//             }
//         }
//     });
// }

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
    // getBreweryID();
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
});

// Event listener for the search button
$('#inputButton').on('click', userSearch);

