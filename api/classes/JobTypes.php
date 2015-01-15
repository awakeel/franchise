<?php
class JobTypes
{ 
	public $branchid;
	// method declaration
	function __construct($app){
		$this->branchId = @$_SESSION['branchid'];
    	$app->get('/jobtypes', function () {
    		$request = Slim::getInstance()->request();
    		
    		$this->getAllByBranchId($request);
    	});
    	$app->post('/jobtypes',function(){
    		$request = Slim::getInstance()->request();
    		$this->saveJobTypes($request);
    	});
    		$app->get('/deletejobtypes',function(){
    			$request = Slim::getInstance()->request();
    			$this->deleteJobTypes($request);
    		});
    }
    function getAll( ) {  
        $sql = "select * from branches  where branchid = $this->branchId";
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
    function getAllByBranchId($request) { 
    	$search = "";
    	if(@$_GET['search'] !=''){
    		$search = $_GET['search'];
    		$search =  "  AND  (name LIKE '%". $search ."%' OR comments LIKE '%". $search ."%')";
    	}
    	$sql = "select * from jobtypes where branchid = $this->branchId  $search";
    	    try {
                    $db = getConnection();
                    $stmt = $db->prepare($sql);
                   // $stmt->bindParam("branchid", $branchId);
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
     
    function saveJobTypes($request){
    	 
    		$params = json_decode($request->getBody());
    		if(@$params->id){
    			$sql = "update branches ";
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
		    		$sql = "INSERT INTO jobtypes (name, comments,branchid) ";
		    		$sql .="VALUES (:name, :comments , :branchid)";
		    		try {
		    			$db = getConnection();
		    			$stmt = $db->prepare($sql);
		    			$stmt->bindParam("name", $params->name);
		    			$stmt->bindParam("comments", $params->comments);
		    			$stmt->bindParam("branchid", $this->branchId); 
		    	
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
    function deleteJobTypes(){
    	 $id = $_GET['id'];
    	$sql = "delete from jobtypes where id=:id ";
    	 
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