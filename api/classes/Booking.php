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
	    	$app->post('/bookings',function(){
	    		$request = Slim::getInstance()->request();
	    		$this->saveBooking($request);
	    	});
	 }
	 function getAllBookings() {
	 	$branchid = @$_GET['branchid'];
	 	$search = @$_GET['search'];
	 	if(isset($search) && !empty($search)){
	 		$search = " and (  s.name  like '%".$search."%' or b.title  like '%".$search."%')";
	 	}
	  	$sql = " SELECT b.*,e.firstname as emp, c.name AS customer, s.name AS service FROM bookings b
					INNER JOIN branches br ON br.id = b.`branchid`
					INNER JOIN services s ON s.id = b.`serviceid`
					LEFT JOIN employees e ON e.id = b.`employeeid`
					INNER JOIN customers c ON c.id = b.`customerid`
					WHERE b.branchid = $branchid  $search order by b.createdon";
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
	 			$customerid = $this->saveCustomer($params->customername,$params->email,$params->phone,$params->branchid,$params->franchiseid);
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
	 	$customer->name = $name;
	 	$customer->email = $email;
	 	$customer->phone = $phone;
	 	$customer->createdon = R::isoDate();
	 	$customer->branchid = $branchid;
	 	$customer->franchiseid = $franchiseid;
	 	$id = R::store($customer);
	 	return $id;
	 }
	 function deleteJobTypes(){
	 	$id = $_GET['id'];
	 	$sql = "delete from jobtypes where id=$id";
	 
	 	try {
	 		$jobtypes = R::exec($sql);
	 		echo json_encode($id);
	 	} catch(Exception $e) {
	 		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
	 		echo json_encode(['error'=>'Integrity constraint'] );
	 	}
	 }
	
}