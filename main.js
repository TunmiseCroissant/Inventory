const inventory = document.querySelector('#inventory');
const addButton = document.querySelector('#add-button');
const editor = document.querySelector("#item-editor");
const form = document.querySelector("#item-form");
items = {}


function addItem(item) {
    if (!item) return;
    const itemElement = document.createElement('div');
    itemElement.classList.add('item');
    itemElement.textContent = item;
    inventory.appendChild(itemElement);
    form.reset();
}

addButton.addEventListener("click", () => editor.showModal());
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const itemData = new FormData(form);
    items[itemData.get("item-name")] = {
        quanity: itemData.get('quantity'),
    }
    
    addItem(itemData.get('item-name'));
    editor.close();
})