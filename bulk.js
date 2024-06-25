function processCSV() {
    const fileInput = document.getElementById('csvFileInput');
    const designsContainer = document.getElementById('designs');
    designsContainer.innerHTML = '';

    if (fileInput.files.length === 0) {
        alert('Please upload a CSV file.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const text = event.target.result;
        const data = CSVToArray(text);

        if (data.length > 0) {
            const headers = data[0];
            const rows = data.slice(1);

            rows.forEach(row => {
                const design = createDesign(headers, row);
                designsContainer.appendChild(design);
            });
        } else {
            alert('The CSV file is empty.');
        }
    };

    reader.readAsText(file);
}

function CSVToArray(strData, strDelimiter = ',') {
    const objPattern = new RegExp(
        (
            '(\\"[^\\"]*(\\"{2})*[^\\"]*\\")|' +
            '([^\\' + strDelimiter + '\\r\\n]+)' +
            '|(' + strDelimiter + ')' +
            '|(\\r?\\n)|(\r\\n?)'
        ),
        'gi'
    );

    const arrData = [[]];
    let arrMatches = null;

    while (arrMatches = objPattern.exec(strData)) {
        const strMatchedDelimiter = arrMatches[5];

        if (strMatchedDelimiter) {
            arrData.push([]);
        }

        const strMatchedValue = arrMatches[1]
            ? arrMatches[1].replace(new RegExp('\\"{2}', 'g'), '"')
            : arrMatches[3];

        arrData[arrData.length - 1].push(strMatchedValue);
    }

    return arrData;
}

function createDesign(headers, row) {
    const design = document.createElement('div');
    design.className = 'certificate';

    headers.forEach((header, index) => {
        const field = document.createElement('p');
        field.innerText = `${header}: ${row[index]}`;
        design.appendChild(field);
    });

    return design;
}
