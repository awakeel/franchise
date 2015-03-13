<?php
class Employees
{ 
	public $branchid;
    // method declaration
    function __construct($app){
    	$this->branchid = @$_SESSION['branchid'];
	    	$app->get('/employees', function () { 
	    		$this->getAllByBranchId(1);
	    	});
    		$app->get('/employeesgetall', function () {
    			$this->getAll(1);
    		});
	    	$app->post('/employees',function(){
	    		$request = Slim::getInstance()->request();
	    		$this->saveEmployee($request);
	    	});
	    		$app->get('/saveemployeetiming',function(){
	    		 
	    			$this->doLogic();
	    		});
    		$app->get('/deleteemployees',function(){
    			$request = Slim::getInstance()->request();
    			$this->deleteEmployee($request);
    		});
    		$app->get('/employeebyid',function(){
    			$this->getEmployeesByJobTypeId();
    		});
    		$app->get('/employeetimings',function(){
    				$request = Slim::getInstance()->request();
    				$employeeid = 0;
    				if(isset($_GET['id']))
    					$employeeid = $_GET['id'];
    				$this->getTimings($employeeid);
    		});
    }
    function getAll( ) {  
        $sql = "select concat(e.firstname , '   ' , e.lastname) as name ,e.id,e.picture from employees e
        		left join employeedepartments ed on ed.employeeid = e.id
        		where ed.branchid =".$_GET['branchid']." group by e.id";
            try {
                    $db = getConnection();
                    $stmt = $db->query($sql);
                    $branches = $stmt->fetchAll(PDO::FETCH_OBJ);
                    $db = null;

            // Include support for JSONP requests
            if (!isset($_GET['callback'])) {
                echo json_encode($branches);
            } else {
                echo $_GET['callback'] . '(' . json_encode($branches) . ');';
            }

            } catch(PDOException $e) {
                    $error = array("error"=> array("text"=>$e->getMessage()));
                    echo json_encode($error);
            }
    }
    function getTimings( $id) {
    	 
    	try {
    		$sql = 'SELECT * FROM employeetimings
			    	   WHERE employeeid = "'.$id.'" order by opened asc';
    		$rows = R::getAll($sql);
    		// $authors = R::convertToBeans('timings',$rows);
    		if (!isset($_GET['callback'])) {
    			echo json_encode($rows);
    		} else {
    			echo $_GET['callback'] . '(' . json_encode($rows) . ');';
    		}
    
    	} catch(PDOException $e) {
    		$error = array("error"=> array("text"=>$e->getMessage()));
    		echo json_encode($error);
    	}
    }
    function getEmployeesByJobTypeId( ) {
        if(isset($_GET['branchid']) && !empty($_GET['branchid'])){
    		$branchid = $_GET['branchid'];
    		 
    	}else{
    		$branchid = $this->branchid;
    	}
    	if(isset($_GET['jobtypeid']) && !empty($_GET['jobtypeid'])){
    		$jobtypeid = $_GET['jobtypeid'];
    	}
    	$sql = "select e.* from employees e left join employeejobtypes ej on ej.employeeid = e.id
    	 where e.branchid = $this->branchid and ej.jobtypeid = $jobtypeid" ;
    	try {
    		  $db = getConnection();
                    $stmt = $db->prepare($sql);
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
    function getAllByBranchId() { 
    	$search = "";
	    	if(@$_GET['search'] !=''){
	    		$search = $_GET['search'];
	    		$search =  "  AND  (e.firstname LIKE '%". $search ."%' OR e.lastname LIKE '%". $search ."%' OR e.phone LIKE '%". $search ."%' OR e.lastname LIKE '%". $search ."%')";
	    	} 
    	    $branchid ="";
	    	if(isset($_GET['branchid']) && !empty($_GET['branchid'])){
	    		$branchid = $_GET['branchid'];
	    		$branchid = " AND ed.branchid =".$branchid;
	    	}
             $sql = "select e.*,  role.name as role, group_concat(DISTINCT j.name separator ',') as jobtypes from employees e
				
             	left join employeedepartments ed on ed.employeeid = e.id
             	left join role on role.id = ed.roleid
				left join employeejobtypes ej on ej.employeeid = e.id
				left join jobtypes j on j.id = ej.jobtypeid
        		where  e.franchiseid = ".$_SESSION['franchiseid']. $branchid.$search."
        	 	group by e.id 
        		order by id desc ";
            try {
                   	$employees = R::getAll($sql);

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
     
    function saveEmployee($request){
    	 
    		$params = json_decode($request->getBody());
    		
    		try {
    			if(isset($params->id) && !empty($params->id)){
    				$employees = R::dispense( 'employees' );
    				$employees->id = $params->id;
    				$employees->firstname = $params->firstname;
    				$employees->lastname = $params->lastname;
    				$employees->email = $params->email;
    				$employees->password = $params->password;
    				$employees->address = $params->address;
    				$employees->about = $params->about;
    				$employees->type = $params->type;
    				$employees->phone = $params->phone;
    				//$employees->isactivated = 1;
    				///$employees->roleid = $params->roleid;
    				$employees->franchiseid = $params->franchiseid; 
    				$id = R::store($employees);
    				echo json_encode($params);
    			}else{
    				$employees = R::dispense( 'employees' ); 
    				$employees->firstname = $params->firstname;
    				$employees->lastname = $params->lastname;
    				$employees->email = $params->email;
    				$employees->password = $params->password;
    				$employees->address = $params->address;
    				$employees->about = $params->about;
    				$employees->phone = $params->phone;
    				$employees->type = $params->type;
    				$employees->isactivated = 1;
    				///$employees->roleid = $params->roleid;
    				$employees->franchiseid = $params->franchiseid;
    			 
    				$id = R::store($employees);
    				///$this->send_email_registration($params);
    				echo json_encode($params);
    			}
    			$this->addAreas($params->services,$params->jobtypes,$id,$params->franchiseid, $params->branchesrole);
    		} catch(PDOException $e) {
    			echo '{"error":{"text":'. $e->getMessage() .'}}';
    		}
    		 
    	 
    	 
    }
    function doLogic(){
    	$id = $_GET['id'];
    	$timings = $_GET['timings'];
    	$data = explode('||', $timings);
    	$this->deleteTimings($id);
    	//$branchid = $params->branchid;
    	foreach($data as $d){
    		if(!$d) continue;
    		$split = explode("=",$d);
    		$days = $split[0];
    		$time = explode("##",@$split[1]);
    		$open = $time[0];
    		$close = @$time[1];
    		$this->dbSaveTiming($days,$open,$close,$id);
    	}
    
    
    }
    function deleteTimings($id){
    	try {
    		R::exec('delete from employeetimings where employeeid = '.$id);
    	} catch(PDOException $e) {
    		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    		echo '{"error":{"text":'. $e->getMessage() .'}}';
    	}
    }
    function dbSaveTiming($day,$open,$close,$id){
    
    	try {
    		$timings = R::dispense( 'employeetimings' );
    		$timings->day = $day;
    		$timings->opened = $open;
    		$timings->closed = $close;
    		$timings->createdon = R::isoDate();
    		$timings->isdeleted = 0;
    		$timings->employeeid = $id;
    		$id = R::store( $timings );
    		$db = null;
    	} catch(PDOException $e) {
    		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    		echo '{"error":{"text":'. $e->getMessage() .'}}';
    	}
    }
    function addAreas($services,$jobtypes,$eid,$franid, $roleid){
    	$services = rtrim($services, ',');
    	$jobtypes = rtrim($jobtypes, ',');
    	$departments = rtrim($roleid, ',');
    	$this->deleteEmployeeJobTypes($eid);
    	$this->deleteEmployeeServices($eid);
    	$this->deleteEmployeeDepartments($eid);
    	$services = explode(',',$services);
    	$jobtypes = explode(',',$jobtypes);
    	$departments = explode(',',$roleid);
    	if(count($jobtypes) > 0){
    		foreach($jobtypes as $j){
    			$this->AddEmployeeJobTypes($j,$eid,$franid);
    		}
    	}
    	if(count($services) > 0){
    		foreach($services as $j){
    			//$this->AddEmployeeServices($j,$eid,$franid);
    		}
    	}
    	if(count($departments) > 0){
    		foreach($departments as $j){
    			$roles = rtrim($j, ',');
    			$roles = explode("----",$j);
    			  if(!empty($roles[0]) && !empty($roles[1]))
    			    $this->addEmployeeDepartments($eid,$roles[0],$roles[1],$franid);
    		}
    	}
    		
    }
    function AddEmployeeJobTypes($jid,$eid,$franid){
     
    	try {
    	    $employees = R::dispense( 'employeejobtypes' );
    	    $employees->jobtypeid = $jid;
    	    $employees->employeeid = $eid;
    	    $employees->franchiseid = $franid;
    	    $id = R::store($employees);
    		 
    	} catch(PDOException $e) {
    		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    		echo '{"error":{"text":'. $e->getMessage() .'}}';
    	}
    }
    function addEmployeeDepartments($eid,$departmentid,$roleid,$franid){ 
    		
    	
    	  try {
    		$employees = R::dispense( 'employeedepartments' );
    	    $employees->employeeid = $eid;
    	    $employees->branchid = $departmentid;
    	    $employees->franchiseid = $franid;
    	    $employees->roleid = $roleid;
    	    $id = R::store($employees);
    		 
    	  } catch(PDOException $e) {
    		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    		echo '{"error":{"text":'. $e->getMessage() .'}}';
    	}
    }
    function AddEmployeeServices($sid,$eid,$bid){
  
    	try {
    		$employees = R::dispense( 'employeeservices' );
    	    $employees->serviceid = $eid;
    	    $employees->employeeid = $eid;
    	    $employees->franchiseid = $bid;
    	  
    	    $id = R::store($employees);
    
    		$db = null;
    		 
    	} catch(PDOException $e) {
    		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    		echo '{"error":{"text":'. $e->getMessage() .'}}';
    	}
    }
    function deleteEmployee(){
    	 $id = $_GET['id'];
    	 $this->deleteEmployeeJobTypes($id);
    	 $this->deleteEmployeeServices($id);
    	 $this->deleteEmployeeDepartments($id);
    	$sql = "delete from employees where id=$id ";
    	$this->deleteEmployeeJobTypes($id);
    	$this->deleteEmployeeServices($id);
    	try {
    		R::exec($sql);
    		echo json_encode($id);
    	} catch(Exception   $e) {
    		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    			echo json_encode(['error'=>'Integrity constraint'] );
    	}
    	 
    }
    function deleteEmployeeJobTypes($id){
    	 
    	$sql = "delete from employeejobtypes where employeeid = $id";
    
    	try {
    	    R::exec($sql);
    	} catch(Exception $e) {
    		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    			echo json_encode(['error'=>'Integrity constraint'] );
    	}
    }   
 
    function deleteEmployeeServices($id){
    	 
    	$sql = "delete from employeeservices where employeeid = $id";
    
    	try {
    		R::exec($sql);
    	} catch(Exception $e) {
    		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    			echo json_encode(['error'=>'Integrity constraint'] );
    	}
    }
    function deleteEmployeeDepartments($id){
    
    	$sql = "delete from employeedepartments where employeeid = $id";
    
    	try {
    		R::exec($sql);
    	} catch(Exception $e) {
    		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    		echo json_encode(['error'=>'Integrity constraint'] );
    	}
    }

      function send_email_registration($params) {
     
     
    		$name = $params->firstname . " " . $params->lastname;
    		$phone = $params->phone;
    		$password = $params->password;
    		$email = $params->email; 
    	  
    		$msg = "Dear $name<br/>
    		Your account has been registered.<br/>
    		You may now log in by clicking this link or copying and pasting it into your browser:<br/>
    		<a href='http://outsourced.dk/' target='_blank'>Saloon - A franchise solution</a><br/>
    		You will be able to log in using:<br/>
    		username: $phone<br/>
    		password: $password<br/><br/>"
    		. "-Saloon Team";
    	 
    
    
    	// use wordwrap() if lines are longer than 70 characters
    	$msg = wordwrap($msg, 70);
    	//echo "<pre>";
    	//print_r($msg);
    	//print_r($email);
    	//echo "</pre>";
    	//exit;
    	// send email
    	$headers = "From: info@outsourced.dk \r\n";
    	$headers .= "MIME-Version: 1.0\r\n";
    	$headers .= "Content-Type: text/html; charset=UTF-8 \r\n";
    	///mail($email, "Account details for $name", $msg, $headers);
      }
}
?>