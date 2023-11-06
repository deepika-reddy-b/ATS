var namespace = joint.shapes;
var graph = null; // Initialize graph as null
var paper = null; // Initialize paper as null
var workflowList = [];
var selectedWorkflow = null;



function createNewWorkflow() {
    var workflowName = document.getElementById("WFname").value;
    if (workflowName) {
        workflowList.push(workflowName);
        console.log(workflowList);
        var listItem = document.createElement("li");
        listItem.textContent = workflowName;
        listItem.onclick = function () {
            console.log(workflowName);
            displayWorkflow(workflowName);
        };
        document.getElementById("workflow-list").appendChild(listItem);
    }
}

function displayWorkflow(workflowName) {
    selectedWorkflow = workflowName;
    
    if (paper) {
        paper.remove();
    }
    
    // Fetch the data from the database and set it as the JSON for your graph
    const database = getDatabase();
    const workflowRef = ref(database, workflowName);
    get(workflowRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const workflowData = snapshot.val();
                const flow = workflowData.flow; // This assumes 'flow' is the key in your workflow data
                graph.fromJSON(flow);
            }
        })
        .catch((error) => {
            console.error("Error getting data:", error);
        });

    createWorkflow();
}




function addblock(){
    nameit=document.getElementById("name").value;
    var rect = new joint.shapes.standard.Rectangle();
    rect.position(0, 0);
    rect.resize(100, 40);
    rect.attr({
        body: {
            fill: 'blue'
        },
        label: {
            text: nameit,
            fill: 'white'
        }
    });
    rect.addTo(graph);
}   


function updateBlock() {
    if (selectedElement) {
    selectedElement.attr('label/text', document.getElementById('stepNameInput').value);
    selectedElement.set('stepDescription', document.getElementById('stepDescriptionInput').value);
    selectedElement.set('stepConfig', document.getElementById('stepConfigInput').value);
    }
}

function deleteBlock() {
    if (selectedElement) {
        selectedElement.remove();
        selectedElement = null; 
    }
}