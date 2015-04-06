<?php
///header('Content-Type: text/html; charset=UTF-8');
session_start();  
$path =  dirname(__FILE__) ;
require $path .'/rb.php';  

R::setup('mysql:host=localhost;dbname=franchise',
'root',''); // 
     //     R::debug( TRUE );
require $path .'/Slim/Slim.php'; 
require $path .'/classes/Common.php';
require $path.'/classes/Language.php';
require $path .'/classes/Employees.php';
require $path .'/classes/JobTypes.php';
require $path .'/classes/Branches.php';
require $path .'/classes/Services.php';
require $path .'/classes/Authorize.php';
require $path .'/classes/Permission.php';
require $path .'/classes/Schedule.php';
require $path .'/classes/Customer.php';
require $path .'/classes/Roles.php';
require $path .'/classes/Leaves.php';
require $path .'/classes/Booking.php';
require $path .'/classes/BookingCalender.php';
require $path .'/classes/Tasks.php';
require $path .'/classes/Revenue.php'; 
require $path .'/classes/Products.php';
$app = new Slim();   
//$app->contentType('charset=utf-8');
$auth = new Authorize($app);
$permission = new Permission($app,$auth);

//$app->add(new \ContentTypes());
//$app->add(new \Slim\Middleware\ContentTypes());
$objCommon = new Common($app);
$objLanguages = new Language($app);
$objJobTypes = new JobTypes($app,$auth);
$objServices = new Services($app);
$objEmployees = new Employees($app);
$objBranches = new Branches($app,$auth);
$objSchedule = new Schedule($app);
$objBooking = new Booking($app);
$objBookingCal = new BookingCalender($app);
$objRoles = new Roles($app,$auth);
$objLeaves = new Leaves($app,$auth);
$objCustomer = new Customers($app,$auth);
$objTasks = new Tasks($app,$auth);
$objRevenue = new Revenue($app,$auth);
$objProducts = new Products($app,$auth);

$app->run(); 

function getConnection() {
	$dbhost="localhost";
	$dbuser="root";
	$dbpass=""; 
	$dbname="franchise";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	
	 $dbh -> exec("set names utf8");     // works in old versions of PHP (< 5.2)
	 
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
	return $dbh;
} 
?>