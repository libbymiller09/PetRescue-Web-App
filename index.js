// jshint esversion:6

const apiKey = "";
const google_maps_url = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
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
    // key: "3fd075241e863aa486d764451a6a094d",
    // secret: "7KrsD6YOWB4y5AAbhs95OQaAhkdEJMcPucztPCx7",
    key: "xNAVJboHTN9WuhwsXmZzn7AhACWsherP04AP9UpGJBHogjCgiA",
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

//function that collects the needed results from the petfinder request
function handlePetsFindResult(response) {
  response.petfinder.pets &&
    response.petfinder.pets.pet &&
    response.petfinder.pets.pet.forEach(pet => {
      addPetToList({
        id: pet.id.$t,
        name: pet.name.$t,
        img:
          pet.media.photos &&
          pet.media.photos.photo[2] &&
          pet.media.photos.photo[2].$t,
        shelterId: pet.shelterId.$t,
        breeds: pet.breeds.breed.$t,
        age: pet.age.$t,
        description:
          pet.description &&
          pet.description.$t,
      });
    });
}

//function that creates the results page list of pets
function addPetToList(pet) {
  let newDiv = document.createElement("div");
  let newName = document.createElement("a");
  let newDesc = document.createElement("p");
  let newBreed = document.createElement("p");
  let newAge = document.createElement("p");

  if (pet.description) {
    let text = pet.description.slice(0, 200).trim().concat('...');
    newDesc.textContent = text + "Click my name to see more!";
    newDesc.setAttribute("class", "petDesc");

    newDesc.onerror = () => {
      newDesc.parentElement.removeChild(newDesc);
    };
  }

  newName.textContent = pet.name;
  newName.href = "https://www.petfinder.com/petdetail/" + pet.id;
  newName.setAttribute("id", "adoptButton");

  if (pet.img) {
    let newImg = document.createElement("img");
    newImg.src = pet.img;
    newImg.setAttribute("alt", "Pet image");
    newImg.setAttribute("class", "petImg");

    newImg.onerror = () => {
      newImg.parentElement.removeChild(newImg);
    };

    newDiv.appendChild(newImg);
  }
  newBreed.textContent = pet.breeds;
  newBreed.setAttribute("id", "breed");
  newBreed.setAttribute("class", "petInfo");

  newAge.textContent = pet.age;
  newAge.setAttribute("id", "age");
  newAge.setAttribute("class", "petInfo");


  newDiv.setAttribute("data-shelter-id", pet.shelterId);
  newDiv.setAttribute("class", "pet-results");

  newDiv.appendChild(newDesc);
  newDiv.appendChild(newName);
  newDiv.appendChild(newBreed);
  newDiv.appendChild(newAge);

  document.querySelector(".results").appendChild(newDiv);
}

//function that clears the query from the form
function resetForm() {
  document.querySelector("body").classList.add("search-form-open");
  document.querySelector("#typeOfPet").value = "";
  document.querySelector("#zip").value = "";
}

//function that resets the results list
function resetResultsList() {
  document.querySelector(".results").innerHTML = "";
  document.querySelector("#shelter-results").innerHTML = "";
}

//function that initializes and generates the map
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
}

//function that takes shelter longitude and latitude and puts it into a map marker for each shelter
function addShelterToMap(shelter) {
  let image = {
    url: "pawprint.png",
    scaledSize: new google.maps.Size(30, 30),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 0)
  };

  let marker = new google.maps.Marker({
    position: {
      lat: parseFloat(shelter.latitude),
      lng: parseFloat(shelter.longitude)
    },
    icon: image,
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
  getDataFromPetFinderApi({
    shelterId: shelter.id
  }).then(function() {
    openShelterResults();
  });
}

//function that watches for the search now button to be clicked and runs the callback functions
function watchSubmit() {
  $(".searchForm").submit(function(event) {
    event.preventDefault();

    window.query = {
      typeOfPet: event.currentTarget.querySelector("#typeOfPet").value,
      zip: event.currentTarget.querySelector("#zip").value
    };

    Promise.all([getShelterData(query), getDataFromPetFinderApi(query)]).then(
      function() {
        closeSearchForm();
        openShelterResults();
      }
    );
    resetForm();
    resetResultsList();
  });
}

//function that watches for the different menu navigation buttons to be clicked
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

//function that when clicked opens the search form page
function openSearchForm() {
  document.querySelector("body").classList.add("search-form-open");
}

//function that when clicked closes the search form page and goes back to the map page
function closeSearchForm() {
  document.querySelector("body").classList.remove("search-form-open");
}

//function that when clicked opens the results page
function openShelterResults() {
  document.querySelector("body").classList.add("results-panel-open");
}

//function that when clicked closes the results page and takes the user back to the map page
function closeShelterResults() {
  document.querySelector("body").classList.remove("results-panel-open");
}

//handles both watch functions on the load of the page
$(function() {
  watchSubmit();
  watchMenuButtons();
});
