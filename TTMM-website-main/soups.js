document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".add-to-cart");

    buttons.forEach((button) => {
        let count = 0;

        button.addEventListener("click", function (event) {
            const target = event.target;
            const itemName = this.getAttribute("data-item");
            const category = this.getAttribute("data-category");
            const price = parseFloat(this.getAttribute("data-price"));

            // Update count based on button clicks
            if (count === 0) {
                count++;
                this.innerHTML = `<div>-</div><span>${count}</span><div>+</div>`;
            } else {
                if (target.textContent === "+") {
                    count++;
                } else if (target.textContent === "-" && count > 0) {
                    count--;
                }

                if (count === 0) {
                    this.innerHTML = `<div>Add To Cart</div>`;
                } else {
                    this.innerHTML = `<div>-</div><span>${count}</span><div>+</div>`;
                }

                if (count > 9) {
                    alert("Maximum limit reached!");
                    count = 9; 
                    this.innerHTML = `<div>-</div><span>${count}</span><div>+</div>`;
                }
            }

            // Save order to the server using AJAX
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "save_order.php", true); 
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            const total = price * count;
            xhr.onload = function () {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    alert(response.message || response.error);
                } else {
                    alert("An error occurred while saving the order.");
                }
            };

            xhr.send(`item_name=${encodeURIComponent(itemName)}&category=${encodeURIComponent(category)}&price=${price}&quantity=${count}&total_price=${total}`);
        });
    });
});
