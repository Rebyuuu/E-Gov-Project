<?php
// Set CORS headers to allow requests from the frontend
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header("Access-Control-Allow-Methods: POST");
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
    // Get the raw POST data
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // Validate the input data
    if (!isset($data['refNumber']) || !isset($data['status']) || !isset($data['details'])) {
        throw new Exception('Invalid input data');
    }

    $refNumber = $data['refNumber'];
    $status = $data['status'];
    $details = $data['details'];

    // Update the status in the database
    $sql = "UPDATE sim_transfer SET status = ?, details = ? WHERE refrence_no = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception('Failed to prepare SQL statement: ' . $conn->error);
    }

    $stmt->bind_param('sss', $status, $details, $refNumber);
    if (!$stmt->execute()) {
        throw new Exception('Failed to update status: ' . $stmt->error);
    }

    // success response sending
    echo json_encode([
        'success' => true,
        'message' => 'Status updated successfully'
    ]);
} catch (Exception $e) {
    // Handle errors
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} finally {
    if (isset($stmt)) $stmt->close();
    $conn->close();
}
exit;