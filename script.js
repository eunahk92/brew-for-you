var city, breweryChosen, filterArr, breweryArr;

// Render list of nearby breweries
renderList = () => {
    // Clear div if another city is searched
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
            console.log(breweryName);
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
                <h3>${brewery.name}</h3>
                <p>${brewery.street}</p>
                <p>${brewery.city}, ${brewery.state} ${zipcode}</p>
                <p>${brewery.phone}</p>
                <p>Type of brewery: ${brewery.brewery_type}</p>
                <a href="${brewery.website_url}">Click me to view their website</a>
            `
            $('#infoDiv').append(breweryInfo);
            // function initMap that will load map (needs kyle JS updates) and is grabbing lat & long
            // initMap(brewery.latitude, brewery.longitude);
        }
    }
}

// Event listener on search button
$('#inputButton').on('click', function(e) {
    e.preventDefault();
    city = $('#inputText').val().trim();
    renderList();
});

// Event listener for a checked filter
$('#listDiv').on('click', '.filterBtn', function() {
    var chosenFilter = $(this).sibling.attr('data-filter');
    filterArr.push(chosenFilter);
})

// Event listener for the brewery buttons
$('#listDiv').on('click', '.breweryBtn', function() {
    breweryChosen = $(this).text();
    renderBreweryInfo();
});
