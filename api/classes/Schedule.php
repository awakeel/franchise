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
	    		$app->get('/schedulelists', function () {
	    			$this->getAllSchedulelistByBranchId(1);
	    		});
    		$app->post('/schedules', function () {
    			$request = Slim::getInstance()->request();
    			$this->saveSchedule($request);
    		});
    			$app->get('/deleteschedule',function(){
    				$request = Slim::getInstance()->request();
    				$this->deleteSchedule($request);
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
    function getAllSchedulelistByBranchId($request) {
    	$search = "";
    	if(isset($_GET['search']) && !empty($_GET['search'])){
    		$search = $_GET['search'];
    		$search =  "  AND  (j.name LIKE '%". $search ."%' OR e.firstname LIKE '%". $search ."%')";
    	}
    	$branchid = 0;
    	if(isset($_GET['branchid'])  && !empty($_GET['branchid'])){
    		$branchid = $_GET['branchid'];
    
    	}
    	$sql = "select sc.*, s.datefrom,s.dateto from schedulegroup sc
    			inner join schedule s on s.schedulegroupid = sc.id
				 
    			where s.branchid ='".$branchid."'  $search group by sc.id order by id desc ";
    	try {
    		$schedules = R::getAll($sql);
    		 
    		// Include support for JSONP requests
    		if (!isset($_GET['callback'])) {
    			echo json_encode($schedules);
    		} else {
    			echo $_GET['callback'] . '(' . json_encode($schedules) . ');';
    		}
    	} catch(PDOException $e) {
    		$error = array("error"=> array("text"=>$e->getMessage()));
    		echo json_encode($error);
    	}	 
    }
    
    function getAllByFranchise($franchiseid) { 
          $jobtypeid = 0;
          $employeeid = 0;
         
            try {
            	$sql = "";
            	$branchid = null;
            	if(isset($_GET['branchid']) && !empty($_GET['branchid'])){
            		$branchid =  $_GET['branchid'];
            	}
            	if(isset($_GET['jobtypeid']) && !empty($_GET['jobtypeid'])){
            		$jobtypeid = $_GET['jobtypeid'];
            		$jobtypeid = rtrim($jobtypeid, ',');
            		$sql = "SELECT j.color as backgroundColor,s.start,s.end,  s.datefrom, s.dateto , 'Time slot scheduled' as title ,j.id as resourceId  from schedule s
			        		left join jobtypes j on j.id = s.jobtypeid
			        		where s.branchid = $branchid and j.id is not null and s.datefrom is not null and s.dateto is not null   and s.jobtypeid in($jobtypeid)";
            		 
            	}
            	if(isset($_GET['employeeid']) && !empty($_GET['employeeid'])){
            		$employeeid = $_GET['employeeid'];
            		
            		$employeeid = rtrim($employeeid, ',');
            		if(empty($employeeid)){
            			$employeeid = 0;
            		}
            		 
            		$sql = "SELECT  '#999999' as backgroundColor, s.end,s.start,'Time slot scheduled ' AS title,    s.datefrom,s.dateto ,e.id as resourceId  from schedule s
			        		left join employees e on e.id = s.employeeid
			        		where s.branchid = $branchid and e.id is not null  and s.datefrom is not null and s.dateto is not null  and s.employeeid in($employeeid)";
            		 
            	     }
                    $schedules = R::getAll($sql);
                    $fullschedule = array(); 
                    foreach($schedules as $schedule) {
                    	$date = array();
                    	if(!is_null($schedule['datefrom']) && !is_null($schedule['dateto']));{
						  $this->createDateRangeArray($schedule,$fullschedule);
                    	}
                    	//array_push($dates,$date);
                    }
                  //  echo json_encode($fullschedule);
                    $db = null;

            // Include support for JSONP requests
		            if (!isset($_GET['callback'])) {
		                echo json_encode(($fullschedule));
		            } else {
		                echo $_GET['callback'] . '(' . json_encode($fullschedule) . ');';
		            }

            	} catch(PDOException $e) {
                    $error = array("error"=> array("text"=>$e->getMessage()));
                    echo json_encode($error);
                }
          
    }
     
    function saveSchedule($request){
		    	$params = json_decode($request->getBody());
		    	try {
		    		if(isset($params->id) && !empty($params->id)){
		    			$jobtypes = R::dispense( 'schedule' );
		    			$jobtypes->id = $params->id;
		    			$jobtypes->name = $params->name;
		    			$jobtypes->name = $params->name;
		    			$jobtypes->comments = $params->comments;
		    			$jobtypes->franchiseid = $params->franchiseid;
		    			 
		    			$id = R::store($jobtypes);
		    		}else{ 
		    			if(!isset($_SESSION['groupid'])){
			    			$schedulegroup = R::dispense( 'schedulegroup' );
			    			$schedulegroup->title = $params->title;
			    			$schedulegroup->isdeleted = 0;
			    		  
			    			$_SESSION['groupid'] = R::store($schedulegroup);
		    	     	}  
		    			$schedule = R::dispense( 'schedule' );
		    			$schedule->start = $params->timefrom;
		    			$schedule->end = $params->timeto;
		    			$schedule->dateto = $params->dateto;
		    		 
		    			$schedule->datefrom = $params->datefrom;
		    			$schedule->jobtypeid = $params->jobtypeid;
		    			$schedule->employeeid =$params->employeeid;
		    			$schedule->branchid = $params->branchid;
		    			$schedule->schedulegroupid = $_SESSION['groupid'];
		    			$schedule->createdby = R::isoDate();
		    			if($params->last == "1"){
		    				unset($_SESSION['groupid']);
		    			}
		    			 $id = R::store($schedule);
		    		} 
		    	} catch(PDOException $e) {
		    		echo '{"error":{"text":'. $e->getMessage() .'}}';
		    	}
		         	 
    }
    function createDateRangeArray($schedule,&$jsonschedule)  {
    	// takes two dates formatted as YYYY-MM-DD and creates an
    	// inclusive array of the dates between the from and to dates.
    
    	// could test validity of dates here but I'm already doing
    	// that in the main script
    
    	$aryRange=array();
    	$strDateFrom = $schedule['datefrom'];
    	$strDateTo = $schedule['dateto'];
    	$iDateFrom=mktime(1,0,0,substr($strDateFrom,5,2),     substr($strDateFrom,8,2),substr($strDateFrom,0,4));
    	$iDateTo=mktime(1,0,0,substr($strDateTo,5,2),     substr($strDateTo,8,2),substr($strDateTo,0,4));
    	
    	if ($iDateTo>=$iDateFrom)
    	{ 
    		$aryRange['start'] = date('Y-m-d',$iDateFrom)."T".$schedule['start'];
    		$aryRange['end'] = date('Y-m-d',$iDateFrom)."T".$schedule['end'];
    		$aryRange['resourceId'] = $schedule['resourceId'];
    		$aryRange['backgroundColor'] = $schedule['backgroundColor'];
    		$aryRange['title'] = $schedule['title'];
    		
    		$jsonschedule[]=$aryRange;
    		///array_push($aryRange,); // first entry
    		while ($iDateFrom<$iDateTo) {
    			$iDateFrom+=86400; // add 24 hours
    			$aryRange['start'] = date('Y-m-d',$iDateFrom)."T".$schedule['start'];
    	     	$aryRange['end'] = date('Y-m-d',$iDateFrom)."T".$schedule['end'];
    	     	$aryRange['backgroundColor'] = $schedule['backgroundColor'];
    	     	$aryRange['resourceId'] = $schedule['resourceId'];
    	     	$aryRange['title'] = $schedule['title'];
    	     	$jsonschedule[]=$aryRange;
    		}
    	}
    	
    	  
    }
    function deleteSchedule($id){
    	 $id = $_GET['id'];
    	$sql = "delete from schedule where schedulegroupid=:id ";
    	 
    	try {
    		$db = getConnection();
    		$stmt = $db->prepare($sql);
    		$stmt->bindParam("id", $id);
    		$stmt->execute(); 
    		$db = null;
    		$this->deleteScheduleGroup($id);
    	} catch(PDOException $e) {
    		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    		echo '{"error":{"text":'. $e->getMessage() .'}}';
    	}
    }
    function deleteScheduleGroup($id){
    	$id = $_GET['id'];
    	$sql = "delete from schedulegroup where id=:id ";
    
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