function fetchAttendanceAndScroll() {
    fetchAttendance();
    setTimeout(() => {
        let contentDiv = document.getElementById("content");
        contentDiv.scrollTop = contentDiv.scrollHeight;
    }, 5);
}

function fillIdLabel() {
    const loggedInUsername = sessionStorage.getItem('loggedInUsername');
    const idLabel = document.getElementById('userIdLabel23');
    idLabel.textContent = loggedInUsername;
}

function fetchAttendance() {
    const loggedInUserID = sessionStorage.getItem('loggedInUsername');
    const year = document.querySelector('input[name="year"]:checked').value;
    const semester = document.querySelector('input[name="semester"]:checked').value;
    const fileName = `ATTENDANCE${year}-${semester}.xlsx`;

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
            const userAttendance = jsonData.filter(entry => entry.id === loggedInUserID);

            renderAttendanceData(userAttendance);
        })
        .catch(error => {
            console.error('Error fetching or processing data:', error);
            alert(`Error: Unable to read attendance data from ${fileName} file.`);
        });
}

function renderAttendanceData(attendanceData) {
    const attendanceTableDiv = document.getElementById('attendanceTable');
    if (!attendanceTableDiv) return;

    attendanceTableDiv.innerHTML = '';
    attendanceTableDiv.style.fontFamily = 'Arial, sans-serif';
    attendanceTableDiv.style.fontSize = '14px';
    attendanceTableDiv.style.color = '#333';

    if (attendanceData.length > 0) {
        attendanceData.forEach(record => {
            const table = document.createElement('table');
            table.classList.add('attendanceDataTable');

            let headerRow = document.createElement('tr');
            let headerCount = 0;
            let firstColumnSkipped = false;
            let headersAppended = false;
            let summaryValues = [];

            for (const key in record) {
                if (record.hasOwnProperty(key)) {
                    if (!firstColumnSkipped) {
                        firstColumnSkipped = true;
                        continue;
                    }
                    if (['TOTAL CLASSES', 'TOTAL ATTENDED', 'TOTAL PERCENTAGE'].includes(key.toUpperCase())) {
                        summaryValues.push(record[key]);
                        continue;
                    }
                    let headerCell = document.createElement('th');
                    headerCell.textContent = key;
                    headerRow.appendChild(headerCell);
                    headerCount++;

                    if (headerCount % 5 === 0 && !headersAppended) {
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

            for (const key in record) {
                if (record.hasOwnProperty(key)) {
                    if (!firstColumnSkipped) {
                        firstColumnSkipped = true;
                        continue;
                    }
                    if (['TOTAL CLASSES', 'TOTAL ATTENDED', 'TOTAL PERCENTAGE'].includes(key.toUpperCase())) {
                        continue;
                    }
                    if (keyCount % 5 === 0) {
                        dataRow = document.createElement('tr');
                        dataRow.classList.add(rowCount % 2 === 0 ? 'even-row' : 'odd-row');
                    }

                    let dataCell = document.createElement('td');
                    dataCell.textContent = record[key];
                    dataRow.appendChild(dataCell);
                    keyCount++;

                    if (keyCount % 5 === 0) {
                        table.appendChild(dataRow);
                        rowCount++;
                    }
                }
            }

            if (dataRow && dataRow.children.length > 0) {
                table.appendChild(dataRow);
                rowCount++;
            }

            if (summaryValues.length === 3) {
                let summaryTable = document.createElement('table');
                summaryTable.classList.add('attendanceSummaryTable');

                let summaryHeaderRow = document.createElement('tr');
                summaryHeaderRow.style.fontWeight = 'bold';

                ['TOTAL CLASSES', 'TOTAL ATTENDED', 'TOTAL PERCENTAGE'].forEach(header => {
                    let headerCell = document.createElement('th');
                    headerCell.textContent = header;
                    summaryHeaderRow.appendChild(headerCell);
                });
                summaryTable.appendChild(summaryHeaderRow);

                let summaryDataRow = document.createElement('tr');
                summaryValues.forEach(value => {
                    let dataCell = document.createElement('td');
                    dataCell.textContent = value;
                    summaryDataRow.appendChild(dataCell);
                });
                summaryTable.appendChild(summaryDataRow);

                attendanceTableDiv.appendChild(summaryTable);
            }

            attendanceTableDiv.appendChild(table);
        });
    } else {
        attendanceTableDiv.innerHTML = '<p>No attendance data found.</p>';
    }
}

fillIdLabel();
