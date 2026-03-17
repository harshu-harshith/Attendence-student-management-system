function displayUserProfile() {
    const loggedInUsername = sessionStorage.getItem('loggedInUsername');
    if (loggedInUsername) {
        fetch('STUDENTS_DATA.xlsx')
            .then(response => response.arrayBuffer())
            .then(buffer => {
                const data = new Uint8Array(buffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet);
                const userProfile = jsonData.find(user => user.id === loggedInUsername);
                renderUserProfile(userProfile);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error: Unable to read user data from Excel.');
            });
    } else {
        alert('Error: User not logged in.');
    }
}

function renderUserProfile(userProfile) {
    const profileDataDiv = document.getElementById('profileData');
    profileDataDiv.innerHTML = '';

    if (userProfile) {
        const keys = Object.keys(userProfile);
        const values = Object.values(userProfile);
        
        const tableContainer = document.createElement('div');
        tableContainer.style.display = 'flex';
        tableContainer.style.gap = '20px';

        const table1 = createTable(keys.slice(0, 2), values.slice(0, 2));
        const table2 = createTable(keys.slice(2, 4), values.slice(2, 4));
        const table3 = createTable(keys.slice(4, 6), values.slice(4, 6));
        const table4 = createTable(keys.slice(6, 8), values.slice(6, 8));
        
        tableContainer.appendChild(table1);
        tableContainer.appendChild(table2);
        tableContainer.appendChild(table3);
        tableContainer.appendChild(table4);
        
        profileDataDiv.appendChild(tableContainer);
    } else {
        const noDataElement = document.createElement('p');
        noDataElement.textContent = 'User data not found.';
        noDataElement.style.color = 'red';
        profileDataDiv.appendChild(noDataElement);
    }
}

function createTable(keys, values) {
    const table = document.createElement('table');
    table.classList.add('userProfileTable');
    table.style.border = '1px solid black';

    for (let i = 0; i < keys.length; i++) {
        const row = document.createElement('tr');

        const keyCell = document.createElement('td');
        keyCell.textContent = keys[i];
        keyCell.style.fontWeight = 'bold';
        keyCell.style.fontSize = '18px';
        row.appendChild(keyCell);

        const valueCell = document.createElement('td');
        valueCell.textContent = values[i];
        valueCell.style.fontSize = '18px';
        row.appendChild(valueCell);

        table.appendChild(row);
    }

    return table;
}

displayUserProfile();
