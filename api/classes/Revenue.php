<?php
class Revenue
{  
	function __construct($app,$auth){
		 
	    	$app->get('/revenue', function () { 
	    		$this->getAllRevenueByEmployeeid( );
	    	});
    		$app->get('/getinvoice', function () {
    			$this->getInvoice( );
    		});
	    		
    		 
    }
   
    function getAllRevenueByEmployeeid() { 
    	$limit = " limit 20";
    	$filters = "";
    	if(isset($_GET['branchid']) && !empty($_GET['branchid'])){
    		$filters .= " and b.branchid =".$_GET['branchid'] ;
    	}
    	if(isset($_GET['franchiseid']) && !empty($_GET['franchiseid'])){
    		$filters .= " and b.franchiseid =".$_GET['franchiseid'] ;
    	}
    	if(isset($_GET['offset']) && !empty($_GET['offset'])){
    		$offset = $_GET['offset'];
    		$limit = " limit $offset,20";
    	}
    	$date = "";
    	if(isset($_GET['datesearch']) && !empty($_GET['datesearch'])){
    		$d = $_GET['datesearch'];
    		$date = explode("#",$d); 
    		$date = "  and b.dayid > $date[0] and b.dayid < $date[1]"; 
    	}
    	$sql = "select b.*,s.name as service, s.price,c.id as customerid,e.firstname,e.lastname,c.name as customer from bookings b
				inner join services s on s.id = b.serviceid
				inner join customers c on c.id = b.customerid
				left join employees e on e.id = b.employeeid
				
				where b.status = 'Completed'
				$date
				$filters
    			order by createdon desc $limit";
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
    function saveJobTypes($request){
    	 
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