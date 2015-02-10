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
    function saveService($request){
    
    	$params = json_decode($request->getBody());
    	$services = R::dispense( 'services');
    	if(isset($params->id) && !empty($params->id)){
    		$services->id = $params->id;
    		$services->name = $params->name;
    		$services->comments = $params->comments;
    		$services->createdby = $params->franchiseid;
    		$services->isdeleted = 0;
    		$services->price = $params->price;
    		$services->type = $params->type;
    		$services->color = $params->color;
    		$services->time = $params->time;
    		$services->jobtypeid = $params->jobtypeid;
    		$services->isactivated  = 1;
    		$services->createdon = R::isoDate();
    		
    
    	}else{
    		$services->name = $params->name;
    		$services->comments = $params->comments;
    		$services->createdby = $params->franchiseid;
    		$services->isdeleted = 0;
    		$services->price = $params->price;
    		$services->type = $params->type;
    		$services->time = $params->time;
    		$services->color = $params->color;
    		$services->jobtypeid = $params->jobtypeid;
    		$services->isactivated  =1;
    		$services->createdon = R::isoDate();
    		$services->franchiseid = $params->franchiseid;
    	}
    	$id = R::store($services);
    	echo json_encode($params);
    }
    function getAllByBranchId( ) { 
    	$search = "";
    	  if(@$_GET['search'] !=''){
    		$search = $_GET['search'];
    		$search =  "  AND  (s.name LIKE '%". $search ."%' OR s.comments LIKE '%". $search ."%')";
    	   }
    	  $franchiseid = 0;
    	  if(isset($_GET['franchiseid']) && !empty($_GET['franchiseid'])){
    		$franchiseid = $_GET['franchiseid'];
    	 } 
         $sql = "select s.*, j.name as jobtype,j.id as jobtypeid from services s
				left join jobtypes j on j.id = s.jobtypeid
       			where s.franchiseid = $franchiseid  $search order by id desc";
            try {
            	$services = R::getAll($sql);
 		    // Include support for JSONP requests
            if (!isset($_GET['callback'])) {
                echo json_encode($services);
            } else {
                echo $_GET['callback'] . '(' . json_encode($services) . ');';
            }

            } catch(PDOException $e) {
                    $error = array("error"=> array("text"=>$e->getMessage()));
                    echo json_encode($error);
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
    		echo json_encode(['error'=>'Integrity constraint'] );
    	}
    }
}
?>