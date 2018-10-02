const apiKey = "AIzaSyCPkdxPck9_Ifk7N417g8v3e4DKJQxxFUc";
// const google_maps_url = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
const google_maps_url = `http://maps.googleapis.com/maps/api/geocode/json?address=83%20Decathlon%20Circle%20Sacramento&key=${apiKey}`;
const pet_finder_url = "https://api.petfinder.com/";
const pet_finder_shelter_url = "https://api.petfinder.com/shelter.find";

//function that retrieves the shelter information from the petfinder api
function getShelterData(query) {
  return $.ajax({
    url: pet_finder_shelter_url,
    method: "GET",
    dataType: "jsonp",
    crossDomain: true,
    data: {
      key: "3fd075241e863aa486d764451a6a094d",
      location: query.zip,
      format: "json"
    },
    success: response => handleShelterInfo(response)
  });
}

//function that handles shelter results
function handleShelterInfo(response) {
  if (response) {
  }
  response.petfinder.shelters &&
    response.petfinder.shelters.shelter.forEach(shelter => {
      addShelterToMap({
        latitude: shelter.latitude.$t,
        longitude: shelter.longitude.$t,
        name: shelter.name.$t,
        id: shelter.id.$t
      });
      addShelterToList({
        name: shelter.name,
        city: shelter.city,
        longitude: shelter.longitude,
        latitude: shelter.latitude,
        id: shelter.id
      });
    });
}

//function to add shelter to list
function addShelterToList(shelter) {
  let newDiv = document.createElement("div");
  let newName = document.createElement("p");
  let newCity = document.createElement("p");
  let newLat = document.createElement("p");
  let newLong = document.createElement("p");

  newName.textContent = shelter.name.$t;
  newCity.textContent = shelter.city.$t;
  newLat.textContent = shelter.latitude.$t;
  newLong.textContent = shelter.longitude.$t;

  newDiv.appendChild(newName);
  newDiv.appendChild(newCity);
  newDiv.appendChild(newLat);
  newDiv.appendChild(newLong);

  newDiv.setAttribute("data-shelter-id", shelter.id.$t);

  document.querySelector("#shelter-results").appendChild(newDiv);
}

//function to access Rescue data from the user's search
function getDataFromPetFinderApi(query) {
  const data = {
    key: "3fd075241e863aa486d764451a6a094d",
    output: "basic",
    format: "json"
  };
  let method;

  if (query.shelterId) {
    data.id = query.shelterId;

    method = "shelter.getPets";
  } else {
    data.location = query.zip;
    data.animal = query.typeOfPet;

    method = "pet.find";
  }

  return $.ajax({
    url: pet_finder_url + method,
    method: "GET",
    dataType: "jsonp",
    crossDomain: true,
    data: data,
    success: response => handlePetsFindResult(response)
  });
}

function handlePetsFindResult(response) {
  response.petfinder.pets &&
    response.petfinder.pets.pet &&
    response.petfinder.pets.pet.forEach(pet => {
      addPetToList({
        id: pet.id.$t,
        name: pet.name.$t,
        img:
          pet.media.photos &&
          pet.media.photos.photo[0] &&
          pet.media.photos.photo[0].$t,
        shelterId: pet.shelterId.$t
      });
    });
}

function addPetToList(pet) {
  let newDiv = document.createElement("div");
  let newName = document.createElement("a");

  newName.textContent = pet.name;
  newName.href = "https://www.petfinder.com/petdetail/" + pet.id;

  if (pet.img) {
    let newImg = document.createElement("img");
    newImg.src = pet.img;

    newImg.onerror = () => {
      newImg.parentElement.removeChild(newImg);
    };

    newDiv.appendChild(newImg);
  }
  newDiv.setAttribute("data-shelter-id", pet.shelterId);

  newDiv.appendChild(newName);

  document.querySelector(".results").appendChild(newDiv);
}

function resetForm() {
  console.log("TO DO!!! WRITE THIS FUNCTION");
  // let query = queryTarget.value("");
}

function resetResultsList() {
  document.querySelector(".results").innerHTML = "";
  document.querySelector("#shelter-results").innerHTML = "";
}

//   function that initializes and generates the map
function initMap() {
  let portland = {
    lat: 45.5122,
    lng: -122.6587
  };

  // The map, centered at Portland
  window.map = new google.maps.Map(document.getElementById("js-map"), {
    zoom: 12,
    center: portland
  });

  // window.geocoder = new google.maps.Geocoder;
  // window.infowindow = new google.maps.InfoWindow;

  // document.getElementById('searchButton').addEventListener('click', function() {
  //     geocodeLatLng(geocoder, map, infowindow);
  // });
}

//function that matches latitude and longitude from petfinder api to geocode maps api and places a marker on the map
function addShelterToMap(shelter) {
  var marker = new google.maps.Marker({
    position: {
      lat: parseFloat(shelter.latitude),
      lng: parseFloat(shelter.longitude)
    }
  });

  marker.setMap(map);

  const infowindow = new google.maps.InfoWindow();

  infowindow.setContent(shelter.name);
  infowindow.open(map, marker);

  marker.addListener("click", function(event) {
    highlightAnimalsInShelter(shelter);
  });
}

function highlightAnimalsInShelter(shelter) {
  document
    .querySelectorAll("[data-shelter-id]")
    .forEach(function(shelterElement) {
      if (shelterElement.getAttribute("data-shelter-id") !== shelter.id) {
        shelterElement.classList.add("darken");
      } else {
        shelterElement.classList.remove("darken");
      }
    });

  resetResultsList();
  getDataFromPetFinderApi({
    shelterId: shelter.id
  }).then(function() {
    openShelterResults();
  });
}

//function that watches for the search now button to be clicked and runs the callback function
function watchSubmit() {
  $(".searchForm").submit(function(event) {
    event.preventDefault();

    window.query = {
      typeOfPet: event.currentTarget.querySelector("#typeOfPet").value || "dog",
      zip: event.currentTarget.querySelector("#zip").value || "97217"
    };

    resetResultsList();

    Promise.all([getShelterData(query), getDataFromPetFinderApi(query)]).then(
      function() {
        closeSearchForm();
        openShelterResults();
      }
    );
    resetForm();
  });
}

function watchMenuButtons() {
  document
    .querySelector(".open-search-form-button")
    .addEventListener("click", function() {
      openSearchForm();
    });

  document
    .querySelector(".close-search-form-button")
    .addEventListener("click", function() {
      closeSearchForm();
    });

  document
    .querySelector(".open-results-panel-button")
    .addEventListener("click", function() {
      openShelterResults();
    });

  document
    .querySelector(".close-results-panel-button")
    .addEventListener("click", function() {
      closeShelterResults();
    });
}

function openSearchForm() {
  document.querySelector("body").classList.add("search-form-open");
}

function closeSearchForm() {
  document.querySelector("body").classList.remove("search-form-open");
}

function openShelterResults() {
  document.querySelector("body").classList.add("results-panel-open");
}

function closeShelterResults() {
  document.querySelector("body").classList.remove("results-panel-open");
}

$(function() {
  watchSubmit();
  watchMenuButtons();
});
