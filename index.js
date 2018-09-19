//API for google maps = AIzaSyB-FEEnkqYHiCzepPgtDMj_0hPfeignmM4

//API for rescue pets = n8EpA93N

const google_maps_url = 'https://maps.googleapis.com/maps/api/js?key=';
const pet_finder_url ="http://api.petfinder.com/my.method?key="

//function to access Rescue data from the user's search 
function getDataFromRescueApi(searchTerm, callback) {
    const query = {
      apikey: '3fd075241e863aa486d764451a6a094d',
      q: `${searchTerm} in:name`
    }
    $.getJSON(pet_finder_url, query, callback);
}

// function to access google maps data from user's search
function getDataFromMapsApi(searchTerm, callback) {
  const query = {
    key: 'AIzaSyB-FEEnkqYHiCzepPgtDMj_0hPfeignmM4',
    q: `${searchTerm} in:name`
  }
  $.getJSON(google_maps_url, query, callback);
}

//function to generate the rescue pets portion of the results page
function renderRescueResults(result) {
    return `
    <div class="results">
      <p>Great News! We've matched you with some awesome available pets!</p>
      <button type="button" id="adoptMe">Adopt Me!</button>
      <a href="${n8EpA93N.animals.publicSearch}"> 
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

//function that generates the map data
function displayMapData() {
  let portland = {lat: 45.5122, lng: -122.6587};
  // The map, centered at Portland
  let map = new google.maps.Map(
      document.getElementById('map'), {zoom: 12, center: portland});
  // The marker, positioned at Portland
  let marker = new google.maps.Marker({position: portland, map: map});
  renderMapResults(item);
  $('.js-map').html(results);
}

displayMapData();

//function that watches for the search now button to be clicked and runs the callback function
function watchSubmit() {
  $('.searchForm').submit(function (event) {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    // clear out the input
    queryTarget.val("");
    getDataFromRescueApi(query, displayRescueData);
  });
}

$(watchSubmit);


