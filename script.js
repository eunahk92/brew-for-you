var city, state, breweryChosen, checkedIn, filterArr, breweryArr, breweryDatabaseArr;
var breweryCounter = 0;
var toVisitArr = JSON.parse(localStorage.getItem('visit brewery')) || [];
var breweriesVisitedArr = JSON.parse(localStorage.getItem('check in brewery')) || [];
var apiKey = '07fd8e30-8eae-4f5f-a07d-ad2608235d7d';

// Render list of nearby breweries
renderList = () => {
    $('#listDiv').empty();
    console.log(state);
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
                <button type="button" id="checkInBtn" data-name="${brewery.name}">Check In</button> | 
                <button type="button" id="visitLaterBtn" data-name="${brewery.name}">Visit Later</button> | 
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

// Event listener on search button
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
        localStorage.setItem("check in brewery", JSON.stringify(breweriesVisitedArr));
        breweryCounter++;
    } 
});

// Event listener for the visit later button
$('#infoDiv').on('click', '#visitLaterBtn', function() {
    var breweryName = $(this).attr('data-name');
    if (toVisitArr.indexOf(breweryName) == -1) {
        toVisitArr.push(breweryName);
        localStorage.setItem("visit brewery", JSON.stringify(toVisitArr));
    } 
});

$('#inputButton').on('click', userSearch);

