<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Set JSON header
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Validate request method IMMEDIATELY
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'message' => 'POST method required.']);
    exit;
}
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "sim_transfer_db";
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// handling the file upload
function uploadFile($file, $targetDir) {
    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('File upload error: ' . $file['error']);
    }
    
    // Validate file size (5MB max)
    $maxSize = 5 * 1024 * 1024; // 5MB
    if ($file['size'] > $maxSize) {
        throw new Exception('File exceeds maximum size of 5MB.');
    }
    
    // Validate file type (JPEG, PNG, PDF)
    $allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    $fileType = mime_content_type($file['tmp_name']);
    if (!in_array($fileType, $allowedTypes)) {
        throw new Exception('Invalid file type. Only JPEG, PNG, and PDF are allowed.');
    }
    
    //filename
    $fileName = basename($file['name']);
    $fileName = preg_replace('/[^a-zA-Z0-9._-]/', '', $fileName); 
    $targetFilePath = $targetDir . $fileName;
    
    // moving the upload to correct directory
    if (!move_uploaded_file($file['tmp_name'], $targetFilePath)) {
        throw new Exception('Failed to move uploaded file.');
    }
    
    return $targetFilePath;
}

try {
    // Validation
    $requiredFields = [
        'simNumber', 'currentName', 'currentNameNepali', 'currentFather', 'currentMother',
        'currentCitizenshipNo', 'currentCitizenshipDistrict', 'currentCitizenshipDate',
        'currentPhone', 'currentEmail', 'currentProvince', 'currentDistrict', 'currentMunicipality',
        'currentWard', 'newName', 'newNameNepali', 'newFather', 'newMother', 'newCitizenshipNo',
        'newCitizenshipDistrict', 'newCitizenshipDate', 'newPhone', 'newEmail', 'newProvince',
        'newDistrict', 'newMunicipality', 'newWard', 'terms'
    ];
    
    foreach ($requiredFields as $field) {
        if ($field === 'terms') {
            if (!isset($_POST[$field])) {
                throw new Exception("You must agree to the terms and conditions.");
            }
        } else {
            if (empty($_POST[$field])) {
                throw new Exception("Missing required field: $field");
            }
        }
    }
    
    // Validating phone numbers
    $phones = [
        'currentPhone' => $_POST['currentPhone'],
        'newPhone' => $_POST['newPhone']
    ];
    foreach ($phones as $key => $phone) {
        if (!preg_match('/^(98|97)\d{8}$/', $phone)) {
            throw new Exception("Invalid $key format. Phone number must be 10 digits starting with 98 or 97.");
        }
    }
    // Validating emails
    $emails = [
        'currentEmail' => $_POST['currentEmail'],
        'newEmail' => $_POST['newEmail']
    ];
    foreach ($emails as $key => $email) {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception("Invalid $key format.");
        }
    }
    
    // Handle file uploads
    $targetDir = "uploads/";
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0777, true);
    }
    
    $currentCitizenshipFront = uploadFile($_FILES['currentCitizenshipFront'], $targetDir);
    $currentCitizenshipBack = uploadFile($_FILES['currentCitizenshipBack'], $targetDir);
    $currentPhoto = uploadFile($_FILES['currentPhoto'], $targetDir);
    $newCitizenshipFront = uploadFile($_FILES['newCitizenshipFront'], $targetDir);
    $newCitizenshipBack = uploadFile($_FILES['newCitizenshipBack'], $targetDir);
    $newPhoto = uploadFile($_FILES['newPhoto'], $targetDir);
    
    // generating unique reference number
    function generateReference() {
        return 'REF-' . strtoupper(bin2hex(random_bytes(4)));
    }
    
    $refNumber = generateReference();
    
    
    // inserting data to the table (db)
    $sql = "INSERT INTO sim_transfer (
        refrence_no,sim_number, current_name, current_name_nepali, current_father, current_mother,
        current_citizenship_no, current_citizenship_district, current_citizenship_date,
        current_phone, current_email, current_province, current_district, current_municipality,
        current_ward, new_name, new_name_nepali, new_father, new_mother, new_citizenship_no,
        new_citizenship_district, new_citizenship_date, new_phone, new_email, new_province,
        new_district, new_municipality, new_ward, current_citizenship_front, current_citizenship_back,
        current_photo, new_citizenship_front, new_citizenship_back, new_photo, status, details
    ) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
    
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception('Failed to prepare SQL statement: ' . $conn->error);
    }
    $status = "Pending"; // Default status
$details = "Application submitted successfully."; // Default details
    
    $stmt->bind_param(
        'ssssssssssssssssssssssssssssssssssss',
        $refNumber, $_POST['simNumber'], $_POST['currentName'], $_POST['currentNameNepali'], $_POST['currentFather'],
        $_POST['currentMother'], $_POST['currentCitizenshipNo'], $_POST['currentCitizenshipDistrict'],
        $_POST['currentCitizenshipDate'], $_POST['currentPhone'], $_POST['currentEmail'],
        $_POST['currentProvince'], $_POST['currentDistrict'], $_POST['currentMunicipality'],
        $_POST['currentWard'], $_POST['newName'], $_POST['newNameNepali'], $_POST['newFather'],
        $_POST['newMother'], $_POST['newCitizenshipNo'], $_POST['newCitizenshipDistrict'],
        $_POST['newCitizenshipDate'], $_POST['newPhone'], $_POST['newEmail'], $_POST['newProvince'],
        $_POST['newDistrict'], $_POST['newMunicipality'], $_POST['newWard'], $currentCitizenshipFront,
        $currentCitizenshipBack, $currentPhoto, $newCitizenshipFront, $newCitizenshipBack, $newPhoto, $status, $details
    );
    
    if (!$stmt->execute()) {
        throw new Exception('Failed to execute SQL statement: ' . $stmt->error);
    }
    
    // correct success
    echo json_encode([
        'success' => true,
        'message' => 'Form submitted successfully',
         'refrence_no' => $refNumber]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} finally {
    if (isset($stmt)) $stmt->close();
    $conn->close();
}
exit;