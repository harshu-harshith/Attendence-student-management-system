const notesData = {
    "1": {
        "1": [
            { name: "Programming for Problem Solving", link: "notes/1_1_Programming_for_Problem_Solving.pdf" },
            { name: "Engineering Chemistry", link: "notes/1_1_Engineering_Chemistry.pdf" },
            { name: "Matrices and Calculus (M1)", link: "notes/1_1_Matrices_and_Calculus.pdf" },
            { name: "Basic Electrical Engineering", link: "notes/1_1_Basic_Electrical_Engineering.pdf" }
        ],
        "2": [
            { name: "Physics", link: "notes/1_2_Physics.pdf" }
        ]
    },
    "2": {
        "1": [
            { name: "Object Oriented Programming Through JAVA", link: "notes/2_1_Object_Oriented_Programming_Through_JAVA.pdf" },
            { name: "Operating System", link: "notes/2_1_Operating_System.pdf" },
            { name: "Database Management System", link: "notes/2_1_Database_Management_System.pdf" },
            { name: "Computer Oriented Statistical Methods", link: "notes/2_1_Computer_Oriented_Statistical_Methods.pdf" }
        ],
        "2": [
            { name: "Data Structures", link: "notes/2_2_Data_Structures.pdf" },
            { name: "Software Engineering", link: "notes/2_2_Software_Engineering.pdf" },
            { name: "Discrete Maths", link: "notes/2_2_Discrete_Maths.pdf" },
            { name: "Computer Oriented Architecture", link: "notes/2_2_Computer_Oriented_Architecture.pdf" }
        ]
    },
    "3": {
        "1": [
            { name: "Computer Networks", link: "notes/3_1_Computer_Networks.pdf" },
            { name: "Software Testing", link: "notes/3_1_Software_Testing.pdf" },
            { name: "Web Technologies", link: "notes/3_1_Web_Technologies.pdf" },
            { name: "Artificial Intelligence", link: "notes/3_1_Artificial_Intelligence.pdf" }
        ],
        "2": [
            { name: "Machine Learning", link: "notes/3_2_Machine_Learning.pdf" },
            { name: "Web Technologies", link: "notes/3_2_Web_Technologies.pdf" },
            { name: "Information Technology Essentials", link: "notes/3_2_Information_Technology_Essentials.pdf" }
        ]
    },
    "4": {
        "1": [
            { name: "Blockchain", link: "notes/4_1_Blockchain.pdf" },
            { name: "Cyber Security", link: "notes/4_1_Cyber_Security.pdf" },
            { name: "Big Data", link: "notes/4_1_Big_Data.pdf" },
            { name: "Cloud Computing", link: "notes/4_1_Cloud_Computing.pdf" }
        ],
        "2": [
            { name: "Deep Learning", link: "notes/4_2_Deep_Learning.pdf" },
            { name: "DevOps", link: "notes/4_2_DevOps.pdf" },
            { name: "AR/VR", link: "notes/4_2_AR_VR.pdf" },
            { name: "Quantum Computing", link: "notes/4_2_Quantum_Computing.pdf" }
        ]
    }
};

function fetchNotes() {
    const year = document.getElementById("year").value;
    const semester = document.getElementById("semester").value;
    const notesList = document.getElementById("notesList");
    
    notesList.innerHTML = "";

    if (year && semester && notesData[year] && notesData[year][semester]) {
        const subjects = notesData[year][semester];
        const list = document.createElement("ul");

        subjects.forEach(subject => {
            const listItem = document.createElement("li");
            const link = document.createElement("a");

            link.href = subject.link;
            link.textContent = subject.name;
            link.download = subject.name + ".pdf";
            link.target = "_blank";

            listItem.appendChild(link);
            list.appendChild(listItem);
        });

        notesList.appendChild(list);
    } else {
        notesList.innerHTML = "<p>No notes available for the selected year and semester.</p>";
    }
}
