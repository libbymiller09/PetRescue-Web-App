//API for google maps = AIzaSyB-FEEnkqYHiCzepPgtDMj_0hPfeignmM4

//API for rescue pets = n8EpA93N

const google_maps_url = 'https://maps.googleapis.com/maps/api/js?key=';
const rescue_pets_url ='https://api.rescuegroups.org/v5/public/animals?start='

//function to access Rescue data from the user's search 
function getDataFromRescueApi(searchTerm, callback) {
    const query = {
      // part: 'snippet',
      apikey: 'n8EpA93N',
      q: `${searchTerm} in:name`
    }
    $.getJSON(rescue_pets_url, query, callback);
}

//function to access google maps data from user's search
function getDataFromMapsApi(searchTerm, callback) {
  const query = {
    part: 'snippet',
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


