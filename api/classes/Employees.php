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
    		$app->get('/deleteemployees',function(){
    			$request = Slim::getInstance()->request();
    			$this->deleteEmployee($request);
    		});
    		$app->get('/employeebyid',function(){
    			$this->getEmployeesByJobTypeId();
    		});
    }
    function getAll( ) {  
        $sql = "select concat(firstname , '' , lastname) as name ,id,picture from employees where branchid = $this->branchid" ;
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
    function getEmployeesByJobTypeId( ) {
        if(isset($_GET['branchid']) && !empty($_GET['branchid'])){
    		$branchid = $_GET['branchid'];
    		 
    	}else{
    		$branchid = $this->branchid;
    	}
    	if(isset($_GET['jobtypeid']) && !empty($_GET['jobtypeid'])){
    		$jobtypeid = $_GET['jobtypeid'];
    	}
    	$sql = "select * from employees e left join employeejobtypes ej on ej.employeeid = e.id
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
    	$branchid = 0;
    	if(isset($_GET['branchid']) && !empty($_GET['branchid'])){
    		$branchid = $_GET['branchid'];
    		 
    	}else{
    		$branchid = $this->branchid;
    	}
        $sql = "select e.*,  role.name as role, group_concat(j.name separator ',') as jobtypes from employees e
				left join role on role.id = e.roleid
				left join employeejobtypes ej on ej.employeeid = e.id
				left join jobtypes j on j.id = ej.jobtypeid
        		where e.branchid = :branchid $search
        		
        		group by e.id
        		order by id desc
        		";
            try {
                    $db = getConnection();
                    $stmt = $db->prepare($sql);
                    $stmt->bindParam("branchid",$branchid);
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
     
    function saveEmployee($request){
    	 
    		$params = json_decode($request->getBody());
    		if(isset($params->id) && !empty($params->id)){
    			$sql = "update employees set firstname = :f, lastname = :l,phone = :p, email = :e,password=:pas,address=:add,about=:about,type=:type,roleid=:roleid";
    			$sql .=" where id=:id";
    			try {
    				$db = getConnection();
    				$stmt = $db->prepare($sql);
    				$stmt->bindParam("f", $params->firstname);
    				$stmt->bindParam("l", $params->lastname);
    				$stmt->bindParam("p", $params->phone);
    				$stmt->bindParam("e", $params->email);
    				$stmt->bindParam("pas", $params->password);
    				$stmt->bindParam("add", $params->address);
    				$stmt->bindParam("about", $params->about);

    				$stmt->bindParam("type", $params->type);
    				$stmt->bindParam("roleid", $params->roleid);
    				$stmt->bindParam("id", $params->id);
    				$stmt->execute();
    			 
    				$db = null;
    				$this->addAreas($params->services,$params->jobtypes,$params->id);
    				  
    			 } catch(PDOException $e) {
    				//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    				echo '{"error":{"text":'. $e->getMessage() .'}}';
    			}
    		}else{
		    		$sql = "INSERT INTO employees (firstname, lastname,phone,email,password,address,about,branchid,type,roleid) ";
		    		$sql .="VALUES (:f, :l , :p,:e,:pas,:add,:about,:branchid,:type,:roleid)";
		    		try {
		    			$db = getConnection();
		    			$stmt = $db->prepare($sql);
		    			$stmt->bindParam("f", $params->firstname);
		    			$stmt->bindParam("l", $params->lastname);
		    			$stmt->bindParam("p", $params->phone);
		    			$stmt->bindParam("e", $params->email);
		    			$stmt->bindParam("pas", $params->password);
		    			$stmt->bindParam("add", $params->address);
		    			$stmt->bindParam("about", $params->about);
		    			$stmt->bindParam("branchid", $params->branchid); 
		    			$stmt->bindParam("type", $params->type);
		    			$stmt->bindParam("roleid", $params->roleid);
		    			
		    			$stmt->execute();
		    			$params->id = $db->lastInsertId();
		    			$db = null;
		    			$this->addAreas($params->services,$params->jobtypes,$params->id);
		    			
		    			echo json_encode($params);
		    		} catch(PDOException $e) {
		    			//error_log($e->getMessage(), 3, '/var/tmp/php.log');
		    			echo '{"error":{"text":'. $e->getMessage() .'}}';
		    		}
    		}
    	 
    }
     
    function addAreas($services,$jobtypes,$eid){
    	$services = rtrim($services, ',');
    	$jobtypes = rtrim($jobtypes, ',');
    	$this->deleteEmployeeJobTypes($eid);
    	$this->deleteEmployeeServices($eid);
    	$services = explode(',',$services);
    	$jobtypes = explode(',',$jobtypes);
    	 
    	if(count($jobtypes) > 0){
    		foreach($jobtypes as $j){
    			$this->AddEmployeeJobTypes($j,$eid);
    		}
    	}
    	if(count($services) > 0){
    		foreach($services as $j){
    			$this->AddEmployeeServices($j,$eid);
    		}
    	}
    		
    }
    function AddEmployeeJobTypes($jid,$eid){
     
    	$sql = "INSERT INTO employeejobtypes (jobtypeid, employeeid,branchid) ";
    	$sql .="VALUES (:jid, :eid , :bid)";
    	try {
    		$db = getConnection();
    		$stmt = $db->prepare($sql);
    		$stmt->bindParam("jid", $jid);
    		$stmt->bindParam("eid", $eid);
    		$stmt->bindParam("bid", $this->branchid);
    		 $stmt->execute();
    	 
    		$db = null;
    		 
    	} catch(PDOException $e) {
    		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    		echo '{"error":{"text":'. $e->getMessage() .'}}';
    	}
    }
    function AddEmployeeServices($jid,$eid){
    	 
    	$sql = "INSERT INTO employeeservices (serviceid, employeeid,branchid) ";
    	$sql .="VALUES (:jid, :eid , :bid)";
    	try {
    		$db = getConnection();
    		$stmt = $db->prepare($sql);
    		$stmt->bindParam("jid", $jid);
    		$stmt->bindParam("eid", $eid);
    		$stmt->bindParam("bid", $this->branchid);
    		$stmt->execute();
    
    		$db = null;
    		 
    	} catch(PDOException $e) {
    		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    		echo '{"error":{"text":'. $e->getMessage() .'}}';
    	}
    }
    function deleteEmployee(){
    	 $id = $_GET['id'];
    	$sql = "delete from employees where id=:id ";
    	$this->deleteEmployeeJobTypes($id);
    	$this->deleteEmployeeServices($id);
    	try {
    		$db = getConnection();
    		$stmt = $db->prepare($sql);
    		$stmt->bindParam("id", $id);
    		$stmt->execute(); 
    		$db = null;
    		echo json_encode($id);
    	} catch(PDOException $e) {
    		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    		echo '{"error":{"text":'. $e->getMessage() .'}}';
    	}
    }
    function deleteEmployeeJobTypes($id){
    	 
    	$sql = "delete from employeejobtypes where employeeid = $id";
    
    	try {
    		$db = getConnection();
    		$stmt = $db->prepare($sql);
    		$stmt->bindParam("employeeid", $id);
    		$stmt->execute();
    		$db = null; 
    	} catch(PDOException $e) {
    		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    		echo '{"error":{"text":'. $e->getMessage() .'}}';
    	}
    }   
 
    function deleteEmployeeServices($id){
    	 
    	$sql = "delete from employeeservices where employeeid = $id";
    
    	try {
    		$db = getConnection();
    		$stmt = $db->prepare($sql);
    		$stmt->bindParam("employeeid", $id);
    		$stmt->execute();
    		$db = null; 
    	} catch(PDOException $e) {
    		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    		echo '{"error":{"text":'. $e->getMessage() .'}}';
    	}
    }
    
}
?>