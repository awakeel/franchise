<?php
class Branches
{ 

    // method declaration
    public $auth = null;
    function __construct($app,$auth){
    		$this->auth = $auth;
	    	$app->get('/branches', function () {
	    		$this->getAllByFranchise();
	    	});
    		$app->post('/branches', function () {
    			$request = Slim::getInstance()->request();
    			$this->saveBranches($request);
    		});
    			
    			$app->get('/deletebranch',function(){
    				$request = Slim::getInstance()->request();
    				$this->deleteBranch($request);
    			});
    				$app->get('/gettimings',function(){
    					$request = Slim::getInstance()->request();
    					$branchid;
    					if(isset($_GET['branchid']))
    							$branchid = $_GET['branchid'];
    					$this->getTimings($branchid);
    				});
        $app->post('/weeks', function () {

        	$request = Slim::getInstance()->request();
        	$this->saveTiming($request);
		
		        });
 
    }
    function getAll( $franchiseid) {  
    	if($this->auth->getLoggedInMessages() == false){
    		return false;
    	}
        $sql = "select * from branches where franchiseid = $franchiseid";
            try {
                    $db = getConnection();
                    $stmt = $db->query($sql);
                    $branches = $stmt->fetchAll(PDO::FETCH_OBJ);
                    $db = null;

                 return $branches;
            } catch(PDOException $e) {
                    $error = array("error"=> array("text"=>$e->getMessage()));
                    echo json_encode($error);
            }
    }
    function getAllByBranchid( $branchid) {
    	if($this->auth->getLoggedInMessages() == false){
    		return false;
    	}
    	$sql = "select * from branches where id = $branchid";
    	try {
    		$db = getConnection();
    		$stmt = $db->query($sql);
    		$branches = $stmt->fetchAll(PDO::FETCH_OBJ);
    		$db = null;
    
    		return $branches;
    	} catch(PDOException $e) {
    		$error = array("error"=> array("text"=>$e->getMessage()));
    		echo json_encode($error);
    	}
    }
    function getAllByFranchise() { 
    	if($this->auth ->getLoggedInMessages() == false){
    		return false;
    	}  
    	$search = "";
    	if(@$_GET['search'] !=''){
    		$search = $_GET['search'];
    		$search =  "  and  (b.name LIKE '%". $search ."%') ";
    	}
        $sql = "SELECT b.*,GROUP_CONCAT(CONCAT(emp.firstname, '-', emp.lastname)  SEPARATOR ', ') as employeename,l.title as language,c.name as country,cu.`name` as currency FROM  branches b 
				left JOIN languages l ON l.id = b.`languageid`
				LEFT JOIN countries c ON  c.id = b.`countryid`
				LEFT JOIN currencies cu ON cu.id = b.`currencyid`
        		left join employees emp on emp.branchid = b.id
				   WHERE  b.franchiseid =  ".$this->auth->getFranchiseId()."
				   		
				   		$search
				   		
				   		group by b.name
				   		order by id desc
				   		";
            try {
                    $db = getConnection();
                    $stmt = $db->prepare($sql); 
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
     
    function saveBranches($request){
	    	if($this->auth->getLoggedInMessages() == false){
	    		return false;
	    	}
    		$params = json_decode($request->getBody());
    		if(isset($params->id) && !empty($params->id)){
    			
    			$sql = "update branches set name=:name,notes=:notes, languageid=:l, currencyid=:c,countryid=:ct";
    			$sql .=" where id=:id";
    			try {
    				$db = getConnection();
    				$stmt = $db->prepare($sql);
    				$stmt->bindParam("l", $params->languageid);
    				$stmt->bindParam("c", $params->currencyid);
    				$stmt->bindParam("ct", $params->countryid);
    				$stmt->bindParam("name", $params->name);
    				$stmt->bindParam("notes", $params->notes);
    				$stmt->bindParam("id", $params->id);
    				$stmt->execute();
    				 
    				$db = null;
    				if(isset($params->timing)){
    					$this->doLogic($params->timing,$params->id);
    						
    				} 
    			 } catch(PDOException $e) {
    				//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    				echo '{"error":{"text":'. $e->getMessage() .'}}';
    			}
    		}else{
		    		$sql = "INSERT INTO branches (name, notes,franchiseid,languageid,currencyid,countryid) ";
		    		$sql .="VALUES (:name, :notes ,  ".$this->auth->getFranchiseId().", :l, :c, :ct)";
		    		try {
		    			$db = getConnection();
		    			$stmt = $db->prepare($sql);
		    			$stmt->bindParam("name", $params->name);
		    			$stmt->bindParam("notes", $params->notes); 
		    			$stmt->bindParam("l", $params->languageid);
		    			$stmt->bindParam("c", $params->currencyid);
		    			$stmt->bindParam("ct", $params->countryid);
		    			$stmt->bindParam("ct", $params->countryid);
		    		 
		    			
		    			$stmt->execute();
		    			$params->id = $db->lastInsertId();
		    			
		    			 echo json_encode('{"id":'.$db->lastInsertId().'}');
		    			 $db = null;
		    				$this->doLogic($params->timing,$params->id);
		    			 
		    			
		    			 
		    		} catch(PDOException $e) {
		    			//error_log($e->getMessage(), 3, '/var/tmp/php.log');
		    			echo '{"error":{"text":'. $e->getMessage() .'}}';
		    		}
    		}
    	 
    }
    function doLogic($timing,$branchid){ 
    	 $data = explode('||', $timing);
    	 $this->deleteTimings($branchid);
    	//$branchid = $params->branchid;
    	foreach($data as $d){
    		if(!$d) continue;
    		$split = explode("=",$d);
    		$days = $split[0];
    		$time = explode("##",@$split[1]);
    		$open = $time[0];
    		$close = @$time[1];
    		$this->dbSaveTiming($days,$open,$close,$branchid);
    	} 
    	 
    
    }
    function dbSaveTiming($day,$open,$close,$branchid){
    	 
    	$sql = "INSERT INTO timings (day, opened,closed,branchid) ";
    	$sql .="VALUES (:day, :opened,:closed,:branchid)";
    	try {
    		$db = getConnection();
    		$stmt = $db->prepare($sql);
    		$stmt->bindParam("day", $day);
    		$stmt->bindParam("opened", $open);
    		$stmt->bindParam("closed", $close);
    		$stmt->bindParam("branchid", $branchid);
    		$stmt = $stmt->execute();
    		$db = null; 
    	} catch(PDOException $e) {
    		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    		echo '{"error":{"text":'. $e->getMessage() .'}}';
    	}
    }
    function deleteTimings($branchid){
    	 
    	$sql = "delete from timings where branchid=:id ";
    
    	try {
    		$db = getConnection();
    		$stmt = $db->prepare($sql);
    		$stmt->bindParam("id", $branchid);
    		$stmt->execute();
    		$db = null; 
    	} catch(PDOException $e) {
    		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    		echo '{"error":{"text":'. $e->getMessage() .'}}';
    	}
    } function getTimings( $branchid) {  
    	if($this->auth->getLoggedInMessages() == false){
    		return false;
    	}
        $sql = "select * from timings where branchid=:id ";
            try {
                    $db = getConnection();
                    $stmt = $db->prepare($sql);
    				$stmt->bindParam("id", $branchid);
    				$stmt->execute();
                    $branches = $stmt->fetchAll(PDO::FETCH_OBJ);
                    $db = null;

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
    function deleteBranch(){
    	 $id = $_GET['id'];
    	$sql = "delete from branches where id=:id ";
    	 
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