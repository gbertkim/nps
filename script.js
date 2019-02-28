'use strict'

const apiKey = '37Ny3MbDuL8GqmRGevHvzwxfjCrNkS96Gg8KjPtO'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function getParks(searchTerm, maxResults){
  const params = {
    limit: maxResults,
    api_key: apiKey,
  };
  const queryString = formatQueryParams(params)


  let listStates = searchTerm.map(state => `stateCode=${state}`)
  console.log(listStates);


  const url = searchURL + '?' + listStates.join('&') + '&' + queryString;
  console.log(url);


  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, maxResults))
    .catch(err => {
      $('#errorMessage').text(`Something went wrong: ${err.message}`);
    });
}

function displayResults(responseJson){
  let item = responseJson.total;
  if(item === 0){
    $('#errorMessage').text('Re-check state abbreviations and separate states with single spaces only');
    console.log('hi');
  }
  console.log(responseJson);
  responseJson.data.forEach(function(park){
    $('#parksList').append(`<li class="parkName"><h2>${park.fullName}</h2><p class="parkDescription">${park.description}</p><a class="parkURL" href="${park.url}">${park.url}</a></li>`);
  })
}

function loadForm(){
  $('form').submit(event =>{
    $('#parksList').empty();
    $('#errorMessage').empty();
    event.preventDefault();
    const searchTerm = $('#js-search-term').val().split(" ");
    console.log(searchTerm);
    const maxResults = $('#js-max-results').val()-1;
    getParks(searchTerm, maxResults);
  });
}

loadForm();