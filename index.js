const apiKey = 'AIzaSyCPkdxPck9_Ifk7N417g8v3e4DKJQxxFUc';
// const google_maps_url = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
const google_maps_url = `http://maps.googleapis.com/maps/api/geocode/json?address=83%20Decathlon%20Circle%20Sacramento&key=${apiKey}`;
const pet_finder_url = 'https://api.petfinder.com/pet.find';
const pet_finder_shelter_url = 'https://api.petfinder.com/shelter.find';

//function that retrieves the shelter information from the petfinder api
function getShelterData(query) {
    $.ajax({
        url: pet_finder_shelter_url,
        method: 'GET',
        dataType: 'jsonp',
        crossDomain: true,
        data: {
            key: '3fd075241e863aa486d764451a6a094d',
            location: query.zip,
            format: 'json'
        },   
        success: (response) => handleShelterInfo(response)  
    });
}

//function that handles shelter results
function handleShelterInfo(response) {
    if (response) {

    }
    console.log(response.petfinder.shelters.shelter.city);
    response.petfinder.shelters.shelter.forEach((shelter) => {
        
        // findLatLng(response);
        // addShelterToMap(response, location);
        addShelterToList({
            name: shelter.name,
            city: shelter.city,
            longitude: shelter.longitude,
            latitude: shelter.latitude,
        });
        geocodeLatLng(response);
    })
}

//function to add shelter cordinates marker to map --needs to loop through the shelters and put each on the map
// function addShelterToMap(response, location, map) { 
//     response.petfinder.shelters.shelter.forEach((shelter) => {
//         let latlng = {
//             lat = response.petfinder.shelters.shelter.latitude,
//             lng = response.petfinder.shelters.shelter.longitude
//         }
//         // let latlng = findLatLng(response);
//         let marker = new google.maps.Marker({
//             position: latlng,
//             map: map
//         });
//     })    
// }

//function to add shelter to list
function addShelterToList(shelter) {
    let newDiv = document.createElement('div');
    let newName = document.createElement('p');
    let newCity = document.createElement('p');
    let newLat = document.createElement('p');
    let newLong = document.createElement('p');
    
    newName.textContent = shelter.name.$t;
    newCity.textContent = shelter.city.$t;
    newLat.textContent = shelter.latitude.$t;
    newLong.textContent = shelter.longitude.$t;
        
    newDiv.appendChild(newName);
    newDiv.appendChild(newCity);
    newDiv.appendChild(newLat);
    newDiv.appendChild(newLong);

    document.querySelector('#shelter-results').appendChild(newDiv);
}

//function to access Rescue data from the user's search 
function getDataFromPetFinderApi(query) {
    $.ajax({
        url: pet_finder_url,
        method: 'GET',
        dataType: 'jsonp',
        crossDomain: true,
        data: {
            key: '3fd075241e863aa486d764451a6a094d',
            animal: query.typeOfPet,
            location: query.zip,
            output: 'basic',
            format: 'json'
        },
        success: (response) => handlePetsFindResult(response)
    });
}

function handlePetsFindResult(response) {
    response.petfinder.pets && response.petfinder.pets.pet.forEach((pet) => {
        addPetToList({
            id: pet.id.$t,
            name: pet.name.$t,
            img: pet.media.photos && pet.media.photos.photo[0] && pet.media.photos.photo[0].$t,
        });
    });
}

function addPetToList(pet) {
    let newDiv = document.createElement('div');
    let newName = document.createElement('a');

    newName.textContent = pet.name;
    newName.href = 'https://www.petfinder.com/petdetail/' + pet.id;

    if (pet.img) { 
        let newImg = document.createElement('img');
        newImg.src = pet.img;

        newImg.onerror = () => {
            newImg.parentElement.removeChild(newImg);
        };

        newDiv.appendChild(newImg);
    }

    newDiv.appendChild(newName);
    
    document.querySelector('.results').appendChild(newDiv);
}

function resetForm() {
    console.log('TO DO!!! WRITE THIS FUNCTION')
    // let query = queryTarget.value(""); 
}

function resetResultsList() {
    console.log('TODO !!!! WRITE THIS FUNCTION!')
    // document.querySelector('.js-query').value("");
}

//   function that initializes and generates the map 
function initMap() {
    let portland = {
        lat: 45.5122, 
        lng: -122.6587,
    };

    // The map, centered at Portland
    let map = new google.maps.Map(
        document.getElementById("js-map"), 
        {
            zoom: 12, 
            center: portland
        }
    );
    var geocoder = new google.maps.Geocoder;
    var infowindow = new google.maps.InfoWindow;

    document.getElementById('searchButton').addEventListener('click', function() {
        geocodeLatLng(geocoder, map, infowindow);
    });
}   


function geocodeLatLng(response, geocoder, map, infowindow) {
    //need to match the value of latlng from geocode to petfinder value lat lng
    // var input = document.getElementById('latlng').value;
   var latlng = {
       lat: response.petfinder.shelters.shelter.latitude.$t,
       lng: response.petfinder.shelters.shelter.longitude.$t
   }
   var geocoder = new google.maps.Geocoder;

    geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          map.setZoom(11);
             // Place Location Marker
          var marker = new google.maps.Marker({
            position: latlng,
            map: map
          });
          infowindow.setContent(results[0].formatted_address);
          infowindow.open(map, marker);
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

//function that watches for the search now button to be clicked and runs the callback function
function watchSubmit() {
  $('.searchForm').submit(function (event) {
    event.preventDefault();
    
    const query = {
        typeOfPet: event.currentTarget.querySelector('#typeOfPet').value || 'dog',
        zip: event.currentTarget.querySelector('#zip').value || '97217',
    };

    resetResultsList();
    getShelterData(query);
    getDataFromPetFinderApi(query);
    resetForm();
  });
}

$(watchSubmit);

	

