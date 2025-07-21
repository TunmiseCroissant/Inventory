const inventory = document.querySelector('#inventory');
const addButton = document.querySelector('#add-button');
const creator = document.querySelector("#item-creator");
const form = document.querySelector("#item-form");
const viewer = document.querySelector("#item-viewer");
const itemInfo = document.querySelector("#item-info");
let PropertyDiv = document.querySelector("#new-input");
const Orginal_Form = document.querySelector("#item-form").innerHTML
const editor = document.querySelector("#item-editor")
let EditorAddBTN;
let EditorNewBTN;
let newPropBtn;
let AddPropBtn;
let removeBTN;
let editBTN;
items = {}

onLoad()

function addItem(item) {
    if (!item) return;
    const itemElement = document.createElement('div');
    itemElement.classList.add('item');
    itemElement.textContent = items[item]["Name"];
    inventory.appendChild(itemElement);
    
    form.reset();
    itemElement.addEventListener('click', () => {
        resetBTNs(item, itemElement)
        console.log(item)
    })
}; 

function resetBTNs(item, itemElement) {
    itemInfo.innerHTML = getInfo(item);
        viewer.showModal();
        infoCloseButton = document.querySelector("#close-button");
        infoCloseButton.addEventListener("click", () => viewer.close());
        removeBTN = document.querySelector("#remove-button");
        removeBTN.addEventListener("click", () => {
            remove(item, itemElement)
        })
        editBTN = document.querySelector("#edit-button")
        editBTN.addEventListener("click", () => {
            editItem(item, itemElement)
            console.log(item)
        })
}


function editItem(item, itemElement) {
    console.log(item)
    let name = items[item]["Name"]
    editor.showModal()
    let HTMLstring = `<h2>Editing ${name}</h2> <h4>(Any blank properties will be ignored)</h4> <form id = "editor-form" method = "dialog">`
    if (!items[item]) {
        return;
    };
    for (const [key, value] of Object.entries(items[item])) {
        if (key === "Name") {
            HTMLstring += `<label for="${key}:">${key}:</label> <input type="text" id="Edit-Name" name="${key}" value="${value}" required>`
        } else if (typeof value === "number") {
            HTMLstring += `<br> <label for="${key}:">${key}:</label> <input type="number" id="${key}" name="${key}" value="${value}">`
        } else if (typeof value === "string") {
            HTMLstring += `<br> <label for="${key}:">${key}:</label> <input type="text" id="${key}" name="${key}" value="${value}">`
        }
    };
    HTMLstring += `<span id = "new-editor-props"></span> <button id = "save-edits">Save</button> <button id = "close-editor">Cancel</button> </form> <br> <div id = "add-div"> <button id = "add-editor-property">New property</button> </div>`;
    document.querySelector("#editor").innerHTML = HTMLstring;
    let addDiv = document.querySelector("#add-div")
    EditorAddBTN = document.querySelector("#add-editor-property")
    EditorAddBTN.addEventListener("click", () => {
        addPropToEditor(addDiv)
    })
    let EditorForm = document.querySelector("#editor-form")
    document.querySelector("#close-editor").addEventListener("click", () => {
        editor.close()
        EditorForm.reset()
        resetBTNs(item, itemElement)
    });
    EditorForm.addEventListener("submit", (event) => {
        event.preventDefault();
        let NameInput = document.querySelector("#Edit-Name")
        console.log(NameInput.value)
        if (!NameInput.value || !NameInput.value.trim()) {
            NameInput.value = "Please enter a valid name!"
            return;
        }
        let data = {}
        const NewData = new FormData(EditorForm);
        for (const [key, value] of NewData) {
            if (value) {
                data[key] = value
            }
        }
        items[item] = data;
        console.log(item)
        localStorage.setItem("items", JSON.stringify(items))
        itemInfo.innerHTML = getInfo(item);
        itemElement.textContent = items[item]["Name"]
        editor.close()
        resetBTNs(item, itemElement)
    })

}



function remove(item, itemElement) {
    viewer.close();
    inventory.removeChild(itemElement);
    delete items[item];
    localStorage.setItem("items", JSON.stringify(items))
    console.log(items)
}

addButton.addEventListener("click", () => {
    creator.showModal()
    document.querySelector("#item-form").innerHTML = Orginal_Form
    newPropBtn = document.querySelector("#new-property")
    newPropBtn.addEventListener("click", newProperty)
});
form.addEventListener("submit", function (event) {
    event.preventDefault();

    let name = document.querySelector("#Name")

    if (items.hasOwnProperty(name.value)) {
        name.value = "Can not have duplicate items!"
        return;
    } else if (name.value.trim() === "") {
        name.value = "Please enter a valid name!"
        return
    }

    const itemData = new FormData(form);
    const data = {}
    for (const [key, value] of itemData) {
        if (value) {
            data[key] = value
        }
    }
    items[itemData.get("Name")] = data;
    localStorage.setItem("items", JSON.stringify(items))
    addItem(itemData.get('Name'));
    creator.close();
})
form.addEventListener("reset", () => {
    creator.close();
    form.reset();
});

function getInfo(item) {
    let returnString = '<h2>Item Info</h2>';
    if (!items[item]) {
        return;
    }
    for (const [key, value] of Object.entries(items[item])) {
        returnString += `<h3>${key}:</h3> <p>${value}</p>`;
    }
    returnString += `<br> <button id="close-button">Close</button> <br> <button id = "edit-button">Edit Item</button> <br> <button id = "remove-button">Delete Item</button>`;
    return returnString;
};


function newProperty() {
    PropertyDiv.innerHTML = '<label for="new">New Property:</label> <input type="text" id="new" name="new" required> <button id = "addProperty">Add</button>'
    AddPropBtn = document.querySelector("#addProperty")
    AddPropBtn.addEventListener("click", function (event) {
        let NewPropValue = document.querySelector("#new").value
        const newProp = document.querySelector("#new-properties")
        if (!NewPropValue || !NewPropValue.trim()) {
            PropertyDiv.innerHTML = `<button id = "new-property">New property</button>`;
            newPropBtn = document.querySelector("#new-property");
            newPropBtn.addEventListener("click", newProperty);
            return;
        }
        event.preventDefault()
        createProp(NewPropValue, "#new-properties")
        PropertyDiv.innerHTML = `<button id = "new-property">New property</button>`;
        newPropBtn = document.querySelector("#new-property");
        newPropBtn.addEventListener("click", newProperty);
    })
};

function addPropToEditor(addDiv) {
    addDiv.innerHTML = '<label for="new">New Property:</label> <input type="text" id="newProp" name="newProp" required> <button id = "newProperty">Add</button>'
    EditorNewBTN = document.querySelector("#newProperty")
    EditorNewBTN.addEventListener("click", function (event) {
        let NewPropValue = document.querySelector("#newProp").value
        const newProp = document.querySelector("#new-properties")
        if (!NewPropValue || !NewPropValue.trim()) {
            addDiv.innerHTML = `<button id = "add-editor-property">New property</button>`;
            EditorAddBTN = document.querySelector("#add-editor-property");
            EditorAddBTN.addEventListener("click", () => {
                addPropToEditor(addDiv)
            });
            return;
        }
        event.preventDefault()
        createProp(NewPropValue, "#new-editor-props")
        addDiv.innerHTML = `<button id = "add-editor-property">New property</button>`;
        EditorAddBTN = document.querySelector("#add-editor-property");
        EditorAddBTN.addEventListener("click", () => {
                addPropToEditor(addDiv)
        });
    })
}

function onLoad() {
  const data = JSON.parse(localStorage.getItem("items")) || {};

  for (const [key, value] of Object.entries(data)) {
    items[key] = value;
    addItem(key);
  }
};

function createProp (NewPropValue, div) {
   const prop = document.createElement("div");
   prop.innerHTML = `<label for="${NewPropValue}:">${NewPropValue}:</label> <br> <input type="text" id="${NewPropValue}" name="${NewPropValue}"> <br> <br>`
   document.querySelector(div).appendChild(prop);
}
