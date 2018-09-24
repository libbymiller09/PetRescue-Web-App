//API for google maps = AIzaSyB-FEEnkqYHiCzepPgtDMj_0hPfeignmM4

const google_maps_url = 'https://maps.googleapis.com/maps/api/js?key=';
const pet_finder_url ="https://api.petfinder.com/getRandom?key="

//function to access Rescue data from the user's search 
function getDataFromRescueApi() {
    document.getElementById('.js-form').submit(function(event) {
        event.preventDefault();
        let apikey = '3fd075241e863aa486d764451a6a094d';
        let typeOfPet = document.getElementById('typeOfPet').value;
        let location = document.getElementById('location').value; 
        let zip = document.getElementById('zip').value;
        let url = pet_finder_url;

        $.ajax({
            url: url,
            jsonp: "callback",
            dataType: jsonp,
            data: {
                key: apikey,
                animal: typeOfPet,
                'location': zip,
                output: 'basic',
                format: 'json'
            },
            success: function(response) {
                console.log(response);
                let petName = response.petfinder.pet.name.$t;
                let img = response.petfinder.pet.media.photos.photo[0].$t;
                let id = response.petfinder.pet.id.$t;

                let newName = document.createElement('a');
                let newDiv = document.createElement('div');

                newName.textContent = petName;
                newName.href = 'https://www.petfinder.com/petdetail/' + id;

                let newImg = document.createElement('img');
                newImg.src = img;

                let list = document.createElement("div");
                list.setAttribute("id", "List");
                document.body.appendChild(list);

                newDiv.appendChild(newName);
                list.appendChild(newDiv);
                list.appendChild(newImg);
            }
        });
    })


//   function that initializes and generates the map 
function initMap() {
  let portland = {lat: 45.5122, lng: -122.6587};
  // The map, centered at Portland
  let map = new google.maps.Map(
      document.getElementById("#js-map"), {zoom: 12, center: portland});
  // The marker, positioned at Portland
  let marker = new google.maps.Marker({position: portland, map: map});
  renderMapResults(item);
  $('.js-map').html(results);
}

//function to generate the rescue pets portion of the results page
function renderRescueResults(result) {
    return `
    <div class="results">
      <p>Great News! We've matched you with some awesome available pets!</p>
      <button type="button" id="adoptMe">Adopt Me!</button>
      <a href="${result}"> 
      <img src="${result}" alt="available pet image">
    </div>`
}

//function to generate google maps from results
function renderMapResults(result) {
  return `
  <div class="map">
    <img src="${result}">
  </div>`
}

//function that generates the renderResults function when needed to display data
function displayRescueData(data) {
  const results = data.items.map((item, index) => renderResults(item));
  $('.js-results').html(results);
}

//function that watches for the search now button to be clicked and runs the callback function
function watchSubmit() {
  $('.searchForm').submit(function (event) {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    // clear out the input
    queryTarget.val("");
    getDataFromRescueApi(query, displayRescueData);
    initMap();
  });
}

$(watchSubmit);