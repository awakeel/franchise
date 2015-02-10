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
	    		$app->get('/getemployeedepartments', function () {
	    			$this->getEmployeeDepartments();
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
    					$branchid = 0;
    					if(isset($_GET['branchid']))
    							$branchid = $_GET['branchid'];
    					$this->getTimings($branchid);
    				});
			        $app->post('/weeks', function () {
			
			        	$request = Slim::getInstance()->request();
			        	$this->saveTiming($request);
					
					        });
			        	$app->get('/gettimingmonday',function(){
			        		$request = Slim::getInstance()->request();
			        		$branchid = 0;
			        		if(isset($_GET['branchid']))
			        			$branchid = $_GET['branchid'];
			        		$this->getTimingMonday($branchid);
			        	});
			        	
 
    }
    function getEmployeeDepartments(  ) {  
    	if($this->auth->getLoggedInMessages() == false){
    		return false;
    	}
             try {	
             	$employeeid = $_GET['employeeid'];
             	if(empty($employeeid))
             		$employeeid = 0;
		             	$sql = "  
	  SELECT * FROM (SELECT  b.*,
      IF(r.branchid IS NULL, '', 'checked') AS selected,
      IF(r.roleid IS NULL, 0, r.roleid) AS role,
      role.name AS rolename 
      FROM  branches b 
      INNER JOIN employeedepartments r  ON r.branchid = b.id 
      INNER JOIN role  ON role.id = r.roleid 
      WHERE r.employeeid = $employeeid
      GROUP BY b.NAME
   UNION
      SELECT w.*, '' AS selected, 0 AS role, '' AS rolename  FROM branches w  
      
      
 WHERE franchiseid = :franchiseid
 ) AS v
 GROUP BY NAME
             			";
            	$branches =  R::getAll( $sql,
				 [':franchiseid' => $_GET['franchiseid']]
				 );
                    if (!isset($_GET['callback'])) {
                    	echo json_encode($branches);
                    } else {
                    	echo $_GET['callback'] . '(' . json_encode($branches) . ');';
                    }
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
    	$sql = "select * from branches where franchiseid = $this->auth->getFranchiseId()";
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
    	  $sql = "SELECT b.*, '' as employeename from branches b
				   WHERE  b.franchiseid =  ".$_GET['franchiseid']." 
				   		$search ";
    	  
            try {
                  	$branches =  R::getAll(  $sql );
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
     
    function saveBranches($request){
	    	if($this->auth->getLoggedInMessages() == false){
	    		return false;
	    	}
    		$params = json_decode($request->getBody());
    		$branch = R::dispense( 'branches' );
    		if(isset($params->id) && !empty($params->id)){
    			$branch->name = $params->name;
    			$branch->city = $params->city;
    			$branch->zip = $params->zip;
    			$branch->address = $params->address;
    			$branch->notes = $params->notes;
    			$branch->id = $params->id;
    		}else{
		    			
		    			$branch->name = $params->name;
		    			$branch->city = $params->city;
		    			$branch->zip = $params->zip;
		    			$branch->address = $params->address;
		    			$branch->notes = $params->notes;
		    			$branch->createdon = R::isoDate();
		    			$branch->createdby = $this->auth->getFranchiseId();
		    			$branch->franchiseid = $this->auth->getFranchiseId();
		    			$branch->isactivated = 1;
		    			$branch->isdeleted = 0;
		    			
		    			
		   	}
		   	$id = R::store( $branch );
		   	$this->updateIsNew(@$_SESSION['employeeid']);
		   	$this->doLogic($params->timing,$id);
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
    function updateIsNew($employeeid){
    
    	$sql = "update employees set isnew ='0' where id=$employeeid ";
    	try {
    		$db = getConnection();
    		$stmt = $db->prepare($sql);
    		$stmt->execute();
    		$db = null;
    		return true;
    	} catch(PDOException $e) {
    		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    		echo '{"error":{"text":'. $e->getMessage() .'}}';
    	}
    }
    function dbSaveTiming($day,$open,$close,$branchid){
    	 
    	 try {
    		$timings = R::dispense( 'timings' );
    		$timings->day = $day;
    		$timings->opened = $open;
    		$timings->closed = $close;
    		$timings->createdon = R::isoDate();
    		$timings->isdeleted = 0;
    		$timings->branchid = $branchid;
    		$id = R::store( $timings ); 
    		$db = null; 
    	} catch(PDOException $e) {
    		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    		echo '{"error":{"text":'. $e->getMessage() .'}}';
    	}
    }
    function deleteTimings($branchid){
     try {
    		R::exec('delete from timings where branchid = '.$branchid);  
    	} catch(PDOException $e) {
    		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    		echo '{"error":{"text":'. $e->getMessage() .'}}';
    	}
    } 
    function getTimings( $branchid) {  
	    	if($this->auth->getLoggedInMessages() == false){
	    		return false;
	    	} 
            try {
			   $sql = 'SELECT * FROM timings 
			    	   WHERE branchid = "'.$branchid.'"   order by opened asc';
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
    function getTimingMonday( $branchid) {
    	if($this->auth->getLoggedInMessages() == false){
    		return false;
    	}
    	try {
    		$sql = 'SELECT * FROM timings
			    	   WHERE branchid = "'.$branchid.'" and day = "monday" order by opened asc';
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
    function deleteBranch(){
    	 $id = $_GET['id'];
    	 
    	 $this->deleteTimings($id);
    			try {
    				R::exec('delete from branches where id = '.$id);  
    				echo json_encode($id);
    			} catch(Exception $e) {
    			//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    				echo json_encode(['error'=>'Integrity constraint'] );
    			}
    			
    }
}
?>