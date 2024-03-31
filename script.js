let planets = document.getElementById('planets');
let details = document.getElementById('details');
let searchInput = document.getElementById('searchInput');
let allPlanets = [];
let timeout = null;

const planetImages = {
  'Tatooine': 'https://static.wikia.nocookie.net/ptstarwars/images/8/82/Tatooine-TOR.jpg',
  'Alderaan': 'https://static.wikia.nocookie.net/ptstarwars/images/a/a9/Alderaan_2.jpg',
  'Yavin IV': 'https://static.wikia.nocookie.net/starwars/images/d/d4/Yavin-4-SWCT.png',
  'Hoth': 'https://static.wikia.nocookie.net/starwars/images/1/1d/Hoth_SWCT.png',
  'Dagobah': 'https://static.wikia.nocookie.net/star-wars-the-force-unleashed/images/4/48/Dagobah_ep3.jpg/revision/latest?cb=20121222195237&path-prefix=pt-br',
  'Bespin': 'https://static.wikia.nocookie.net/starwars/images/2/2c/Bespin_EotECR.png',
  'Endor': 'https://static.wikia.nocookie.net/starwars/images/5/50/Endor_FFGRebellion.png',
  'Naboo': 'https://static.wikia.nocookie.net/starwars/images/f/f0/Naboo_planet.png',
  'Coruscant': 'https://static.wikia.nocookie.net/ptstarwars/images/1/17/Coruscant-AoTCW.jpg',
  'Kamino': 'https://static.wikia.nocookie.net/starwars/images/a/a9/Eaw_Kamino.jpg'
};

async function fetchPlanets(){
  let res = await fetch('https://swapi.dev/api/planets/?format=json');
  let {results} = await res.json();
  console.log(results);
  allPlanets = results;
  planetButtons(allPlanets);

  if (allPlanets.length > 0) {
    displayDetails(allPlanets[0]);
  }
}

function planetButtons(planetList){
  planetList.forEach(planet => {
    let button = document.createElement('button');
    button.textContent = planet.name;
    button.addEventListener('click', () => displayDetails(planet));
    planets.appendChild(button);
  });
}

async function fetchResidentDetails(urls) {
  let residentsDetails = await Promise.all(
    urls.map(url =>
      fetch(url + '?format=json').then(res => res.json())
    )
  );
  return residentsDetails;
}

async function displayDetails(planet) {
  let imageUrl = planetImages[planet.name] || '';

  let detailsHTML = `<div class="details-container">
                       <div class="details-text">
                         <h2>${planet.name}</h2>
                         <p>Clima: ${planet.climate}</p>
                         <p>População: ${planet.population}</p>
                         <p>Terreno: ${planet.terrain}</p>
                       </div>
                       <div class="planet-image" style="background-image: url('${imageUrl}');"></div>
                     </div>`;

  if (planet.residents.length > 0) {
    let residentsDetails = await fetchResidentDetails(planet.residents);
    let residentsHTML = '<h3>Habitantes Famosos</h3><table><tr><th>Nome</th><th>Data de Nascimento</th></tr>';
    residentsDetails.forEach(resident => {
      residentsHTML += `<tr><td>${resident.name}</td><td>${resident.birth_year}</td></tr>`;
    });
    residentsHTML += '</table>';
    detailsHTML += residentsHTML;
  } else {
    detailsHTML += '<p>Não há habitantes famosos.</p>';
  }

  details.innerHTML = detailsHTML;
}

async function searchPlanet(searchText) {
  if (searchText.length === 0) {
    details.innerHTML = '';
    return;
  }
  let res = await fetch(`https://swapi.dev/api/planets/?search=${searchText}&format=json`);
  let {results} = await res.json();
  if (results.length > 0) {
    displayDetails(results[0]);
  } else {
    details.innerHTML = '<p>Planeta não encontrado.</p>';
  }
}

searchInput.addEventListener('input', () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    searchPlanet(searchInput.value);
  }, 500);
});

fetchPlanets();