// Intiate variables
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
// Variables intiaed!

onLoad() // load all items from storage when the program is run

function addItem(item) { // called when the user submits the item creator form
    if (!item) return; // If the item was somehow not created
    // create the item div
    const itemElement = document.createElement('div');
    itemElement.classList.add('item');
    itemElement.innerHTML += `<input type="checkbox" id="${items[item]["Name"]}-check" name="${items[item]["Name"]}" value="checked">`;
    itemElement.innerHTML += `<div id = "${items[item]["Name"]}-clickBox">${shorten(items[item]["Name"])}</div>`;
    inventory.appendChild(itemElement);

    // seperates the clickable area from the checkbox
    let NameClick = document.getElementById(`${items[item]["Name"]}-clickBox`);
    let checkBox = document.getElementById(`${items[item]["Name"]}-check`)

    // if the item was checked when the website closed, check it now
    checkBox.checked = items[item]["checked"]
    strikeThrough(NameClick, items[item]["checked"]) // if the item is checked, strikethough the text

    checkBox.addEventListener("change", () => { // whenever the checkbox is clicked, update the item
        items[item]["checked"] = checkBox.checked;
        localStorage.setItem("items", JSON.stringify(items))
        strikeThrough(NameClick, items[item]["checked"])
    })

    form.reset();
    NameClick.addEventListener('click', () => { //when the item is clicked
        resetBTNs(item, itemElement, NameClick)
    })
}; 

function resetBTNs(item, itemElement, NameClick) {
    itemInfo.innerHTML = getInfo(item);
    viewer.showModal();
    // reset the buttons event listeners
    infoCloseButton = document.querySelector("#close-button");
    infoCloseButton.addEventListener("click", () => viewer.close());
    removeBTN = document.querySelector("#remove-button");
    removeBTN.addEventListener("click", () => {
        // confirm the user wants to delete
        let deleteModal = document.querySelector("#delete")
        deleteModal.showModal()
        document.querySelector("#delete-text").innerHTML = `<h2>Are you sure you want to delete ${items[item]["Name"]}?</h2> (WARNING: This action can not be undone!)`
        document.querySelector("#confirm-delete").addEventListener("click", () => {
            remove(item, itemElement)
            deleteModal.close()
        })
        document.querySelector("#cancel-delete").addEventListener("click", () => {
            deleteModal.close()
        })
    })
    editBTN = document.querySelector("#edit-button")
    editBTN.addEventListener("click", () => {
        editItem(item, itemElement, NameClick)
    })
}


function editItem(item, itemElement, NameClick) {
    let name = items[item]["Name"]
    editor.showModal()
    let HTMLstring = `<h2>Editing ${name}</h2> <h4>(Any blank properties will be ignored)</h4> <form id = "editor-form" method = "dialog">`
    if (!items[item]) {
        return;
    };
    // for every item property (expect for checked), create a form with the values filled in
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


        data["checked"] = items[item]["checked"]

        items[item] = data;
        localStorage.setItem("items", JSON.stringify(items))
        itemInfo.innerHTML = getInfo(item);
        NameClick.innerHTML = shorten(items[item]["Name"])
        editor.close()
        resetBTNs(item, itemElement, NameClick)
    })

}



function remove(item, itemElement) {
    viewer.close();
    inventory.removeChild(itemElement);
    delete items[item];
    localStorage.setItem("items", JSON.stringify(items))
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

    data["checked"] = false

    items[(itemData.get("Name")).replace(/\s+/g, "-")] = data;
    localStorage.setItem("items", JSON.stringify(items))
    addItem((itemData.get("Name")).replace(/\s+/g, "-"));
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

function shorten(word) {
    if (word.length > 49) {
    return word.slice(0, 46) + "..."
    } else {
        return word
    }
}

function strikeThrough(div, strike) {
    div.style.textDecoration = strike ? "line-through" : "none";
}