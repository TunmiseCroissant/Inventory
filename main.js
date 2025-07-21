const inventory = document.querySelector('#inventory');
const addButton = document.querySelector('#add-button');
const creator = document.querySelector("#item-creator");
const form = document.querySelector("#item-form");
const viewer = document.querySelector("#item-viewer");
const itemInfo = document.querySelector("#item-info");
let PropertyDiv = document.querySelector("#new-input");
const Orginal_Form = document.querySelector("#item-form").innerHTML
const editor = document.querySelector("#item-editor")
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
    let HTMLstring = `<h2>Editing ${name}</h2> <form id = "editor-form" method = "dialog">`
    if (!items[item]) {
        return;
    };
    for (const [key, value] of Object.entries(items[item])) {
        if (typeof value === "number") {
            HTMLstring += `<label for="${key}:">${key}:</label> <br> <input type="number" id="${key}" name="${key}" value="${value}"> <br>`
        } if (typeof value === "string") {
            HTMLstring += `<label for="${key}:">${key}:</label> <br> <input type="text" id="${key}" name="${key}" value="${value}"> <br>`
        }
    };
    HTMLstring += `<button id = "save-edits">Save</button> <br> <button id = "close-editor">Cancel</button> </form>`;
    document.querySelector("#editor").innerHTML = HTMLstring;
    let EditorForm = document.querySelector("#editor-form")
    document.querySelector("#close-editor").addEventListener("click", () => {
        editor.close()
        EditorForm.reset()
        resetBTNs(item, itemElement)
    });
    EditorForm.addEventListener("submit", (event) => {
        event.preventDefault();
        
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
        if (!NewPropValue) {
            PropertyDiv.innerHTML = `<button id = "new-property">New property</button>`;
            newPropBtn = document.querySelector("#new-property");
            newPropBtn.addEventListener("click", newProperty);
            return;
        }
        event.preventDefault()
        createProp(NewPropValue)
        PropertyDiv.innerHTML = `<button id = "new-property">New property</button>`;
        newPropBtn = document.querySelector("#new-property");
        newPropBtn.addEventListener("click", newProperty);
    })
};

function onLoad() {
  const data = JSON.parse(localStorage.getItem("items")) || {};

  for (const [key, value] of Object.entries(data)) {
    items[key] = value;
    addItem(key);
  }
};

function createProp (NewPropValue) {
   const prop = document.createElement("div");
   prop.innerHTML = `<label for="${NewPropValue}:">${NewPropValue}:</label> <br> <input type="text" id="${NewPropValue}" name="${NewPropValue}"> <br> <br>`
   document.querySelector("#new-properties").appendChild(prop);
}
