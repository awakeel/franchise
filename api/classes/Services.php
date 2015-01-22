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
    		$search =  "  AND  (s.name LIKE '%". $search ."%' OR s.comments LIKE '%". $search ."%')";
    	}
    	$branchid = 0;
    	if(isset($_GET['branchid']) && !empty($_GET['branchid'])){
    		$branchid = $_GET['branchid'];
    	
    	}else{
    		$branchid = $this->branchId;
    	}
       $sql = "select s.*, j.name as jobtype,j.id as jobtypeid from services s
				left join jobtypes j on j.id = s.jobtypeid
       			where s.branchid = :branchid  $search order by id desc";
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
    		if(isset($params->id) && !empty($params->id)){
    		$sql = "update services set name=:name, type=:type,comments=:comments,jobtypeid=:jobtypeid,time=:time,price=:price ";
    		$sql .=" where id=:id";
    		try {
    			$db = getConnection();
    			$stmt = $db->prepare($sql);
    				
    			$stmt->bindParam("id", $params->id);
    			$stmt->bindParam("name", $params->name);
    			$stmt->bindParam("comments", $params->comments); 
    			$stmt->bindParam("jobtypeid", $params->jobtypeid);
    			$stmt->bindParam("price", $params->price);
    			$stmt->bindParam("type", $params->type);
    			$stmt->bindParam("time", $params->time);
    			$stmt->execute();
    				
    			$db = null;
    			echo json_encode($params);
    		} catch(PDOException $e) {
    			//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    			echo '{"error":{"text":'. $e->getMessage() .'}}';
    		}
    	}else{
    		$sql = "INSERT INTO services (name, comments,jobtypeid,branchid,time,price,type) ";
    		$sql .="VALUES (:name, :comments , :jobtypeid,:branchid,:time,:price,:type)";
    		try {
    			$db = getConnection();
    			$stmt = $db->prepare($sql);
    			$stmt->bindParam("name", $params->name);
    			$stmt->bindParam("comments", $params->comments);
    			$stmt->bindParam("branchid", $params->branchid);
    			$stmt->bindParam("jobtypeid", $params->jobtypeid);
    			$stmt->bindParam("type", $params->type);
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