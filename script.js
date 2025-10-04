// Fetch driver standings and populate dropdowns
const driver1Select = document.getElementById('driver1');
const driver2Select = document.getElementById('driver2');
const comparisonDiv = document.getElementById('comparison');

let drivers = [];

async function fetchDrivers() {
	try {
		const res = await fetch('https://f1api.dev/api/current/drivers-championship');
		const data = await res.json();
		drivers = data.standings;
		populateDropdown(driver1Select, drivers);
		populateDropdown(driver2Select, drivers);
	} catch (err) {
		comparisonDiv.innerHTML = '<p style="color:red">Failed to load driver data.</p>';
	}
}

function populateDropdown(select, drivers) {
	drivers.forEach(driver => {
		const option = document.createElement('option');
		option.value = driver.driver.code;
		option.textContent = `${driver.driver.givenName} ${driver.driver.familyName}`;
		select.appendChild(option);
	});
}

function getDriverByCode(code) {
	return drivers.find(d => d.driver.code === code);
}

function showComparison() {
	const code1 = driver1Select.value;
	const code2 = driver2Select.value;
	const d1 = getDriverByCode(code1);
	const d2 = getDriverByCode(code2);

	if (!d1 && !d2) {
		comparisonDiv.innerHTML = '';
		return;
	}

	let html = '<div class="comparison-table">';
	html += '<table><thead><tr><th>Stat</th>';
	if (d1) html += `<th>${d1.driver.givenName} ${d1.driver.familyName}</th>`;
	if (d2) html += `<th>${d2.driver.givenName} ${d2.driver.familyName}</th>`;
	html += '</tr></thead><tbody>';

	const stats = [
		{ label: 'Position', key: 'position' },
		{ label: 'Points', key: 'points' },
		{ label: 'Wins', key: 'wins' },
		{ label: 'Nationality', key: 'nationality', driver: true },
		{ label: 'Team', key: 'constructor', driver: false }
	];

	stats.forEach(stat => {
		html += `<tr><td>${stat.label}</td>`;
		if (d1) {
			if (stat.key === 'constructor') {
				html += `<td>${d1.constructors[0]?.name || ''}</td>`;
			} else if (stat.driver) {
				html += `<td>${d1.driver[stat.key]}</td>`;
			} else {
				html += `<td>${d1[stat.key]}</td>`;
			}
		}
		if (d2) {
			if (stat.key === 'constructor') {
				html += `<td>${d2.constructors[0]?.name || ''}</td>`;
			} else if (stat.driver) {
				html += `<td>${d2.driver[stat.key]}</td>`;
			} else {
				html += `<td>${d2[stat.key]}</td>`;
			}
		}
		html += '</tr>';
	});

	html += '</tbody></table></div>';
	comparisonDiv.innerHTML = html;
}

driver1Select.addEventListener('change', showComparison);
driver2Select.addEventListener('change', showComparison);

fetchDrivers();
