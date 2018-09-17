//API for google maps = AIzaSyB-FEEnkqYHiCzepPgtDMj_0hPfeignmM4

//API for rescue pets = n8EpA93N


const google_maps_url = 'https://maps.googleapis.com/maps/api/js?key=';
const rescue_pets_url = 'http://www.';

//function to access data from the user's search 
function getDataFromApi(searchTerm, callback) {
    const query = {
        part: 'snippet',
        key: 'n8EpA93N',
        q: `${searchTerm} in:name`
    }
    $.getJSON(rescue_pets_url, query, callback);
}

//function to generate the results page
function renderResults(result) {
    return `
    <div class="results">
      <p>Great News! We've matched you with some awesome available pets!</p>
      <button type="button" id="adoptMe">Adopt Me!</button>
      <a href="${result.id}"> 
      <img src="${result}" alt="available pet image">
    </div>`
}

//function that generates the renderResults function when needed to display data
function displayRescueDatat(data) {
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
    getDataFromApi(query, displayYouTubeSearchData);
  });
}


