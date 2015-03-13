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
			        		$app->get('/changestatus',function(){ 
			        			$this->changeStatus();
			        		});
			        			$app->get('/branchesbyid', function () {
			        				$this->getBranchById();
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
      WHERE r.employeeid = $employeeid and b.isactivated = 1
      GROUP BY b.NAME
   UNION
      SELECT w.*, '' AS selected, 0 AS role, '' AS rolename  FROM branches w  
      
      
 WHERE franchiseid = :franchiseid and w.isactivated = 1
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
    function getBranchById( ) {
    	$branchid = $_GET['branchid'];
    	$sql = "select * from branches where id =".$branchid;
          try {
              	$branch = R::getAll($sql);
            // Include support for JSONP requests
	            if (!isset($_GET['callback'])) {
	                echo json_encode($branch);
	            } else {
	                echo $_GET['callback'] . '(' . json_encode($branch) . ');';
	            }
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
    function getAllByFranchiseCount($fid) {  
    	     $sql = "SELECT count(*) as total from branches b
				   WHERE b.isactivated = '1' and b.franchiseid =".$fid;
    				   try {
	    				   $branches =  R::getAll(  $sql );
	    				   // Include support for JSONP requests
	    				   return $branches[0]['total'] ;
	    
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
		   	echo json_encode($id);
		   	$this->updateIsNew(@$_SESSION['employeeid']);
		   	$this->addEmployeeDepartments(@$_SESSION['employeeid'],$id,$this->auth->getFranchiseId());
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

    function getRole( $franid){
    	$search = "";
    	try {
    
    		$roles =  R::getCol( 'SELECT id FROM role WHERE franchiseid = :franchiseid and name="Manager"',
    				[':franchiseid' => $franid]
    		); 
    		return $roles[0];
    			
    	} catch(PDOException $e) {
    		$error = array("error"=> array("text"=>$e->getMessage()));
    		echo json_encode($error);
    	}
    }
    
    function addEmployeeDepartments($eid,$departmentid,$franid){
    
    	 $rid = $this->getRole($franid);
    	try {
    		$employees = R::dispense( 'employeedepartments' );
    		$employees->employeeid = $eid;
    		$employees->branchid = $departmentid;
    		$employees->franchiseid = $franid;
    		$employees->roleid = $rid;
    		$id = R::store($employees);
    		echo json_encode($id);
    	} catch(PDOException $e) {
    		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    		echo '{"error":{"text":'. $e->getMessage() .'}}';
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
    function changeStatus(){
        $id;
         $status;
    	if(isset($_GET['status']) && isset($_GET['id'])){
        	$id = $_GET['id'];
        	$status = $_GET['status'];
        }
    	$total = intval($this->getAllByFranchiseCount($_GET['franchiseid']));
    	if($total < 2){
    		echo json_encode(['error'=>' You have only one department, can\'t be Deactivated']);
    		return;
    	} 
    	
    	try {
    		$branch = R::dispense( 'branches' );
    		$branch->id = $id;
    		$branch->isactivated = $status;
    		$id = R::store($branch);
    		echo json_encode($id);
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
			    	   WHERE branchid = "'.$branchid.'"  ORDER BY FIELD(day, "monday", "tuesday", "wednesday","thursday", "friday", "saturday", "sunday")';
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