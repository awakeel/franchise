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
	    			$app->get('/jobtypeschedule', function () {
	    				$this->getAllScheduleJobType();
	    			});
    		$app->post('/schedules', function () {
    			$request = Slim::getInstance()->request();
    			$this->saveSchedule($request);
    		});
    			$app->get('/deleteschedule',function(){
    				$request = Slim::getInstance()->request();
    				$this->deleteSchedule($_GET['id']);
    				$this->deleteScheduleGroup($_GET['id']);
    			});
    				$app->get('/saveschedulegroup',function(){
    					 $this->saveScheduleGroup( );
    				});
    					$app->get('/getschedulebygroupid',function(){
    						$this->getScheduleByGroupId( );
    					});
    						$app->get('/getscheduletiming',function(){
    							$this->getScheduleTiming( );
    						});
    						
    							$app->post('/specialdaychanges',function(){
    								$request = Slim::getInstance()->request(); 
    								$this->saveSpecialDayChanges($request);
    							});
    							$app->get('/getallschedules',function(){
    							$this->getAllSchedulesByBranchId( );
    						   }); 
    								$app->get('/employeegetallbyjobtype', function () {
    									$this->getEmployeeByJobType(1);
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
    function getEmployeeByJobType(){
    	$branchid = @$_GET['branchid'];
    	$jobtypeid = @$_GET['jobtypeid'];
    	$sql = "SELECT * FROM (SELECT CONCAT(e.firstname , ' ' , e.lastname) AS NAME ,e.id,e.picture FROM employees e 
					WHERE e.id IN (SELECT ed.`employeeid` FROM employeedepartments ed   WHERE ed.`branchid` = $branchid)) tb
					INNER JOIN employeejobtypes ej ON ej.`jobtypeid` = $jobtypeid
					GROUP BY tb.id";
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
    function getAllScheduleJobType(){
    	$sid = @$_GET['sid'];
    	$sql = "select j.* from jobtypes j 
    	inner join schedule s on s.jobtypeid = j.id 
    	where s.schedulegroupid = $sid";
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
    function getAllSchedulesByBranchId(){
    	$branchid = @$_GET['branchid'];
    	$sql = "select * from schedulegroup where branchid = $branchid";
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
    function getScheduleByGroupId(){
    	$groupid = @$_GET['groupid'];
    	$sql = "select sc.*, j.name as jobtype,s.* ,s.id as sid from schedulegroup sc
    			inner join schedule s on s.schedulegroupid = sc.id
    				left join jobtypes j on j.id = s.jobtypeid
    			 where s.schedulegroupid ='".$groupid."'  ";
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
    function getScheduleTiming(){
    	$scheduleid = @$_GET['scheduleid'];
    	$sql = " select st.*,lower(d.theday) as day from scheduletiming st
				inner join d_day d on d.d_dayid = st.dayid
    	where scheduleid = $scheduleid ";
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
    	$sql = "SELECT sg.*,s.schedulegroupid,GROUP_CONCAT(DISTINCT j.name ORDER BY j.name ASC  )  as jobtypes,GROUP_CONCAT(DISTINCT e.firstname ORDER BY e.firstname ASC  )  as employee,  MIN(st.`dayid`) AS datefrom, MAX(st.`dayid`) AS dateto FROM schedulegroup sg
  INNER JOIN schedule s ON s.`schedulegroupid` = sg.`id`
  inner join jobtypes j on j.id = s.jobtypeid
  left join employees e on e.id = s.employeeid
  INNER JOIN scheduletiming st ON st.`scheduleid` = s.id 
    			where s.branchid ='".$branchid."'  $search GROUP BY sg.id order by id desc ";
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
            	$search = "";
            	if(isset($_GET['jobtypeid']) && !empty($_GET['jobtypeid'])){
            		$jobtypeid = $_GET['jobtypeid'];
            		if($jobtypeid !="0")
            		$search = " AND s.jobtypeid IN($jobtypeid)";
            		//$jobtypeid = rtrim($jobtypeid, ',');
            		
            	}
            	if(isset($_GET['employeeid']) && !empty($_GET['employeeid'])){
            		$employeeid = $_GET['employeeid'];
            		if($employeeid !="0")
            		$search = " AND s.employeeid IN($employeeid)";
            		//$jobtypeid = rtrim($jobtypeid, ',');
            	
            	}
            	if(isset($_GET['scheduleid']) && !empty($_GET['scheduleid'])){
            		$scheduleid = $_GET['scheduleid'];
            		if($scheduleid !="0")
            		$search = " AND s.schedulegroupid IN($scheduleid)";
            		//$jobtypeid = rtrim($jobtypeid, ',');
            	       
            	}
            		$sql = "SELECT st.*,    s.schedulegroupid,st.scheduleid, st.dayid AS datefrom,st.dayid AS dateto,j.color AS backgroundColor,j.name as title,concat(e.firstname , ' ' , e.lastname) as name  FROM scheduletiming st
								  INNER JOIN schedule s ON s.id = st.scheduleid
								  LEFT JOIN jobtypes j ON j.id = s.jobtypeid
								  left join employees e on e.id = s.employeeid
							WHERE s.branchid = $branchid AND j.id IS NOT NULL AND st.dayid IS NOT NULL   $search";
            		 
            	 
            	 
                    $schedules = R::getAll($sql);
                    $fullschedule = array(); 
                   
                    $sid = 0;
                    $no = 1;
                    $rid = 0; 
                    $sgid = 0; 
                    foreach($schedules as $schedule) {
                    	
                    	$date = array();
                    	//echo json_encode($sid.'s'.$rid.'r'.$sgid);
                    	//if($rid != $schedule['resourceId'] && $sgid == $schedule['schedulegroupid']){
                    		//$no= ($no+1); 
                    	//}else{ 
                    	//} 
                    	if(!is_null($schedule['datefrom']) && !is_null($schedule['dateto']));{
						  $this->createDateRangeArray($schedule,$fullschedule,$no);
                    	}
                    	$sid = $schedule['scheduleid'];
                    	 
                    	$sgid = $schedule['schedulegroupid'];
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
    function createDateRangeArray($schedule,&$jsonschedule,$no)  {
    	 
    	
    	$aryRange=array();
    	$strDateFrom = substr($schedule['datefrom'], 0, 4) .'-'.substr($schedule['datefrom'], 4, 2).'-'.substr($schedule['datefrom'], 6, 8);
    	$strDateTo = substr($schedule['dateto'], 0, 4) .'-'.substr($schedule['dateto'], 4, 2) .'-'.substr($schedule['dateto'], 6, 8);
    
    	$iDateFrom=mktime(1,0,0,substr($strDateFrom,5,2),     substr($strDateFrom,8,2),substr($strDateFrom,0,4));
    	$iDateTo=mktime(1,0,0,substr($strDateTo,5,2),     substr($strDateTo,8,2),substr($strDateTo,0,4));
    
    	$aryRange['start'] = date('Y-m-d',$iDateFrom)."T".$schedule['start'];
    	$aryRange['end'] = date('Y-m-d',$iDateFrom)."T".$schedule['end'];
    	 
    	if(!is_null($schedule['name']) ||!empty($schedule['name'])){
    		$aryRange['name'] = $schedule['name'];
    	}else{
    		$aryRange['name'] = "None";
    	}
    	$aryRange['backgroundColor'] = $schedule['backgroundColor'];
    	if($no == 0)
    	 $aryRange['description'] = $schedule['title'];
    	else
    		$aryRange['description'] = $schedule['title'];
    	
    	$aryRange['title'] = '';
    	$aryRange['ischanged'] = $schedule['ischanged'];
    	$jsonschedule[]=$aryRange;
    	 
    }
    function saveScheduleGroup(){
    	
    	if(isset($_GET['schedulegroupid']) && !empty($_GET['schedulegroupid'])){
    		$this->deleteSchedule($_GET['schedulegroupid']);
    		$schedulegroup = R::dispense( 'schedulegroup' );
    		$schedulegroup->title = $_GET['title'];
    		$schedulegroup->isdeleted = 0;
    		$schedulegroup->id = $_GET['schedulegroupid'];
    		$id = R::store($schedulegroup);
    		echo json_encode($id);
    	}else{
    		$schedulegroup = R::dispense( 'schedulegroup' );
    		$schedulegroup->title = $_GET['title'];
    		$schedulegroup->isdeleted = 0;
    		$schedulegroup->branchid = $_GET['branchid'];
    		$id = R::store($schedulegroup);
    		echo json_encode($id);
    	}
    }
    function saveSpecialDayChanges($r){
    	$theday = $_POST['theday'];
    	$theday = explode('/',$theday);
    	$theday = $theday[2].$theday[0].$theday[1];
    	$schedulegroupid =$_POST['sid'];
    	$jobtypeid = $_POST['jtid'];
    	$jobtypes = explode(",",$jobtypeid);
    	foreach($jobtypes as $j){
    		if(!$j)   continue;
	    	$timingid =$this-> getScheduleTimingBySchedueId($schedulegroupid,$theday,$j);
	    	   if(!$timingid){
		    		echo json_encode(['exists'=>false]);
		    		continue;
		    	}else{
		    		$schedule = R::dispense( 'scheduletiming' );
		    		$schedule->dayid = $theday;
		    		$schedule->start =$_POST['timefrom'];
		    		$schedule->id = $timingid[0];
		    		$schedule->end = $_POST['timeto'];
		    		$schedule->ischanged = 1;
		    		$id = R::store($schedule);
					echo json_encode($id);
		    	}
    	}
    }
    function getScheduleTimingBySchedueId( $groupid,$theday,$jtid){
    	
    	try {
    
    		$timing =  R::getCol("SELECT st.* FROM scheduletiming st
INNER JOIN schedule s ON s.id = st.`scheduleid`
 
    				where s.schedulegroupid = $groupid and st.dayid = $theday and s.jobtypeid = $jtid");
    		return $timing;
    		 
    	} catch(PDOException $e) {
    		$error = array("error"=> array("text"=>$e->getMessage()));
    		echo json_encode($error);
    	}
    }
    function saveSchedule($request){
		    	$params = json_decode($request->getBody());
		    	try {
		    		 
		    		$data = explode('||', $params->data);
		    		$days = explode(",",$params->days);
		    		$dayid = $this->getDayId($params->datefrom,$params->dateto,$data,$days,$params);
		    		return;
		    	//	$this->deleteTimings($branchid);
		    		//$branchid = $params->branchid;
		    		//foreach($data as $d){
		    			//if(!$d) continue;
		    			//$split = explode("=",$d);
		    			//$day = $split[0];
		    			///$time = explode("##",@$split[1]);
		    			//$open = $time[0];
		    			//$close = @$time[1];
		    			
		    			//$this->dbSaveSchedule($day,$open,$close,$params);
		    		//}
		    		//echo json_encode($id);
		    		//} 
		    	} catch(PDOException $e) {
		    		echo '{"error":{"text":'. $e->getMessage() .'}}';
		    	}
		         	 
    } 
    function getDayId($from,$to,$data,$days,$params){
    	echo json_encode($from.$to);
    	$d1 = explode('-',$from);
    	$d1 = $d1[0].$d1[1].$d1[2];
    	$d2 = explode('-',$to);
    	$d2 = $d2[0].$d2[1].$d2[2]; 
    	$id = $this->dbSaveSchedule($params);
    	$sql = "select d_dayid, LOWER(theday) as theday from d_day where d_dayid >= $d1 and d_dayid <= $d2";
    	try {
    	    $dates = R::getAll($sql);
    	    foreach($dates as $date){
    	    	$day = $date['theday'];
    	    	$dayid = $date['d_dayid'];
    	    	if(in_array($day,$days)){
	 				 foreach($data as $d){
		 				 if (strpos($d,$day) !== false) {
					       $da = explode("=",$d);
					       $timing = explode("##",$da[1]);
						   $this->dbSaveScheduleTiming($id,$dayid,$timing[0],$timing[1]);
		 				 }
	 				 }
    	    	}
    	    }
    	
    	} catch(PDOException $e) {
    		$error = array("error"=> array("text"=>$e->getMessage()));
    		echo json_encode($error);
    	}
    	//echo json_encode($from.$to);
    }
    
    function dbSaveSchedule($params ){
    	$schedule = R::dispense( 'schedule' );
    	
    	$schedule->jobtypeid = $params->jobtypeid;
    	$schedule->employeeid =$params->employeeid;
    	$schedule->branchid = $params->branchid;
    	$schedule->schedulegroupid = $params->schedulegroupid;
    	$schedule->createdby = R::isoDate(); 
    	$id = R::store($schedule);
    	return $id;
    }
    function dbSaveScheduleTiming($id,$dayid,$start,$end){
    	$schedule = R::dispense( 'scheduletiming' ); 
    	$schedule->dayid = $dayid;
    	$schedule->start =$start;
    	$schedule->end = $end;
    	$schedule->scheduleid = $id;
    	$id = R::store($schedule);
    	
    }
   
    
    function deleteScheduleByGroupId($id){ 
    	$this->deleteSchedule($id);
    	$this->deleteScheduleByGroupId($id);
    }
    function deleteSchedule($id){
    	 
    	$sql = "DELETE st,s FROM scheduletiming st
  JOIN schedule s ON  s.id=st.scheduleid  
WHERE s.schedulegroupid = $id ";
    	 
    	try {
    		$db = getConnection();
    		$stmt = $db->prepare($sql);
    		$stmt->bindParam("id", $id);
    		$stmt->execute(); 
    		$db = null;
    		
    	} catch(PDOException $e) {
    		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    		echo '{"error":{"text":'. $e->getMessage() .'}}';
    	}
    }
   
    function deleteScheduleGroup($id){
    	 
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