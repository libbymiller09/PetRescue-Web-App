//API for google maps = AIzaSyB-FEEnkqYHiCzepPgtDMj_0hPfeignmM4

const google_maps_url = 'https://maps.googleapis.com/maps/api/js?key=';
const pet_finder_url = 'https://api.petfinder.com/pet.find';

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
}

function resetResultsList() {
    console.log('TODO !!!! WRITE THIS BAD BOY!')
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

    // The marker, positioned at Portland
    let marker = new google.maps.Marker({
        position: portland, 
        map: map,
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
    getDataFromPetFinderApi(query);
    resetForm();
  });
}

$(watchSubmit);