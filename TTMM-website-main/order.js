document.addEventListener("DOMContentLoaded", function () {
  // Get references to HTML elements
  const orderSummaryDiv = document.getElementById("order-summary");
  const numberOfPeopleInput = document.getElementById("number-of-people");

  // Function to format currency
  const formatCurrency = (amount) => {
    return `Rs${parseFloat(amount).toFixed(2)}`;
  };

  // Function to update split bill information
  const updateSplitBill = (totalAmount, numPeople) => {
    if (numPeople > 0) {
      const pricePerPerson = totalAmount / numPeople;
      let splitInfo = document.getElementById("split-info");

      if (!splitInfo) {
        splitInfo = document.createElement("div");
        splitInfo.id = "split-info";
        splitInfo.className = "split-info";
        orderSummaryDiv.appendChild(splitInfo);
      }

      splitInfo.innerHTML = `
        <div class="split-details">
          <div class="split-row">
            <span class="split-label">Number of People:</span>
            <span class="split-value">${numPeople}</span>
          </div>
          <div class="split-row">
            <span class="split-label">Price per Person:</span>
            <span class="split-value">${formatCurrency(pricePerPerson)}</span>
          </div>
        </div>
      `;
    }
  };

  // Function to create payment button
  const createPaymentButton = () => {
    const paymentButton = document.createElement("button");
    paymentButton.className = "payment-button";
    paymentButton.innerHTML = "Proceed to Payment";
    paymentButton.onclick = () => window.location.href = "payment.html";
    return paymentButton;
  };

  // Function to handle errors
  const handleError = (error) => {
    console.error("Error:", error);
    orderSummaryDiv.innerHTML = `
      <div class="error-message">
        <p>Error loading orders. Please try again later.</p>
        <p>Details: ${error.message}</p>
      </div>
    `;
  };

  // Function to create an order item element
  const createOrderItemElement = (order) => {
    const orderItemDiv = document.createElement("div");
    orderItemDiv.className = "order-item";
    orderItemDiv.innerHTML = `
      <p><strong>Item:</strong> ${order.item_name}</p> <!-- Assuming 'name' is the correct property -->
      <p><strong>Quantity:</strong> ${order.quantity}</p>
      <p><strong>Price:</strong> ${formatCurrency(order.price)}</p>
    `;
    const totalPrice = parseFloat(order.price) * parseInt(order.quantity);
    return { element: orderItemDiv, totalPrice };
  };

  // Main function to fetch and display orders
  const fetchAndDisplayOrders = async () => {
    try {
      const response = await fetch("fetch_orders.php");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const orders = await response.json();
      console.log(orders); // Log the orders array to inspect the structure
      let totalAmount = 0;

      // Clear existing content
      orderSummaryDiv.innerHTML = "";

      // Create orders container
      const ordersContainer = document.createElement("div");
      ordersContainer.className = "orders-container";

      // Display orders
      orders.forEach(order => {
        const { element, totalPrice } = createOrderItemElement(order);
        ordersContainer.appendChild(element);
        totalAmount += totalPrice;
      });

      // Add orders container to summary div
      orderSummaryDiv.appendChild(ordersContainer);

      // Add total amount summary
      const totalAmountDiv = document.createElement("div");
      totalAmountDiv.className = "grand-total";
      totalAmountDiv.innerHTML = `
        <p><strong>Total Amount:</strong> ${formatCurrency(totalAmount)}</p>
      `;
      orderSummaryDiv.appendChild(totalAmountDiv);

      // Add payment button
      const paymentButton = createPaymentButton();
      orderSummaryDiv.appendChild(paymentButton);

      // Set up number of people input handler
      numberOfPeopleInput.addEventListener("input", function () {
        const numPeople = parseInt(this.value);
        updateSplitBill(totalAmount, numPeople);
      });

      // Store total amount in session storage for payment page
      sessionStorage.setItem('orderTotalAmount', totalAmount);

    } catch (error) {
      handleError(error);
    }
  };

  // Initialize the page
  fetchAndDisplayOrders();
});
