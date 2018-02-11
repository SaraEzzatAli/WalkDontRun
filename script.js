
  var map, infoWindow;
  function initMap() {
    infoWindow = new google.maps.InfoWindow;

    //HTML5 geolocation

    if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            var map = new google.maps.Map(document.getElementById('map'), {   //creating the map (based on the pos declared right above it)
            zoom: 6,
            center: pos
            });
            var marker = new google.maps.Marker({
            position: pos,
            map: map
             });
            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        
        }
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }
<script async defer
src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBo-udUvtY08EoXYY__I2WodwJMX6LBZqM&callback=initMap">
</script>