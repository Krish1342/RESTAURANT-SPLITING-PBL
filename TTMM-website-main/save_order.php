<?php
$servername = "localhost";
$username = "root";
$password = "Password";
$dbname = "SoupOrders";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$item_name = $_POST['item_name'];
$category = $_POST['category'];
$price = $_POST['price'];
$quantity = $_POST['quantity'];
$total_price = $_POST['total_price'];

$sql = "INSERT INTO orders (item_name, category, price, quantity, total_price)
VALUES ('$item_name', '$category', $price, $quantity, $total_price)";

if ($conn->query($sql) === TRUE) {
    echo "Order successfully saved";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
