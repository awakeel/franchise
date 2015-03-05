<?php
class Customer{
	 
	function __construct($app){
    	$this->branchid = @$_SESSION['branchid'];
			    	$app->get('/bookingbyid', function () { 
			    		$this->getAllBookings();
			    	});
		    		$app->post('/savcustomer', function () {
		    			$this->saveCustomer();
		    		});
	    			$app->post('/changebooking', function () {
	    				$this->changeBooking();
	    			});
	    			$app->get('/getallcomments', function () {
	    				$this->getAllComments();
	    			});
	    				$app->get('/getalllogs', function () {
	    					$this->getAllLogs();
	    				});
	    			$app->get('/getallhistory', function () {
	    				$this->getAllHistory();
	    			});
	    			$app->post('/savecomments', function () {
	    				$this->saveCustomerComments();
	    			});
	 }
	 function getAllBookings() {
	 	$branchid = @$_GET['branchid'];
	 	$bookingid = @$_GET['bookingid'];
	  	$sql = "select b.*,c.*,b.id as bookingid,c.id as customerid,s.name as service,br.name AS branch, ifnull(e.firstname,'Not Assign') as employee,j.name as jobtype,s.price from bookings b
	  			inner join customers c on c.id = b.customerid
	  			inner join services s on s.id = b.serviceid
	  			left join jobtypes j on j.id = b.jobtypeid
	  			inner join branches br on br.id = b.branchid
	  			left join employees e on e.id = b.employeeid
	  			where b.id = $bookingid and b.branchid = $branchid
	  			";
	 	try {
	 		$bookings = R::getAll($sql); 
	 		if (!isset($_GET['callback'])) {
	 			echo json_encode($bookings);
	 		} else {
	 			echo $_GET['callback'] . '(' . json_encode($bookings) . ');';
	 		}
	 	} catch(PDOException $e) {
	 		$error = array("error"=> array("text"=>$e->getMessage()));
	 		echo json_encode($error);
	 	}
	 }
	 function getAllComments() {
	 	$customerid = @$_GET['customerid']; 
	 	$sql = "select * from comments
	 	where customerid = $customerid   ORDER BY createddate DESC
	 	";
	 	try {
			 	$comments = R::getAll($sql);
			 	if (!isset($_GET['callback'])) {
			 			echo json_encode($comments);
			 	} else {
			 	echo $_GET['callback'] . '(' . json_encode($comments) . ');';
	 		}
	 	} catch(PDOException $e) {
	 		$error = array("error"=> array("text"=>$e->getMessage()));
	 			echo json_encode($error);
	 	  }
	 	}
	 	function getAllLogs() {
	 		$bookingid = @$_GET['bookingid'];
	 		$sql = "select * from bookinglogs
	 		where bookingid = $bookingid   ORDER BY createdon DESC
	 		"; 
	 		try {
		 		$bookings = R::getAll($sql);
		 		if (!isset($_GET['callback'])) {
		 				echo json_encode($bookings);
		 		} else {
		 		echo $_GET['callback'] . '(' . json_encode($bookings) . ');';
	 		}
	 		} catch(PDOException $e) {
		 		$error = array("error"=> array("text"=>$e->getMessage()));
		 		echo json_encode($error);
	 			}
	 		}
	 	function getAllHistory() {
	 		$branchid = @$_GET['branchid'];
	 	$customerid = @$_GET['customerid'];
	  	$sql = "select b.*,c.*,c.id as customerid,s.name as service,br.name AS branch, ifnull(e.firstname,'Not Assign') as employee,j.name as jobtype,s.price from bookings b
	  			inner join customers c on c.id = b.customerid
	  			inner join services s on s.id = b.serviceid
	  			left join jobtypes j on j.id = b.jobtypeid
	  			inner join branches br on br.id = b.branchid
	  			left join employees e on e.id = b.employeeid
	  			where b.customerid = $customerid and b.branchid = $branchid
	  			";
	 		try {
	 		$customers = R::getAll($sql);
	 		if (!isset($_GET['callback'])) {
	 		echo json_encode($customers);
	 		} else {
	 		echo $_GET['callback'] . '(' . json_encode($customers) . ');';
	 		}
	 		} catch(PDOException $e) {
	 		$error = array("error"=> array("text"=>$e->getMessage()));
	 				echo json_encode($error);
	 		}
	 		}
	 function saveCustomer(){
	 
	 	$id = @$_POST['id'];
	 	$name = @$_POST['name'];
	 	$email = @$_POST['email'];
	 	$phone = @$_POST['phone'];
	 	try {
	 		 
	 			$customer = R::dispense( 'customers' );
	 			$customer->id= $id;
	 			$customer->name = $name;
	 			$customer->email = $email;
	 			$customer->phone = $phone;
	 			$id = R::store($customer);
	 		 
	 		echo json_encode($id);
	 	} catch(PDOException $e) {
	 		echo '{"error":{"text":'. $e->getMessage() .'}}';
	 	}
	 	 
	 
	 }
	 function changeBooking(){
	 	$id = @$_POST['id'];
	 	$bookingid = @$_POST['bookingid'];
	 	$type = @$_POST['type'];
	 	
	 	try {
	 		$bookings = R::dispense( 'bookings' );
	 		$bookings->id= $bookingid;
			if($type=="employees"){
				$bookings->employeeid = $id;
			}else{
				$bookings->serviceid = $id;
				
			} 
			$title = "Booking ".$type . " changed";
			$text = "Booking of customer id".$_POST['customerid']." has been changed";
	 		$id = R::store($bookings);
	 		$this->saveLogs($_POST['customerid'],$_POST['bookingid'],$title,$text,$_POST['franchiseid'],$_POST['branchid']);
	 		echo json_encode($id);
	 	} catch(PDOException $e) {
	 		echo '{"error":{"text":'. $e->getMessage() .'}}';
	 	}
	 
	 
	 }
	 
	 function saveLogs($customerid,$bookingid,$title,$text,$franchiseid,$branchid){
	 	try {
	 		
	 		$logs = R::dispense( 'bookinglogs' );
	 		$logs->customerid = $customerid;
	 		$logs->branchid = $branchid;
	 		$logs->franchiseid = $franchiseid;
	 		$logs->bookingid = $bookingid;
	 		$logs->title = $title;
	 		$logs->text = $text;
	 		$logs->createdon = R::isoDateTime();
	 		$id = R::store($logs);
	 		echo json_encode($id);
	 	} catch(PDOException $e) {
	 		echo '{"error":{"text":'. $e->getMessage() .'}}';
	 	}
	 
	 
	 }
	 function saveCustomerComments(){
	 
	 	$id = @$_POST['customerid'];
	 	$comments = @$_POST['comments']; 
	 	$sql = "insert into comments (customerid,comments,createddate) values(:c,:cm,now())";
	 	try {
	 	 	
	 		  $db = getConnection();
				$stmt = $db->prepare($sql);
				$stmt->bindParam("c", $id);
				$stmt->bindParam("cm", $comments); 
				$id = $stmt->execute();
	 	 	
	 		echo json_encode($id);
	 	} catch(PDOException $e) {
	 		echo '{"error":{"text":'. $e->getMessage() .'}}';
	 	}
	 
	 
	 }
	
}