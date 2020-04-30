function initMap() {
    var options = {
        zoom:5,
        center:{lat:28.5383,lng:-81.3792}
    }
    var map = new google.maps.Map(
        document.getElementById('mapDiv'), options)
}