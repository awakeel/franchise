<?php
class JobTypes
{ 
	public $branchid;
	// method declaration
	public $auth;
	function __construct($app,$auth){
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
    		$app->get('/globaljobtypes',function(){
    			$this->getGlobalJobTypes( );
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
    function getGlobalJobTypes() {
    
    	$sql = "select * from globaljobtypes";
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
    	if(isset($_GET['search'])){
    		$search = $_GET['search'];
    		$search =  "  AND  (name LIKE '%". $search ."%' OR comments LIKE '%". $search ."%')";
    	}
    	$franchiseid = 0;
    	if(isset($_GET['franchiseid'])  && !empty($_GET['franchiseid'])){
    		$franchiseid = $_GET['franchiseid'];
    	 
    	} 
    	$sql = "select j.*, j.color as backgroundColor from jobtypes as j where franchiseid ='".$franchiseid."'  $search order by id desc";
    	    try {
              	$types = R::getAll($sql);
            // Include support for JSONP requests
	            if (!isset($_GET['callback'])) {
	                echo json_encode($types);
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