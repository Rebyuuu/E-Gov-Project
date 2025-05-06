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
$sql = "SELECT 
          refrence_no, 
          new_photo,  // Ensure this column exists in your DB
          sim_number,
          current_name,
          new_name,
          // ... (include all other required columns)
        FROM sim_transfer 
        WHERE refrence_no = ?";
try {
    // validating reference number
    if (!isset($_GET['refNumber']) || empty($_GET['refNumber'])) {
        throw new Exception('Reference number is required.');
    }

    $refNumber = $_GET['refNumber'];

    // get the application details
    $sql = "SELECT * FROM sim_transfer WHERE refrence_no = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception('Failed to prepare SQL statement: ' . $conn->error);
    }

    $stmt->bind_param('s', $refNumber);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        throw new Exception('No application found with the provided reference number.');
    }

    $application = $result->fetch_assoc();
    echo json_encode([
        'success' => true,
        'application' => $application
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} finally {
    if (isset($stmt)) $stmt->close();
    $conn->close();
}
exit;