document.getElementById("parseButton").addEventListener("click", () => {
    const fileInput = document.getElementById("resumeFile");
    const resultDiv = document.getElementById("result");

    if (fileInput.files.length === 0) {
        resultDiv.innerText = "Please select a resume file to parse.";
        return;
    }

    const resumeFile = fileInput.files[0];

    const form = new FormData();
    form.append("show_original_response", "false");
    form.append("fallback_providers", "");
    form.append("providers", "affinda");
    form.append("file", resumeFile);

    const options = {
        method: "POST",
        url: "https://api.edenai.run/v2/ocr/resume_parser",
        headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzMzNDM4NTktMTNkNy00MThiLWJkZTEtYzdlYzdkYWQ0N2U1IiwidHlwZSI6ImFwaV90b2tlbiJ9.6FKC7Eih55Jrb9GStJ6IWGtYKRi-tfZpDX4lLPXcIK8", // Replace with your actual API key
        },
        data: form,
    };

    axios.request(options)
        .then((response) => {
            const parsedData = response.data;
            const affindaData = parsedData["affinda"];
            // const edenaiData = parsedData["eden-ai"];

            // Format the parsed data in a neat structure
            let formattedText = "Affinda Parsed Data:\n";
            formattedText += formatParsedData(affindaData);

            // formattedText += "\n\nEden-AI Parsed Data:\n";
            // formattedText += formatParsedData(edenaiData);

            // Display the formatted text in the resultDiv
            resultDiv.innerText = formattedText[0];

            


            


        })
        .catch((error) => {
            resultDiv.innerText = "Error: " + error.message;
        });
});

function formatParsedData(data) {
    let formattedText = "";

    for (const category in data.extracted_data) {
        formattedText += `${category}:\n`;
        const categoryData = data.extracted_data[category];

        for (const key in categoryData) {
            const value = categoryData[key];

            if (Array.isArray(value) && value.length > 0) {
                formattedText += `  ${key}:\n`;
                value.forEach((item, index) => {
                    formattedText += `    ${index + 1}: ${formatObject(item)}\n`;
                });
            } else {
                formattedText += `  ${key}: ${formatObject(value)}\n`;
            }
        }
    }

    return formattedText;
}

function formatObject(obj) {
    return JSON.stringify(obj, null, 2);
}