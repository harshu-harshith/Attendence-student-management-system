function fetchAttendanceData(fileName) {
    const loggedInUserID = sessionStorage.getItem('loggedInUsername'); 

    fetch(fileName)
        .then(response => response.arrayBuffer())
        .then(buffer => {
            const data = new Uint8Array(buffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            const studentData = jsonData.find(row => row.id === loggedInUserID);

            if (studentData) {
                const present = studentData['present'] || 0;
                const late = studentData['late'] || 0;
                const absent = studentData['absent'] || 0;
                const leave = studentData['leave'] || 0;
                const event = studentData['event'] || 0;
                const totalClasses = present + late + absent + leave + event;

                document.getElementById('presentCount').textContent = present;
                document.getElementById('lateCount').textContent = late;
                document.getElementById('absentCount').textContent = absent;
                document.getElementById('leaveCount').textContent = leave;
                document.getElementById('eventCount').textContent = event;
                document.getElementById('totalAttendance').textContent = `${present + late + leave + event}/${totalClasses} Classes`;

                updatePieChart(present, late, absent, leave, event, totalClasses);
            }
        })
        .catch(error => console.error('Error loading Excel file:', error));
}

function updatePieChart(present, late, absent, leave, event, totalClasses) {
    const chart = document.getElementById("attendanceChart");
    const colors = ["#00c851", "#ffbb33", "#ff4444", "#007bff", "#8e44ad"];
    const values = [present, late, absent, leave, event];
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    let svgContent = `<circle cx="100" cy="100" r="${radius}" fill="none" stroke="#e3e3e3" stroke-width="15"></circle>`;

    values.forEach((val, index) => {
        if (val > 0) {
            const strokeValue = (val / totalClasses) * circumference;
            svgContent += `<circle cx="100" cy="100" r="${radius}" fill="none" stroke="${colors[index]}" stroke-width="15"
                stroke-dasharray="${strokeValue} ${circumference}" stroke-dashoffset="-${offset}"
                transform="rotate(-90 100 100)"></circle>`;
            offset += strokeValue;
        }
    });

    chart.innerHTML = `<svg width="200" height="200" viewBox="0 0 200 200">${svgContent}</svg>`;
}

fetchAttendanceData('ATTENDENCE.xlsx');
