function setUserId() {
    const loggedInUsername = sessionStorage.getItem('loggedInUsername');
    const userIdLabel = document.getElementById('userIdLabel2');
    if (loggedInUsername) {
        userIdLabel.textContent = loggedInUsername;
    } else {
        userIdLabel.textContent = 'User not logged in';
    }
}
setUserId();

function fetchData(fileName, columnName, elementId, isPercentage = false, isProgressCircle = false) {
    const loggedInUserID = sessionStorage.getItem('loggedInUsername');

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

            const userData = jsonData.find(row => row.id === loggedInUserID);
            if (userData && userData[columnName] !== undefined) {
                let value = userData[columnName];

                if (isPercentage) value += '%';
                if (isProgressCircle) updateProgressCircle(elementId, value);

                document.getElementById(elementId).textContent = value;
            } else {
                document.getElementById(elementId).textContent = 'No Data Available';
            }
        })
        .catch(error => {
            console.error(`Error fetching data from ${fileName}:`, error);
            document.getElementById(elementId).textContent = 'Error Loading Data';
        });
}

function updateProgressCircle(elementId, value) {
    const progressContainer = document.getElementById(elementId);
    progressContainer.innerHTML = `
        <div class="progress-circle">
            <div class="progress-inner">${value}</div>
        </div>
    `;
}

fetchData('ASSIGMENT_VALUE.xlsx', 'SUBMITTED', 'assignmentValue');
fetchData('ATTENDENCE.xlsx', 'total_percentage', 'attendanceValue', true, true);
fetchData('PROJECT_DATA.xlsx', 'completed', 'projectValue');
fetchData('RESULTS 1-1.xlsx', 'CGPA', 'cgpaValue');

