
const MAX_GROUP_SIZE = 100;
let groupOrders = [];

document.getElementById("group-size").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        updateGroupSize();
    }
});

function updateGroupSize() {
    let groupSize = parseInt(document.getElementById("group-size").value) || 1;
    
    if (groupSize > MAX_GROUP_SIZE) {
        groupSize = MAX_GROUP_SIZE;
        document.getElementById("group-size").value = MAX_GROUP_SIZE;
        alert(`The maximum number of people allowed is ${MAX_GROUP_SIZE}.`);
    }

    groupOrders = Array(groupSize).fill().map(() => []);
    updateOrderSummary();
}

function updateOrderSummary() {
    const orderSummary = document.getElementById("order-summary");
    orderSummary.innerHTML = "";

    groupOrders.forEach((personOrder, index) => {
        const personDiv = document.createElement("div");
        personDiv.className = "person-order";
        personDiv.innerHTML = `
            <h3>Person ${index + 1}</h3>
            <ul>
                ${personOrder.map(item => `<li>${item.name} x${item.quantity}: Rs${(item.price * item.quantity).toFixed(2)}</li>`).join('')}
            </ul>
            <p>Subtotal: Rs${personOrder.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</p>
            <div class="order-controls">
            <button onclick="removePerson(${index})">Remove Person</button>
            <button onclick="addProduct(${index})">Add</button>
            </div>
        `;
        orderSummary.appendChild(personDiv);
    });

    calculateTotal();
}

function calculateTotal() {
    const total = groupOrders.reduce((sum, personOrder) => 
        sum + personOrder.reduce((personSum, item) => personSum + item.price * item.quantity, 0), 0);
    const tax = total * 0.1;
    const totalWithTax = total + tax;

    document.getElementById("total").textContent = total.toFixed(2);
    document.getElementById("tax").textContent = tax.toFixed(2);
    document.getElementById("total-with-tax").textContent = totalWithTax.toFixed(2);
}

function removePerson(index) {
    groupOrders.splice(index, 1);
    updateOrderSummary();
}

function addProduct(index) {
    // Open the menu.html in a new window with query parameters to pass the person index
    const menuWindow = window.open(`menu.html?personIndex=${index}`, 'menuWindow', 'width=800,height=600');

    // Listen for messages from the new window
    window.addEventListener('message', function(event) {
        if (event.source === menuWindow && event.data.action === 'updateOrder') {
            updateGroupOrder(event.data.personIndex, event.data.item, event.data.quantity);
            menuWindow.close(); // Close the menu window after updating the order
        }
    }, { once: true }); // Ensure the event listener is only triggered once
}

function updateGroupOrder(personIndex, item, quantity) {
    const personOrder = groupOrders[personIndex];
    const existingItemIndex = personOrder.findIndex(i => i.name === item.name);

    if (existingItemIndex !== -1) {
        personOrder[existingItemIndex].quantity += quantity;
        if (personOrder[existingItemIndex].quantity <= 0) {
            personOrder.splice(existingItemIndex, 1);
        }
    } else if (quantity > 0) {
        personOrder.push({ ...item, quantity: quantity });
    }

    updateOrderSummary();
}

// Initialize the order summary based on the group size
updateGroupSize();
