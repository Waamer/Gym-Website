let map;
let selectedMarker;

function initMap(){
  
  navigator.geolocation.getCurrentPosition(function(pos){
    let location = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    }

    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: location,
    });

    var marker = new google.maps.Marker({
      map: map,
      position: location,
      icon: {
        url: 'images/Marker2.png',
        scaledSize: new google.maps.Size(35, 50)
      }
    });

    getGyms(location)

  });

}

function getGyms(loc){
  var request = {
    location: loc,
    radius: '5000',
    type: ['gym'],
    keyword: "(weight room) OR (cardio machines)"
  };
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback)
}

function callback(results, status){
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++){
      var place = results[i];
       
       var photos = place.photos;
       var image = "";
       if (photos && photos.length > 0) {
         image = `<img src="${photos[0].getUrl({maxWidth: 500, maxHeight: 400})}" />`;
       }

       var rating = ""
       if(place.rating){rating = "Rating: " + place.rating + " \u272e"}
 
       let content = `${image}
                      <h1>${place.name}</h1>
                      <h3>${place.vicinity}</h3>
                      <h4>${rating}</h4>
                      `;

      var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        title: place.name,
        icon: {
          url: 'images/Marker.png',
          scaledSize: new google.maps.Size(35, 50)
        }
      });

      bindThings(marker, content);
      marker.setMap(map);
    }
  }
}

function bindThings(marker, content) {
  marker.addListener("click", function () {

       // Reset previously selected marker
       if (selectedMarker) {
        selectedMarker.setIcon({
          url: 'images/Marker.png',
          scaledSize: new google.maps.Size(35, 50)
        });
      }
  
      // Enlarge clicked marker icon
      marker.setIcon({
        url: 'images/Marker.png',
        scaledSize: new google.maps.Size(50, 70)
      });
  
      // Update selected marker
      selectedMarker = marker;
    
    // Update the info-container with the new content
    const parser = new DOMParser();
    const contentHTML = parser.parseFromString(content, "text/html");
    
    const textDiv = document.getElementById("info-text");
    const imageDiv = document.getElementById("info-image");
    
    textDiv.innerHTML = "";
    imageDiv.innerHTML = "";
    
    textDiv.appendChild(contentHTML.querySelector("h1"));
    textDiv.appendChild(contentHTML.querySelector("h3"));
    textDiv.appendChild(contentHTML.querySelector("h4"));
    imageDiv.appendChild(contentHTML.querySelector("img"));
  });
}