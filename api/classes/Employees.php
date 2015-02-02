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
        $sql = "select concat(e.firstname , '   ' , e.lastname) as name ,e.id,e.picture from employees e
        		left join employeedepartments ed on ed.employeeid = e.id
        		where ed.branchid =".$_GET['branchid'];
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
    				///$employees->roleid = $params->roleid;
    				$employees->franchiseid = $params->franchiseid; 
    				$id = R::store($employees);
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
    				///$employees->roleid = $params->roleid;
    				$employees->franchiseid = $params->franchiseid;
    			 
    				$id = R::store($employees);
    			}
    			$this->addAreas($params->services,$params->jobtypes,$id,$params->franchiseid, $params->branchesrole);
    		} catch(PDOException $e) {
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
}
?>