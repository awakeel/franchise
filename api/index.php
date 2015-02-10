<?php
session_start();  
$path =  dirname(__FILE__) ;
require $path .'/rb.php';  
R::setup('mysql:host=localhost;dbname=franchise',
'root',''); // 
     /// R::debug( TRUE );
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
require $path .'/classes/Roles.php';
require $path .'/classes/Leaves.php';
require $path .'/classes/Booking.php';
require $path .'/classes/BookingCalender.php';
$app = new Slim(); 
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
// Section employees
$app->get('/employees', function () {
	if(authorize('user')){
		$offset = $_GET['offset'];
		getEmployees($offset);
	}
});


//$app->get('/employees', authorize('user'), 'getEmployees');
//$app->get('/languages/:id', authorize('user'),	'getLanguage');
//$app->get('/languages/:id/reports', authorize('user'),	'getReports');
//$app->get('/languages/search/:query', authorize('user'), 'getEmployeesByName');
//$app->get('/languages/modifiedsince/:timestamp', authorize('user'), 'findByModifiedDate');
// Section language end


// I add the login route as a post, since we will be posting the login form info
//$app->post('/login', 'login');

$app->run();
// api/index.php
/**
 * Quick and dirty login function with hard coded credentials (admin/admin)
 * This is just an example. Do not use this in a production environment
 */
function login() {
    if(!empty($_POST['phone']) && !empty($_POST['password'])) {
        // normally you would load credentials from a database. 
        // This is just an example and is certainly not secure
        if($_POST['phone'] == '051' && $_POST['password'] == 'admin') {
            $user = array("email"=>"admin", "firstName"=>"Clint", "lastName"=>"Berry", "role"=>"user");
            $_SESSION['user'] = $user;
            echo json_encode($user);
        }
        else {
        	$error = array("error"=> array("text"=>"You shall not pass..."));
        	echo json_encode($error);
        }
    }
    else {
	$error = array("error"=> array("text"=>"Username and Password are required."));
        echo json_encode($error);
    }
}

/**
 * Authorise function, used as Slim Route Middlewear (http://www.slimframework.com/documentation/stable#routing-middleware)
 */
function authorize($role = "user") {
    return function () use ( $role ) {
        // Get the Slim framework object
        $app = Slim::getInstance(); 
        // First, check to see if the user is logged in at all
        if(!empty($_SESSION['user'])) {
            // Next, validate the role to make sure they can access the route
            // We will assume admin role can access everything
            if($_SESSION['user']['role'] == $role || 
                $_SESSION['user']['role'] == 'admin') {
                //User is logged in and has the correct permissions... Nice!
                return true;
            }
            else {
                // If a user is logged in, but doesn't have permissions, return 403
                $app->halt(403, 'You shall not pass!');
            }
        }
        else {
            // If a user is not logged in at all, return a 401
            $app->halt(401, 'Dude, you aren\'t logged in... Please sign in?');
        }
    };
}

function getEmployees($offset) { 
	$newOffset = $offset + 10;
    $sql = "select * from employees limit $offset,$newOffset";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);
		$employees = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;

        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($employees);
        } else {
            echo $_GET['callback'] . '(' . json_encode($employees) . ');';
        }

	} catch(PDOException $e) {
		$error = array("error"=> array("text"=>$e->getMessage()));
        	echo json_encode($error);
	}
}

function getEmployee($id) {
    $sql = "select e.id, e.firstName, e.lastName, e.title, e.officePhone, e.cellPhone, e.email, e.managerId, e.twitterId, m.firstName managerFirstName, m.lastName managerLastName, count(r.id) reportCount " .
			"from employee e " .
			"left join employee r on r.managerId = e.id " .
    		"left join employee m on e.managerId = m.id " .
    		"where e.id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$employee = $stmt->fetchObject();
		$db = null;

        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($employee);
        } else {
            echo $_GET['callback'] . '(' . json_encode($employee) . ');';
        }

	} catch(PDOException $e) {
		$error = array("error"=> array("text"=>$e->getMessage()));
        	echo json_encode($error);
	}
}

function getReports($id) {

    $sql = "select e.id, e.firstName, e.lastName, e.title, count(r.id) reportCount " .
    		"from employee e left join employee r on r.managerId = e.id " .
			"where e.managerId=:id " .
    		"group by e.id order by e.lastName, e.firstName";

    try {
        $db = getConnection();
    	$stmt = $db->prepare($sql);
    	$stmt->bindParam("id", $id);
    	$stmt->execute();
    	$employees = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;

        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($employees);
        } else {
            echo $_GET['callback'] . '(' . json_encode($employees) . ');';
        }

	} catch(PDOException $e) {
		$error = array("error"=> array("text"=>$e->getMessage()));
        	echo json_encode($error);
	}
}

function getEmployeesByName($name) {
    $sql = "select e.id, e.firstName, e.lastName, e.title, count(r.id) reportCount " .
    		"from employee e left join employee r on r.managerId = e.id " .
            "WHERE UPPER(CONCAT(e.firstName, ' ', e.lastName)) LIKE :name " .
    		"group by e.id order by e.lastName, e.firstName";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$name = "%".$name."%";
		$stmt->bindParam("name", $name);
		$stmt->execute();
		$employees = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;

        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($employees);
        } else {
            echo $_GET['callback'] . '(' . json_encode($employees) . ');';
        }

	} catch(PDOException $e) {
		$error = array("error"=> array("text"=>$e->getMessage()));
        	echo json_encode($error);
	}
}

function getModifiedEmployees($modifiedSince) {
    if ($modifiedSince == 'null') {
        $modifiedSince = "1000-01-01";
    }
    $sql = "select * from employee WHERE lastModified > :modifiedSince";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("modifiedSince", $modifiedSince);
		$stmt->execute();
		$employees = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;

        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($employees);
        } else {
            echo $_GET['callback'] . '(' . json_encode($employees) . ');';
        }

	} catch(PDOException $e) {
		$error = array("error"=> array("text"=>$e->getMessage()));
        	echo json_encode($error);
	}
}

//function getLanguages($offset) { 
//	$newOffset = $offset + 10;
//    $sql = "select * from language limit $offset,$newOffset";
//	try {
//		$db = getConnection();
//		$stmt = $db->query($sql);
//		$languages = $stmt->fetchAll(PDO::FETCH_OBJ);
//		$db = null;
//
//        // Include support for JSONP requests
//        if (!isset($_GET['callback'])) {
//            echo json_encode($languages);
//        } else {
//            echo $_GET['callback'] . '(' . json_encode($languages) . ');';
//        }
//
//	} catch(PDOException $e) {
//		$error = array("error"=> array("text"=>$e->getMessage()));
//        	echo json_encode($error);
//	}
//}

function getConnection() {
	$dbhost="localhost";
	$dbuser="root";
	$dbpass=""; 
	$dbname="franchise";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

//$app->get('/employees', authorize('user'), 'getEmployees');
$app->get('/employees/:id', authorize('user'),	'getEmployee');
$app->get('/employees/:id/reports', authorize('user'),	'getReports');
$app->get('/employees/search/:query', authorize('user'), 'getEmployeesByName');
$app->get('/employees/modifiedsince/:timestamp', authorize('user'), 'findByModifiedDate');
// Section Employee end

//object of langauge class
//$language_obj = new Language();
//$language_obj->getLanguages(0);
?>