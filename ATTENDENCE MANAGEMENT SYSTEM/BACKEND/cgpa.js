function fetchCGPAData(fileName) {
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
                const cgpa = parseFloat(studentData['CGPA']) || 0;
                const scoredPercent = cgpa > 10 ? cgpa : (cgpa / 10) * 100;
                const notScoredPercent = 100 - scoredPercent;

                document.getElementById('scoredPercent').textContent = `${scoredPercent.toFixed(2)}%`;
                document.getElementById('notScoredPercent').textContent = `${notScoredPercent.toFixed(2)}%`;
                document.getElementById('cgpaValue').textContent = `CGPA: ${cgpa.toFixed(3)}`;

                drawFullPieChart(scoredPercent, notScoredPercent);
            }
        })
        .catch(error => console.error('Error loading Excel file:', error));
}

function drawFullPieChart(scoredPercent, notScoredPercent) {
    const chart = document.getElementById("cgpaChart");
    const colors = ["#FFC154", "#47B39C"];
    const values = [scoredPercent, notScoredPercent];

    let totalAngle = 0;
    let svgContent = `<circle cx="100" cy="100" r="100" fill="${colors[1]}"></circle>`;

    values.forEach((value, index) => {
        if (index === 0) { 
            const angle = (value / 100) * 360;
            const x = 100 + 100 * Math.cos((totalAngle + angle) * Math.PI / 180);
            const y = 100 + 100 * Math.sin((totalAngle + angle) * Math.PI / 180);
            const largeArc = angle > 180 ? 1 : 0;

            svgContent += `<path d="M100,100 L200,100 A100,100 0 ${largeArc},1 ${x},${y} Z" fill="${colors[0]}"></path>`;
            totalAngle += angle;
        }
    });

    chart.innerHTML = `<svg width="200" height="200" viewBox="0 0 200 200">${svgContent}</svg>`;
}

fetchCGPAData('RESULTS 1-1.xlsx');
