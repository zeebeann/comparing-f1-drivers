const driver1Select = document.getElementById('driver1');
const driver2Select = document.getElementById('driver2');
const comparisonDiv = document.getElementById('comparison');

let drivers = [];


async function fetchDrivers() {
  try {
    const res = await fetch('https://f1api.dev/api/current/drivers-championship');
    const data = await res.json();
    drivers = data.drivers_championship; // correct array name from API
  } catch (err) {
    comparisonDiv.innerHTML = '<p style="color:red">Failed to load driver data.</p>';
  }
}

// Find driver by classificationId (from dropdown value)
function getDriverByClassificationId(id) {
  return drivers.find(d => String(d.classificationId) === String(id));
}


function showComparison() {
  const id1 = driver1Select.value;
  const id2 = driver2Select.value;
  const d1 = getDriverByClassificationId(id1);
  const d2 = getDriverByClassificationId(id2);



  // Team gradients by teamId
  const teamGradients = {
    williams: ['#000681', '#1769DB'],
    mercedes: ['#017660', '#05D7B6'],
    alpine: ['#005081', '#00A1E8'],
    ferrari: ['#710006', '#EE1332'],
    haas: ['#4E5052', '#9D9FA2'],
    rb: ['#2345AB', '#6D98FF'],
    aston_martin: ['#00482C', '#239971'],
    audi: ['#a50000', '#1c1c1c'],
    mclaren: ['#873500', '#F47600'],
    red_bull: ['#003282', '#4781D7'],
    // new team for current season
    cadillac: ['#000000', '#666666']
  };

  function driverCard(driver) {
    if (!driver) return '';
    const imgSrc = `images/${driver.driverId.toLowerCase()}.avif`;
    // Get gradient for teamId
    const grad = teamGradients[driver.teamId] || ['#ccc', '#eee'];
    const gradStyle = `background: linear-gradient(-60deg, ${grad[0]}, ${grad[1]});`;
    // Special case for Kimi Antonelli
    let displayName = driver.driver.name;
    let displaySurname = driver.driver.surname;
    if (driver.driverId === 'antonelli') {
      displayName = 'Kimi';
      displaySurname = 'Antonelli';
    }
    return `
      <div class="driver-card card-overlay-container">
        <img src="${imgSrc}" alt="${displayName} ${displaySurname}" class="driver-img-overlay" onerror="this.style.display='none'">
        <div class="driver-card-content" style="${gradStyle}">
          <p class="team-name">${driver.team.teamName}</p>
          <p class="driver-name">${displayName}</p>
          <p class="driver-surname">${displaySurname}</p>
          <p class="driver-number">${driver.driver.number}</p>
          <p class="driver-nationality">${driver.driver.nationality}</p>
          <p class="driver-birthday">${driver.driver.birthday}</p>
          <p class="season-standings">CURRENT<br>STANDINGS</p>
          <p class="driver-position">${driver.position}</p>
          <p class="subheading">PLACE</p>
          <p class="driver-points">${driver.points}</p>
          <p class="subheading">POINTS</p>
          <p class="driver-wins">${driver.wins}</p>
          <p class="subheading">WINS</p>
        </div>
      </div>
    `;
  }

  let html = '<div style="display: flex; justify-content: center; gap: 35px;">';
  html += `<div>${d1 ? driverCard(d1) : '<div class="driver-card"></div>'}</div>`;
  html += `<div>${d2 ? driverCard(d2) : '<div class="driver-card"></div>'}</div>`;
  html += '</div>';
  comparisonDiv.innerHTML = html;
}

driver1Select.addEventListener('change', showComparison);
driver2Select.addEventListener('change', showComparison);

fetchDrivers();
