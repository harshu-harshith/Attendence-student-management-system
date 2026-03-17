function fetchResultsAndScroll() {
    fetchResults();
    setTimeout(() => {
        let contentDiv = document.getElementById("content");
        contentDiv.scrollTop = contentDiv.scrollHeight;
    }, 5);
}

function fillIdLabel() {
    const loggedInUsername = sessionStorage.getItem('loggedInUsername');
    const idLabel = document.getElementById('userIdLabel1');
    idLabel.textContent = loggedInUsername;
}

function fetchResults() {
    const loggedInUserID = sessionStorage.getItem('loggedInUsername');
    const year = document.querySelector('input[name="year"]:checked').value;
    const semester = document.querySelector('input[name="semester"]:checked').value;
    const fileName = `RESULTS ${year}-${semester}.xlsx`;

    fetch(fileName)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch '${fileName}'. Status: ${response.status}`);
            }
            return response.arrayBuffer();
        })
        .then(buffer => {
            const data = new Uint8Array(buffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            const userResults = jsonData.filter(result => result.id === loggedInUserID);

            renderResultsData(userResults);
        })
        .catch(error => {
            console.error('Error fetching or processing data:', error);
            alert(`Error: Unable to read results data from ${fileName} file.`);
        });
}

function renderResultsData(resultsData) {
    const resultsDataDiv = document.getElementById('resultsTable');
    if (!resultsDataDiv) return;

    resultsDataDiv.innerHTML = '';
    resultsDataDiv.style.fontFamily = 'Arial, sans-serif';
    resultsDataDiv.style.fontSize = '14px';
    resultsDataDiv.style.color = '#333';

    if (resultsData.length > 0) {
        resultsData.forEach(result => {
            const table = document.createElement('table');
            table.classList.add('resultsDataTable');

            let headerRow = document.createElement('tr');
            let headerCount = 0;
            let firstColumnSkipped = false;
            let headersAppended = false;
            let summaryKeys = [];
            let summaryValues = [];

            for (const key in result) {
                if (result.hasOwnProperty(key)) {
                    if (!firstColumnSkipped) {
                        firstColumnSkipped = true;
                        continue;
                    }
                    if (key.toUpperCase().startsWith('GRAND') && key.toUpperCase().includes('TOTAL')) {
                        summaryKeys.push(key);
                        summaryValues.push(result[key]);
                        continue;
                    }
                    if (['CGPA', 'SGPA', 'CREDITS', 'RESULT'].includes(key.toUpperCase())) {
                        summaryKeys.push(key);
                        summaryValues.push(result[key]);
                        continue;
                    }
                    let headerCell = document.createElement('th');
                    headerCell.textContent = key;
                    headerRow.appendChild(headerCell);
                    headerCount++;

                    if (headerCount % 6 === 0 && !headersAppended) {
                        table.appendChild(headerRow);
                        headersAppended = true;
                        headerRow = document.createElement('tr');
                    }
                }
            }
            if (headerRow.children.length > 0 && !headersAppended) {
                table.appendChild(headerRow);
                headersAppended = true;
            }

            let rowCount = 0;
            let dataRow;
            let keyCount = 0;
            firstColumnSkipped = false;

            for (const key in result) {
                if (result.hasOwnProperty(key)) {
                    if (!firstColumnSkipped) {
                        firstColumnSkipped = true;
                        continue;
                    }
                    if (key.toUpperCase().startsWith('GRAND') && key.toUpperCase().includes('TOTAL')) {
                        continue;
                    }
                    if (['CGPA', 'SGPA', 'CREDITS', 'RESULT'].includes(key.toUpperCase())) {
                        continue;
                    }
                    if (keyCount % 6 === 0) {
                        dataRow = document.createElement('tr');
                        dataRow.classList.add(rowCount % 2 === 0 ? 'even-row' : 'odd-row');
                    }

                    let dataCell = document.createElement('td');
                    dataCell.textContent = result[key];
                    dataRow.appendChild(dataCell);
                    keyCount++;

                    if (keyCount % 6 === 0) {
                        table.appendChild(dataRow);
                        rowCount++;
                    }
                }
            }

            if (dataRow && dataRow.children.length > 0) {
                table.appendChild(dataRow);
                rowCount++;
            }

            if (summaryKeys.length > 0) {
                let summaryTable = document.createElement('table');
                summaryTable.classList.add('resultsDataTable');
                summaryTable.classList.add('summaryTable');

                let summaryHeaderRow = document.createElement('tr');
                summaryHeaderRow.style.fontWeight = 'bold';

                summaryKeys.forEach(key => {
                    let headerCell = document.createElement('th');
                    headerCell.textContent = key;
                    summaryHeaderRow.appendChild(headerCell);
                });
                summaryTable.appendChild(summaryHeaderRow);

                let summaryDataRow = document.createElement('tr');
                summaryValues.forEach((value, index) => {
                    let dataCell = document.createElement('td');
                    dataCell.textContent = value;
                    summaryDataRow.appendChild(dataCell);
                });
                summaryTable.appendChild(summaryDataRow);

                resultsDataDiv.appendChild(summaryTable);
            }

            resultsDataDiv.appendChild(table);
        });
    } else {
        resultsDataDiv.innerHTML = '<p>No results data found.</p>';
    }
}

fillIdLabel();

