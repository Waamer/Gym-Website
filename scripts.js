let map;
let selectedMarker;
var count = 0;

function generateMap() {
  const radiusInput = document.getElementById("radius-slider").value; // get radius slider value
  initMap(radiusInput);
}

function initMap(radiusInput) { // Initialize and add the map
  
  count = count + 1;
  if (count != 1){ // most lazy fix in the existance of man

    const locationInput = document.getElementById("location-input").value; // get user input div
    
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: locationInput }, function (results, status) {
      
      if (status === "OK") {
        const location = results[0].geometry.location;

        map = new google.maps.Map(document.getElementById("map"), { // The map, centered at location
          zoom: 13,
          center: location,
        });

        var marker = new google.maps.Marker({ // The marker, positioned at location
          map: map,
          position: location,
          icon: {
            url: "images/Marker2.png",
            scaledSize: new google.maps.Size(35, 50), // scaled size
          },
        });

        getGyms(location, radiusInput); // Get gyms near location
      } else {
        alert("Please Input a correct location buddy");
      }
    });
  }
}

function getGyms(loc, radiusInput){ // Get gyms near location
  var request = {  // Create a request object
    location: loc,  
    radius: radiusInput * 1000, // meter to km
    type: ['gym'], 
    keyword: "(weights) OR (cardio machines) OR (fitness) -crossfit -yoga " // Get gyms with weights or cardio machines, but not crossfit or yoga
  
  };
  service = new google.maps.places.PlacesService(map); // Create a PlacesService object
  service.nearbySearch(request, callback) // Perform a nearby search
}

function callback(results, status){ // Handle the response
  if (status == google.maps.places.PlacesServiceStatus.OK) { // If the request was successful
    for (var i = 0; i < results.length; i++){ // Loop through the results
      var place = results[i]; // Get the place details for each result
       
       var photos = place.photos; // Get the photos for each result
       var image = ""; // Create an empty string for the image
       if (photos && photos.length > 0) { // If there is a photo
         image = `<img src="${photos[0].getUrl({maxWidth: 500, maxHeight: 400})}" />`; // Get the photo
       }

       var rating = "" // Create an empty string for the rating
       if(place.rating){rating = "Rating: " + place.rating + " \u272e"} // If there is a rating, get the rating
 
       let content = `${image} 
                      <h1>${place.name}</h1>
                      <h3>${place.vicinity}</h3>
                      <h4>${rating}</h4>
                      `; // Create the content for the info-container

      var marker = new google.maps.Marker({ // Create a marker for each result
        map: map, 
        position: place.geometry.location, // Get the location
        title: place.name, // Get the name
        icon: { // Set the icon
          url: 'images/Marker.png',
          scaledSize: new google.maps.Size(35, 50) // scaled size
        }
      });

      bindThings(marker, content); // Bind the marker to the info-container
      marker.setMap(map); // Set the marker on the map
    }
  }
}

function bindThings(marker, content) { // Bind the marker to the info-container
  marker.addListener("click", function () { // Add a click listener to the marker

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
    const parser = new DOMParser(); // Create a DOMParser object
    const contentHTML = parser.parseFromString(content, "text/html"); // Parse the content as HTML
    
    const textDiv = document.getElementById("info-text"); // Get the info-text div
    const imageDiv = document.getElementById("info-image"); // Get the info-image div
    
    textDiv.innerHTML = ""; // Clear the info-text div
    imageDiv.innerHTML = ""; // Clear the info-image div
    
    textDiv.appendChild(contentHTML.querySelector("h1")); // Add the content to the info-text div
    textDiv.appendChild(contentHTML.querySelector("h3")); 
    textDiv.appendChild(contentHTML.querySelector("h4"));
    imageDiv.appendChild(contentHTML.querySelector("img"));
  });
}