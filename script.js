var city, breweryChosen, checkedIn, filterArr, breweryArr, favoritesArr, breweriesVisitedArr;
var apiKey = 'f0f1c2d6933e72fd38132ddbf886630f';

// Render list of nearby breweries
renderList = () => {
    $('#listDiv').empty();

    // Ajax call for breweries nearby
    let queryURL = `https://api.openbrewerydb.org/breweries?by_city=${city}`;
    $.ajax({
        url: queryURL, 
        method: "GET"
    }).then(function(response) {
        breweryArr = response;
        console.log(breweryArr);
        for (var i = 0; i < breweryArr.length; i++) {
            // List available brewery names
            var breweryName = breweryArr[i].name;
            var breweryLi = `
                <button type="button" class="breweryBtn">${breweryName}</button>
            `
            $('#listDiv').append(breweryLi);
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
            var breweryInfo = `
                <h3 id="breweryName">${brewery.name}</h3>
                <p>${brewery.street}</p>
                <p>${brewery.city}, ${brewery.state} ${zipcode}</p>
                <p>${brewery.phone}</p>
                <p>Type of brewery: ${brewery.brewery_type}</p>
                <a href="${brewery.website_url}" target="_blank">Click me to view their website</a><br>
                <button type="button" id="checkInBtn">Check In</button> | <button type="button" id="visitLaterBtn">Visit Later</button>
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
$('#inputButton').on('click', function(e) {
    e.preventDefault();
    city = $('#inputText').val().trim();
    renderList();
    $('#inputText').val('');
});

// Event listener for a checked filter
$('#listDiv').on('click', '.filterBtn', function() {
    var chosenFilter = $(this).sibling.attr('data-filter');
    filterArr.push(chosenFilter);
})

// Event listener for the brewery buttons
$('#listDiv').on('click', '.breweryBtn', function() {
    breweryChosen = $(this).text();
    if ($('#centerdiv').css('display') === 'none') {
        $('#centerdiv').attr('style', 'display:block');
    }
    renderBreweryInfo();
});

// Event listener for the check in button
$('#checkInBtn').on('click', function() {
    var breweryName = $(this).sibling('#breweryName').text();
    console.log(breweryName);
    breweriesVisitedArr.push(breweryName);
    console.log(breweriesVisitedArr);
});

// Event listener for the visit later button
$('#infoDiv').on('click', '.breweryBtn', function() {
    var breweryName = $(this).sibling('#breweryName').text();
    favoritesArr.push(breweryName);
});
