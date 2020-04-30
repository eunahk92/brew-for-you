var city = '';
var breweryChosen = '';
var filterArr = [];

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
        console.log(response);
        for (var i = 0; i < response.length; i++) {
            // List available brewery names
            var breweryName = response[i].name;
            console.log(breweryName);
            var breweryLi = `
                <button type="button" class="breweryBtn" data-name="${breweryName}">${breweryName}</button>
            `
            $('#listDiv').append(breweryLi);
        }
    })
}

// Render information about the brewery chosen
renderBreweryInfo = () => {
    // Clear div 
    $('#infoDiv').empty();


}

// Event listener on search button
$('#inputButton').on('click', function(e) {
    e.preventDefault();
    city = $('#inputText').val().trim();
    renderList();
});

// Event listener for a checked filter
$(document).on('click', '.filterBtn', function() {
    var chosenFilter = $(this).sibling.attr('data-filter');
    filterArr.push(chosenFilter);
})

$(document).on('click', '.breweryBtn', function() {
    breweryChosen = $(this).attr('data-name');
});