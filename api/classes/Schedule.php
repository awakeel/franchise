<?php
class Schedule
{ 

    // method declaration
    public $branchId;
    function __construct($app){
    		$this->branchid = @$_SESSION['branchid'];
	    	$app->get('/schedules', function () {
	    		$this->getAllByFranchise(1);
	    	});
    		$app->post('/schedules', function () {
    			$request = Slim::getInstance()->request();
    			$this->saveSchedule($request);
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
    function getAllByFranchise($franchiseid) { 
          $jobtypeid = 0;
          $employeeid = 0;
          if(isset($_GET['jobtypeid']) && !empty($_GET['jobtypeid'])){
          	$jobtypeid = $_GET['jobtypeid'];
          	$sql = "SELECT concat(s.datefrom ,'T',s.start) as start,'Time slot scheduled ' AS title, concat(s.dateto ,'T',s.end) as end  ,j.id as resourceId  from schedule s
        		left join jobtypes j on j.id = s.jobtypeid
        		where s.branchid = :branchid and j.id is not null";
          	
          }
          if(isset($_GET['employeeid']) && !empty($_GET['employeeid'])){
          	$employeeid = $_GET['employeeid'];
          	$sql = "SELECT concat(s.datefrom ,'T',s.start) as start,'Time slot scheduled ' AS title, concat(s.dateto ,'T',s.end) as end  ,e.id as resourceId  from schedule s
        		left join employees e on e.id = s.employeeid
        		where s.branchid = :branchid and e.id is not null";
          	
          }
            try {
                    $db = getConnection();
                    $stmt = $db->prepare($sql);
                    $stmt->bindParam("branchid", $this->branchid );
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
     
    function saveSchedule($request){
    	 
    		$params = json_decode($request->getBody());
    		$branchid = 0;
    		if(isset($_GET['branchid']) && !empty($_GET['branchid'])){
    			$branchid = $_GET['branchid'];
    			 
    		}else{
    			$branchid = $this->branchid;
    		}
    		if(isset($params->id) && !empty($params->id)){
    			$sql = "update branches set languageid=:l, currencyid=:c,countryid=:ct";
    			$sql .=" where id=:id";
    			try {
    				$db = getConnection();
    				$stmt = $db->prepare($sql);
    				$stmt->bindParam("l", $params->languageid);
    				$stmt->bindParam("c", $params->currencyid);
    				$stmt->bindParam("ct", $params->countryid);
    				$stmt->bindParam("id", $params->id);
    				$stmt->execute();
    				 
    				$db = null;
    				echo json_encode($params);
    			 } catch(PDOException $e) {
    				//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    				echo '{"error":{"text":'. $e->getMessage() .'}}';
    			}
    		}else{
		    		$sql = "INSERT INTO schedule (start, end,dateto,datefrom,jobtypeid,employeeid,branchid) ";
		    		$sql .="VALUES (:start, :end , :dateto,:datefrom,:jobtypeid,:employeeid,:branchid)";
		    		try {
		    			$db = getConnection();
		    			$stmt = $db->prepare($sql);
		    			$stmt->bindParam("start", $params->timefrom);
		    			$stmt->bindParam("end", $params->timeto); 
		    			$stmt->bindParam("dateto",$params->dateto );
		    			$stmt->bindParam("datefrom",$params->datefrom);
		    			$stmt->bindParam("jobtypeid", $params->jobtypeid);
		    			$stmt->bindParam("employeeid", $params->employeeid);
		    			$stmt->bindParam("branchid", $branchid); 
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
    function deleteLanguageTranslate($id){
    	 
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