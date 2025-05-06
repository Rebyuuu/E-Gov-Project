<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "sim_transfer_db";
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

try {
    // getting all applications from the db
    $sql = "SELECT refrence_no, sim_number, current_name, new_name, status FROM sim_transfer";
    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception('Failed to fetch applications: ' . $conn->error);
    }

    $applications = [];
    while ($row = $result->fetch_assoc()) {
        $applications[] = $row;
    }

    echo json_encode([
        'success' => true,
        'applications' => $applications
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} finally {
    $conn->close();
}
exit;