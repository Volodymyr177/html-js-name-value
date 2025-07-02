/**
 * Main array that stores "name = value" pairs
 */
const list = [];

/**
 * Checks the entered string for validity of the format name = value
 * Returns an object { name, value } or null if the format is invalid
 */
function validateInput(input) {
    const regex = /^\s*([a-zA-Z0-9]+)\s*=\s*([a-zA-Z0-9]+)\s*$/;
    const match = input.match(regex);
    return match ? { name: match[1], value: match[2] } : null;
}

/**
 * Updates the HTML list (select) based on the current list array
 */
function renderList() {
    const listBox = document.getElementById("listBox");
    listBox.innerHTML = "";
    list.forEach((pair, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.text = `${pair.name} = ${pair.value}`;
        listBox.appendChild(option);
    });
}

/**
 * Adds a new name=value pair if it is valid
 * Then updates the list and stores it in localStorage
 */
function addPair() {
    const input = document.getElementById("inputField").value;
    const parsed = validateInput(input);
    if (!parsed) {
        alert("Invalid format. Use name = value.");
        return;
    }
    list.push(parsed);
    renderList();
    document.getElementById("inputField").value = "";

    saveToLocalStorage();
}

/**
 * Sorts the list by name or value in ascending order
 * Then updates the list and stores it in localStorage
 */
function sortList(by) {
    list.sort((a, b) => a[by].localeCompare(b[by]));
    renderList();

    saveToLocalStorage();
}

/**
 * Removes all selected items from the list
 * Then updates the list and saves it to localStorage
 */
function deleteSelected() {
    const listBox = document.getElementById("listBox");
    const selected = Array.from(listBox.selectedOptions).map(opt => Number(opt.value));
    for (let i = selected.length - 1; i >= 0; i--) {
        list.splice(selected[i], 1);
    }
    renderList();

    saveToLocalStorage();
}

/**
 * Loads saved data from localStorage when opening the page
 */
document.addEventListener('DOMContentLoaded', loadFromLocalStorage);

/**
 * Saves the current array list in localStorage
 */
function saveToLocalStorage() {
    localStorage.setItem('nameValueList', JSON.stringify(list));
}

/**
 * Loads the list array from localStorage if data exists
 * Then updates the list display
 */
function loadFromLocalStorage() {
    const saved = localStorage.getItem('nameValueList');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
                list.push(...parsed);
                renderList();
            }
        } catch (e) {
            console.error('Failed to load from localStorage', e);
        }
    }
}

/**
 * Generates XML from all pairs in the list
 * Outputs the result in a special div
 */
function showAsXML() {
    const xml = list.map(pair => `  <item name="${pair.name}" value="${pair.value}" />`).join("\n");
    document.getElementById("xmlOutput").textContent = `<items>\n${xml}\n</items>`;
}
