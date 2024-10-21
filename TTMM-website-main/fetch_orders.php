<?php
// Database connection using MySQLi
$host = 'localhost';
$db = 'SoupOrders';
$user = 'root';
$pass = 'Password';

$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

// Fetch the orders from the database
$sql = "SELECT item_name, category, price, quantity, total_price
FROM orders
WHERE order_date >= NOW() - INTERVAL 30 MINUTE;
";
$result = $conn->query($sql);

$orders = [];

if ($result->num_rows > 0) {
    // Fetch each row as an associative array
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }
}

echo json_encode($orders);

$conn->close();
