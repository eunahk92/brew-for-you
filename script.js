var city = '';
var filterArr = [];

// Render list of nearby breweries
renderList = () => {
    let queryURL = `https://api.openbrewerydb.org/breweries?by_city=${city}`;

    $.ajax({
        url: queryURL, 
        method: "GET"
    }).then(function(response) {
        console.log(response);
        console.log(queryURL);
        for (var i = 0; i < response.length; i++) {
            var options = `
                <p>${response[i].name}</p>
            `
            $('#listDiv').append(options);
        }
    })
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