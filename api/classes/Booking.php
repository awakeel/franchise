<?php
class Booking{
	 
	function __construct($app){
    	$this->branchid = @$_SESSION['branchid'];
	    	$app->get('/bookings', function () { 
	    		$this->getAllBookings();
	    	});
    		$app->get('/employeesgetall', function () {
    			$this->getAll(1);
    		});
    			$app->get('/getsms', function () {
    				$this->getallSMS();
    			});
	    	$app->post('/bookings',function(){
	    		$request = Slim::getInstance()->request();
	    		$this->saveBooking($request);
	    	});
	    		$app->post('/sendsms', function () {
	    			$this->sendSMS();
	    		});
	    		$app->get('/deletebooking',function(){
	    			 
	    			$this->deleteBooking( );
	    		});
	    			$app->get('/bookingstatuschange',function(){
	    				 
	    				$this->changeStatusBooking( );
	    			});
	    			
	    		
	 }
	 function SendActuallSMS(){
	 	 
	 	$user = "yaredev";
	 	$password = "UeYSBEWVEXfYda";
	 	$api_id = "3533683";
	 	$baseurl ="http://api.clickatell.com";
	 	
	 	$text = urlencode("This is an example message");
	 	$to = "00923365648162";
	 	
	 	// auth call
	 	$url = "$baseurl/http/auth?user=$user&password=$password&api_id=$api_id";
	 	
	 	// do auth call
	 	$ret = file($url);
	 	
	 	// explode our response. return string is on first line of the data returned
	 	$sess = explode(":",$ret[0]);
	 	if ($sess[0] == "OK") {
	 	
	 		$sess_id = trim($sess[1]); // remove any whitespace
	 		$url = "$baseurl/http/sendmsg?session_id=$sess_id&to=$to&text=$text";
	 	
	 		// do sendmsg call
	 		$ret = file($url);
	 		$send = explode(":",$ret[0]);
	 	
	 		if ($send[0] == "ID") {
	 			echo json_encode("successnmessage ID: ". $send[1]);
	 		} else {
	 			echo json_encode($send);
	 		}
	 	} else {
	 		echo json_encode("Authentication failure: ". $ret[0]);
	 	}
	 
	 }
 	  function sendSMS(){ 
    	 $customerid = @$_POST['customerid'];
    	 $text = @$_POST['text'];
    	 $bookingid = @$_POST['bookingid'];
    	 $email = @$_POST['email'];
    	  try { 
	 		$bookingsms = R::dispense( 'bookingsms' );
	 			 $bookingsms->customerid = $customerid;
	 			$bookingsms->bookingid = $bookingid
	 			;
	 			$bookingsms->email = $email;
	 			$bookingsms->text = $text; 
	 			$bookingsms->createdon = R::isoDateTime();
	 			$id = R::store($bookingsms);
    	   } catch(PDOException $e) {
    		 echo '{"error":{"text":'. $e->getMessage() .'}}';
    	   } 
    	   $this->SendActuallSMS();
    	 }
    	 function savePackage(){
    	 	$franchiseid = @$_POST['franchiseid'];
    	 	$sql = "UPDATE franchises SET noofsms = noofsms - 1 WHERE id = $franchiseid";
    	 	 
    	 	try {
    	 		R::exec($sql);
    	 		echo json_encode(1);
    	 	} catch(Exception $e) {
    	 		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    	 		echo json_encode(['error'=>$e->getMessage()]);
    	 	}
    	 	$this->savePackageHistory();
    	 
    	 }
    	 function getAllSMS() {
    	 	$bookingid = @$_GET['bookingid'];
    	 	$sql = "select * from bookingsms where bookingsms.bookingid = $bookingid order by createdon desc";
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
    	  
	 function getAllBookings() {
	 	$branchid = @$_GET['branchid'];
	 	$search = @$_GET['search'];
	 	if(isset($search) && !empty($search)){
	 		$search = " and (  s.name  like '%".$search."%' or b.title  like '%".$search."%')";
	 	}
	 	$today = "";
	 	if(isset($_GET['today']) && !empty($_GET['today'])){
	 		$today = $_GET['today'];
	 		$day = date("Ymd");
	 		$today = " and b.dayid = ".$day;
	 	}
	 	$customerid = "";
	 	if(isset($_GET['customer']) && !empty($_GET['customer'])){
	 		$customerid = $_GET['customer'];
	 		$customerid = " and b.customerid = ".$customerid;
	 	}
	 	$limit = " limit 20";
	 	if(isset($_GET['offset']) && !empty($_GET['offset'])){
	 		$offset = $_GET['offset'];
	 		$limit = " limit $offset,20";
	 	}
	  	$sql = " SELECT  b.*,j.name as jobtype, Ifnull(e.firstname, 'None') as emp, ifNull(c.name,'Anonymous') AS customer,c.id as customerid, s.name AS service FROM bookings b
					INNER JOIN branches br ON br.id = b.`branchid`
					INNER JOIN services s ON s.id = b.`serviceid`
					inner join jobtypes j on j.id = b.jobtypeid
					LEFT JOIN employees e ON e.id = b.`employeeid`
					INNER JOIN customers c ON c.id = b.`customerid`
					WHERE b.branchid = $branchid $today  $search $customerid order by b.dayid desc $limit";
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
	  
	 function saveBooking($request){
	 
	 	$params = json_decode($request->getBody());
	 	try {
	 		if(isset($params->id) && !empty($params->id)){
	 			$jobtypes = R::dispense( 'jobtypes' );
	 			$jobtypes->id = $params->id;
	 			$jobtypes->name = $params->name;
	 			$jobtypes->color = $params->color;
	 			$jobtypes->comments = $params->comments;
	 			$jobtypes->franchiseid = $params->franchiseid; 
	 			$id = R::store($jobtypes);
	 		}else{
	 			$customerid = 0;
	 			if(isset($params->customerid) && !empty($params->customerid)){
	 			  $customerid = $params->customerid;
	 			}else{
	 				$customerid = $this->saveCustomer($params->customername,$params->email,$params->phone,$params->branchid,$params->franchiseid);
	 			}
	 			$booking = R::dispense('bookings');
	 			$booking->title = $params->title;
	 			$booking->employeeid = $params->employeeid;
	 			$booking->jobtypeid = $params->jobtypeid;
	 			$booking->branchid = $params->branchid;
	 			$booking->franchiseid = $params->franchiseid;
	 			$booking->serviceid = $params->serviceid;
	 			$booking->timestart = $params->timestart;
	 			$booking->timeend = $params->timeend;
	 			$booking->bookingtype = $params->bookingtype;
	 			$booking->price = $params->price;
	 			$booking->dayid = $params->dayid;
	 			$booking->customerid = $customerid;
	 			$booking->status = $params->status; 
	 			$booking->createdon = R::isoDate();
	 			$booking->isdeleted = 0;
	 			$booking->isactivated = 0;
	 			$booking->createdbyid = $params->franchiseid;
	 			$id = R::store($booking); 
	 		}
	 		 echo json_encode($params);
	 	} catch(PDOException $e) {
	 		 echo '{"error":{"text":'. $e->getMessage() .'}}';
	 	}
	 	 
	 
	 }
	 function saveCustomer($name,$email,$phone,$branchid,$franchiseid){
	 	$customer = R::dispense( 'customers' );
	 	if(empty($name) && empty($name) && empty($name)){
	 		$customer->createdon = R::isoDate();
	 		$customer->branchid = $branchid;
	 		$customer->franchiseid = $franchiseid;
	 		$customer->isregistered= 0;
	 	}else{
	 		$customer->name = $name;
	 		$customer->email = $email;
	 		$customer->phone = $phone;
	 		$customer->createdon = R::isoDate();
	 		$customer->branchid = $branchid;
	 		$customer->franchiseid = $franchiseid;
	 		$customer->isregistered= 1;
	 	}
	 	
	 	$id = R::store($customer);
	 	return $id;
	 }
	 function changeStatusBooking(){
	 	if($this->getBookingById($_GET['id']) == "0" && $_GET['status'] == "Completed"){
	 		echo json_encode(array("isemployee"=>0));
	 		return 0 ;
	 	}
	 	$customer = R::dispense( 'bookings' );
	 	$customer->status = $_GET['status'];
	 	$customer->id = $_GET['id'];
	 	$id = R::store($customer);
	 	echo json_encode($id);
	 } 
	 function getBookingById( $id){
	 	$search = "";
	 	try {
	 
	 		$bookings =  R::getCol( 'SELECT employeeid FROM bookings WHERE id = :id',
	 				[':id' => $id]
	 		);
	 		return $bookings[0];
	 		 
	 	} catch(PDOException $e) {
	 		$error = array("error"=> array("text"=>$e->getMessage()));
	 		echo json_encode($error);
	 	}
	 }
	 function deleteBooking(){
	 	$id = $_GET['id'];
	 	$sql = "delete from bookings where id=$id";
	 
	 	try {
	 		$jobtypes = R::exec($sql);
	 		echo json_encode($id);
	 	} catch(Exception $e) {
	 		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
	 		echo json_encode(['error'=>'Integrity constraint'] );
	 	}
	 }
	
}