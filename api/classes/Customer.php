<?php
class Customers
{  
	function __construct($app,$auth){
		 
		    	$app->get('/customers', function () { 
		    		$this->getAllCustomers( );
		    	});
	    		$app->post('/customers',function(){
		    		$request = Slim::getInstance()->request();
		    		$this->saveCustomer1($request);
	    		});
    			$app->get('/bookingbyid', function () {
    				$this->getAllBookings();
    			});
    			$app->post('/savcustomer1', function () {
    				$this->saveCustomer();
    			});
    			$app->post('/changebooking', function () {
    				$this->changeBooking();
    			});
    			$app->get('/getallcomments', function () {
    				$this->getAllComments();
    			});
    			$app->get('/getcustomersbytext', function () {
    				$this->getAllCustomersByText();
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
   
    function getAllCustomers() { 
    	$limit = " limit 20";
    	$filters = "";
    	if(isset($_GET['franchiseid']) && !empty($_GET['franchiseid'])){
    		$filters .= " where c.franchiseid =".$_GET['franchiseid'] ;
    	}
    	if(isset($_GET['branchid']) && !empty($_GET['branchid'])){
    		$filters .= " and c.branchid =".$_GET['branchid'] ;
    	}
    	
    	if(isset($_GET['offset']) && !empty($_GET['offset'])){
    		$offset = $_GET['offset'];
    		$limit = " limit $offset,20";
    	}
    	if(@$_GET['search'] !=''){
    		$search = $_GET['search'];
    		$filters .=  "  AND  (c.name LIKE '%". $search ."%' OR c.phone LIKE '%". $search ."%' OR c.email LIKE '%". $search ."%')";
    	}
    	$type = "";
    	if(isset($_GET['type']) && !empty($_GET['type'])){
    		$d = $_GET['type'];
    		if($d == "1"){
    			$filters .= " and (c.name <> '' and c.phone <> '' and c.email <> '')";
    		}  
    		 
    	}
    	$sql = "select * from customers c
				 
				$type
				$filters
    			order by createdon desc $limit";
    	 
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
    function getInvoice() {
 		$bookingid = $_GET['bookingid'];    
    	$sql = "select b.*,s.name as service, s.price , c.name as customer,c.email,c.phone from bookings b
			inner join services s on s.id = b.serviceid
			inner join customers c on c.id = b.customerid
    	 	
    	where b.id = $bookingid";
    	try {
    		$tasks = R::getAll($sql);
    		if (!isset($_GET['callback'])) {
    			echo json_encode($tasks);
    		} else {
    			echo $_GET['callback'] . '(' . json_encode($types) . ');';
    		}
    	} catch(PDOException $e) {
    		$error = array("error"=> array("text"=>$e->getMessage()));
    		echo json_encode($error);
    	}
    }
    function saveCustomer1($request){
    	 
    		$params = json_decode($request->getBody());
    		try {
	    		if(isset($params->id) && !empty($params->id)){
	    			$customers = R::dispense( 'customers' );
	    			$customers->id = $params->id;
	    			$customers->name = $params->name;
	    			$customers->email = $params->email;
	    			$customers->phone = $params->phone; 
	    			
	    			$id = R::store($customers);
	    		}else{
	    			$jobtypes = R::dispense( 'jobtypes' );
	    			 $jobtypes->name = $params->name;
	    			 $jobtypes->color = $params->color;
	    			 $jobtypes->comments = $params->comments;
	    			 $jobtypes->franchiseid = $params->franchiseid;
	    			 $jobtypes->createdon = R::isoDate();
	    			 $jobtypes->isdeleted = 0;
	    			 $jobtypes->isactivated = 0;
	    			 $jobtypes->createdby = $params->franchiseid;
	    			 $id = R::store($jobtypes);
	    		}
    		  		echo json_encode($params);
    		 } catch(PDOException $e) {
    			  echo '{"error":{"text":'. $e->getMessage() .'}}';
    		 }
    		 
    	 
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
    	 	function getAllCustomersByText() {
    	$branchid = @$_GET['branchid'];
    	$search = "";
    	if(isset($_GET['phone']) && !empty($_GET['phone'])){
    			$search =" and phone like '%".$_GET['phone']."%'";
    	}
    					if(isset($_GET['email']) && !empty($_GET['email'])){
    	 			$search = "  and email like '%".$_GET['email']."%'";
    	}
    	 					if(isset($_GET['name']) && !empty($_GET['name'])){
    	 							$search = " and name like '%".$_GET['name']."%'";
    	}
    	 									$sql = " select * from customers where phone <> '' and name <> '' and email <> '' $search
    	 									and branchid = $branchid
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
    			 		$sql = "select b.*,c.*,c.id as customerid,c.isregistered,s.name as service,br.name AS branch, ifnull(e.firstname,'Not Assign') as employee,j.name as jobtype,s.price from bookings b
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
			$text = "Booking of customer id".$_POST['customerid']." has been changed  <strong style='color:green'>".$_POST['title']."</strong>";
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
?>