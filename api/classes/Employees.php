<?php
class Employees
{ 
	public $branchid;
    // method declaration
    function __construct($app){
    	$this->branchId = @$_SESSION['branchid'];
    	$app->get('/employees', function () { 
    		$this->getAllByBranchId(1);
    	});
    	$app->post('/employees',function(){
    		$request = Slim::getInstance()->request();
    		$this->saveEmployee($request);
    	});
    		$app->get('/deleteemployees',function(){
    			$request = Slim::getInstance()->request();
    			$this->deleteEmployee($request);
    		});
    }
    function getAll( ) {  
        $sql = "select * from employees where branchid = $this->branchId" ;
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
    function getAllByBranchId() { 
    	$search = "";
    	if(@$_GET['search'] !=''){
    		$search = $_GET['search'];
    		$search =  "  AND  (firstname LIKE '%". $search ."%' OR lastname LIKE '%". $search ."%' OR phone LIKE '%". $search ."%' OR lastname LIKE '%". $search ."%')";
    	} 
        $sql = "select * from employees where branchid = :branchid $search";
            try {
                    $db = getConnection();
                    $stmt = $db->prepare($sql);
                    $stmt->bindParam("branchid", $this->branchId);
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
    		if(@$params->id){
    			$sql = "update employees ";
    			$sql .=" where id=:id";
    			try {
    				$db = getConnection();
    				$stmt = $db->prepare($sql);
    				 
    				$stmt->bindParam("id", $params->id);
    				$stmt->execute();
    				 
    				$db = null;
    				echo json_encode($params);
    			 } catch(PDOException $e) {
    				//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    				echo '{"error":{"text":'. $e->getMessage() .'}}';
    			}
    		}else{
		    		$sql = "INSERT INTO employees (firstname, lastname,phone,email,password,address,about,branchid,type) ";
		    		$sql .="VALUES (:f, :l , :p,:e,:pas,:add,:about,:branchid,:type)";
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
		    			$stmt->bindParam("branchid", $this->branchId); 
		    			$stmt->bindParam("type", $params->type);
		    	
		    			$stmt->execute();
		    			$params->id = $db->lastInsertId();
		    			$db = null;
		    			echo json_encode($params);
		    		} catch(PDOException $e) {
		    			//error_log($e->getMessage(), 3, '/var/tmp/php.log');
		    			echo '{"error":{"text":'. $e->getMessage() .'}}';
		    		}
    		}
    	 
    }
    function deleteEmployee(){
    	 $id = $_GET['id'];
    	$sql = "delete from employees where id=:id ";
    	 
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
}
?>