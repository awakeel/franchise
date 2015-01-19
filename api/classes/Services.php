<?php
class Services
{ 

    // method declaration
    public $branchId;
    function __construct($app){
    	$this->branchId = @$_SESSION['branchid'];
    	$app->get('/services', function () {
    		$this->getAllByBranchId(1);
    	});
    		$app->get('/employeeservices', function () {
    			$this->getServiceById($_GET['id']);
    		});
    		 
    	$app->post('/services',function(){
    		$request = Slim::getInstance()->request();
    		$this->saveService($request);
    	});
    		
    		$app->get('/deleteservices',function(){
    			$request = Slim::getInstance()->request();
    			$this->deleteService($request);
    		});
    			$app->get('/globalservices',function(){
    				 
    				$this->getGlobalServices();
    			});
    }
    function getAll( ) {  
        $sql = "select * from branches";
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
    function getGlobalServices() {
    	 
    	$sql = "select * from globalservices";
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
    function getServiceById($id) {
    	
    	$sql = "select * from employeeservices as es
    			where es.employeeid = $id";
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
    function getAllByBranchId( ) { 
    	$search = "";
    	if(@$_GET['search'] !=''){
    		$search = $_GET['search'];
    		$search =  "  AND  (name LIKE '%". $search ."%' OR comments LIKE '%". $search ."%')";
    	}
    	$branchid = 0;
    	if(isset($_GET['branchid']) && !empty($_GET['branchid'])){
    		$branchid = $_GET['branchid'];
    	
    	}else{
    		$branchid = $this->branchId;
    	}
       $sql = "select * from services where branchid = :branchid  $search order by id desc";
            try {
                    $db = getConnection();
                    $stmt = $db->prepare($sql);
                    $stmt->bindParam("branchid", $branchid);
                    $stmt->execute();
                    $departments = $stmt->fetchAll(PDO::FETCH_OBJ);
                    $db = null;

            // Include support for JSONP requests
            if (!isset($_GET['callback'])) {
                echo json_encode($departments);
            } else {
                echo $_GET['callback'] . '(' . json_encode($departments) . ');';
            }

            } catch(PDOException $e) {
                    $error = array("error"=> array("text"=>$e->getMessage()));
                    echo json_encode($error);
            }
    }
    function saveService($request){
    
    	$params = json_decode($request->getBody());
    	if(@$params->id){
    		$sql = "update services ";
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
    		$sql = "INSERT INTO services (name, comments,branchid,time,price) ";
    		$sql .="VALUES (:name, :comments , :branchid,:time,:price)";
    		try {
    			$db = getConnection();
    			$stmt = $db->prepare($sql);
    			$stmt->bindParam("name", $params->name);
    			$stmt->bindParam("comments", $params->comments);
    			$stmt->bindParam("branchid", $params->branchid);
    			$stmt->bindParam("price", $params->price);
    			$stmt->bindParam("time", $params->time);
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
    function deleteService(){
    	$id = $_GET['id'];
    	$sql = "delete from services where id=:id ";
    
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