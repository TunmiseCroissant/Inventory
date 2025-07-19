const inventory = document.querySelector('#inventory');
const addButton = document.querySelector('#add-button');
const editor = document.querySelector("#item-editor");
const form = document.querySelector("#item-form");
const viewer = document.querySelector("#item-viewer");
const itemInfo = document.querySelector("#item-info");
let PropertyDiv = document.querySelector("#new-input");
const Orginal_Form = document.querySelector("#item-form").innerHTML
let newPropBtn;
let AddPropBtn;
let removeBTN;
items = {}


function addItem(item) {
    if (!item) return;
    const itemElement = document.createElement('div');
    itemElement.classList.add('item');
    itemElement.textContent = item;
    inventory.appendChild(itemElement);
    
    form.reset();
    itemElement.addEventListener('click', () => {
        itemInfo.innerHTML = getInfo(item);
        viewer.showModal();
        infoCloseButton = document.querySelector("#close-button");
        infoCloseButton.addEventListener("click", () => viewer.close());
        removeBTN = document.querySelector("#remove-button");
        removeBTN.addEventListener("click", (event) => {
            viewer.close();
            inventory.removeChild(itemElement);
            delete items[item];
        })
    })
}; 

addButton.addEventListener("click", () => {
    editor.showModal()
    document.querySelector("#item-form").innerHTML = Orginal_Form
    newPropBtn = document.querySelector("#new-property")
    newPropBtn.addEventListener("click", newProperty)
});
form.addEventListener("submit", function (event) {
    event.preventDefault();

    let name = document.querySelector("#name")

    if (items.hasOwnProperty(name.value)) {
        name.value = "Can not have duplicate items!"
        return;
    }

    const itemData = new FormData(form);
    const data = {}
    for ([key, value] of itemData) {
        if (value) {
            data[key] = value
        }
    }
    items[itemData.get("name")] = data;
    addItem(itemData.get('name'));
    editor.close();
})
form.addEventListener("reset", () => {
    editor.close();
    form.reset();
});

function getInfo(item) {
    let returnString = '<h2>Item Info</h2> ';
    if (!items[item]) {
        return;
    }
    for (const [key, value] of Object.entries(items[item])) {
        returnString += `<h2>${key}:</h2> <p>${value}</p>`;
    }
    returnString += `<br> <button id="close-button">Close</button> <br> <button id = "remove-button">Delete Item</button>`;
    return returnString;
};


function newProperty() {
    PropertyDiv.innerHTML = '<label for="new">New Property:</label> <input type="text" id="new" name="new" required> <button id = "addProperty">Add</button>'
    AddPropBtn = document.querySelector("#addProperty")
    AddPropBtn.addEventListener("click", function (event) {
        let NewPropValue = document.querySelector("#new").value
        const newProp = document.querySelector("#new-properties")
        if (!NewPropValue) {
            PropertyDiv.innerHTML = `<button id = "new-property">New property</button>`
            return
        }
        event.preventDefault()
        document.querySelector("#new-properties").innerHTML += `<label for="${NewPropValue}:">${NewPropValue}:</label> <br> <input type="text" id="${NewPropValue}" name="${NewPropValue}"> <br> <br>`
        PropertyDiv.innerHTML = `<button id = "new-property">New property</button>`
        newPropBtn = document.querySelector("#new-property")
        newPropBtn.addEventListener("click", newProperty)
    })
} 