const inventory = document.querySelector('#inventory');
const addButton = document.querySelector('#add-button');
const editor = document.querySelector("#item-editor");
const form = document.querySelector("#item-form");
const viewer = document.querySelector("#item-viewer");
const itemInfo = document.querySelector("#item-info");
let infoCloseButton;
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
    })
}; 

addButton.addEventListener("click", () => editor.showModal());
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const itemData = new FormData(form);
    const data = {}
    for ([key, value] of itemData) {
        data[key] = value
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
    returnString += `<br> <button id="close-button">Close</button>`;
    return returnString;
};