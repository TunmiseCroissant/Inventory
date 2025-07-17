const inventory = document.querySelector('#inventory');
const addButton = document.querySelector('#add-button');


function addItem(item) {
    const itemElement = document.createElement('div');
    itemElement.classList.add('item');
    itemElement.textContent = item;
    inventory.appendChild(itemElement);
}

addButton.addEventListener("click", () => addItem(prompt("Enter item name:")));