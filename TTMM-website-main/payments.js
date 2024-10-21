let selectedMethod = '';
let totalAmount = 0; // Global variable to store total order amount

function selectPaymentMethod(element, method) {
    // Deselect other payment methods
    document.querySelectorAll('.payment-method').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Add 'selected' class to the clicked element
    element.classList.add('selected');
    
    // Hide all payment fields
    document.getElementById('cardFields').style.display = 'none';
    document.getElementById('upiField').style.display = 'none';
    document.getElementById('netbankingFields').style.display = 'none';
    
    // Show the selected payment method fields
    if (method === 'card') {
        document.getElementById('cardFields').style.display = 'block';
    } else if (method === 'upi') {
        document.getElementById('upiField').style.display = 'block';
    } else if (method === 'netbanking') {
        document.getElementById('netbankingFields').style.display = 'block';
    }
    
    selectedMethod = method;
}

function processPayment() {
    // Get common fields
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    if (!name || !email) {
        alert('Please fill in all required fields');
        return;
    }

    let paymentDetails = {
        method: selectedMethod,
        name,
        email
    };

    // Get method-specific fields
    if (selectedMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber').value;
        const expiry = document.getElementById('expiry').value;
        const cvv = document.getElementById('cvv').value;

        if (!cardNumber || !expiry || !cvv) {
            alert('Please fill in all card details');
            return;
        }

        paymentDetails = {
            ...paymentDetails,
            cardNumber,
            expiry,
            cvv
        };
    } else if (selectedMethod === 'upi') {
        const upiId = document.getElementById('upiId').value;

        if (!upiId) {
            alert('Please enter UPI ID');
            return;
        }

        paymentDetails = {
            ...paymentDetails,
            upiId
        };
    } else if (selectedMethod === 'netbanking') {
        const bank = document.getElementById('bank').value;

        if (!bank) {
            alert('Please select a bank');
            return;
        }

        paymentDetails = {
            ...paymentDetails,
            bank
        };
    } else {
        alert('Please select a payment method');
        return;
    }

    console.log('Processing payment:', paymentDetails);
    alert('Payment processing... This is a demo.');
}

// Function to update split bill
function updateSplitAmount() {
    const numberOfPeople = document.getElementById('number-of-people').value;
    const splitAmountDiv = document.getElementById('splitAmount');

    if (numberOfPeople > 0 && totalAmount > 0) {
        const amountPerPerson = totalAmount / numberOfPeople;
        splitAmountDiv.innerHTML = `
            <p>Split Amount per Person: Rs${amountPerPerson.toFixed(2)}</p>
        `;
    } else {
        splitAmountDiv.innerHTML = '<p>Please enter a valid number of people.</p>';
    }
}

// Fetch and display order details
document.addEventListener('DOMContentLoaded', function() {
    fetch('fetch_orders.php')
        .then(response => response.json())
        .then(orders => {
            const orderDetailsDiv = document.getElementById('orderDetails');
            totalAmount = 0; // Reset total amount

            orders.forEach(order => {
                const orderPrice = parseFloat(order.total_price) || 0;
                totalAmount += orderPrice;

                const orderElement = document.createElement('div');
                orderElement.className = 'summary-row';
                orderElement.innerHTML = `
                    <span>${order.item_name} × ${order.quantity}</span>
                    <span>Rs${orderPrice.toFixed(2)}</span>
                `;
                orderDetailsDiv.appendChild(orderElement);
            });

            const totalElement = document.createElement('div');
            totalElement.className = 'summary-row total-row';
            totalElement.innerHTML = `
                <span>Total Amount</span>
                <span>Rs${totalAmount.toFixed(2)}</span>
            `;
            orderDetailsDiv.appendChild(totalElement);

            // Update split amount when the number of people changes
            document.getElementById('number-of-people').addEventListener('input', updateSplitAmount);
        })
        .catch(error => {
            console.error('Error fetching orders:', error);
            document.getElementById('orderDetails').innerHTML = '<p>Error loading order details.</p>';
        });
});
