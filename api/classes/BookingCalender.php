<?php
class BookingCalender {
	
	// method declaration
	public $branchId;
	function __construct($app) {
		$this->branchid = @$_SESSION ['branchid'];
		$app->get ( '/bookingcalender', function () {
			$this->getScheduleByGroupId ( 1 );
		} );
		
		$app->post ( '/bookingcalender', function () {
			$request = Slim::getInstance ()->request ();
			$this->saveBooking ( $request );
		} );
		$app->get ( '/deleteschedule', function () {
			$request = Slim::getInstance ()->request ();
			$this->deleteSchedule ( $_GET ['id'] );
			$this->deleteScheduleGroup ( $_GET ['id'] );
		} );
		$app->get ( '/saveschedulegroup', function () {
			$this->saveScheduleGroup ();
		} );
		$app->get ( '/getschedulebygroupid', function () {
			$this->getScheduleByGroupId ();
		} );
		
		$app->get ( '/getemployeesbyjobtypeid', function () {
			$this->getEmployeeByJobTypeId ();
		} );
	}
	function getAll() {
		$sql = "select * from branches";
		try {
			$db = getConnection ();
			$stmt = $db->query ( $sql );
			$branches = $stmt->fetchAll ( PDO::FETCH_OBJ );
			$db = null;
			
			// Include support for JSONP requests
			if (! isset ( $_GET ['callback'] )) {
				echo json_encode ( $branches );
			} else {
				echo $_GET ['callback'] . '(' . json_encode ( $branches ) . ');';
			}
		} catch ( PDOException $e ) {
			$error = array (
					"error" => array (
							"text" => $e->getMessage () 
					) 
			);
			echo json_encode ( $error );
		}
	}
	function getScheduleByGroupId() {
		$branchid = @$_GET ['branchid'];
		$filters = " where sb.branchid = " . $branchid;
		$employeeid = @$_GET ['employeeid'];
		$jobtypeid = @$_GET ['jobtypeid'];
		$resourceid = " sb.`jobtypeid` AS resourceId";
		if (isset ( $jobtypeid ) && ! empty ( $jobtypeid )) {
			if ($jobtypeid != "0") {
				$filters .= " and sb.jobtypeid=" . $jobtypeid;
				$resourceid = " sb.`jobtypeid` AS resourceId";
			}
		}
		if (isset ( $employeeid ) && ! empty ( $employeeid )) {
			if ($employeeid != "0" && $employeeid !="-1") {
				$filters .= " and sb.employeeid=" . $employeeid;
				$resourceid = " sb.`employeeid` AS resourceId";
			}
			if($employeeid == "-1"){
				///$filters .= " and s.employeeid=" . $employeeid;
				$resourceid = " sb.`employeeid` AS resourceId";
				
			}
		}  
		$sql = "select * from (SELECT * FROM  (SELECT CONCAT(CONCAT_WS('-',SUBSTR(st.dayid, 1,4),SUBSTR(st.dayid, 5,2),SUBSTR(st.dayid, 7,2)),'T',st.`start`) COLLATE latin1_danish_ci AS start ,
                CONCAT(CONCAT_WS('-',SUBSTR(st.dayid, 1,4),SUBSTR(st.dayid, 5,2),SUBSTR(st.dayid, 7,2)),'T',st.`end`) COLLATE latin1_danish_ci AS end,
                '#e6edf7' AS backgroundColor, sb.jobtypeid,'' as service  ,' ' AS title,$resourceid, '' AS employee,'' as customer ,0 AS booking
                FROM scheduletiming AS st
                INNER JOIN schedule sb ON sb.id = st.`scheduleid` 
                $filters
               ) tbl1
               UNION  
SELECT * FROM(
    SELECT CONCAT(CONCAT_WS('-',SUBSTR(sb.dayid, 1,4),SUBSTR(sb.dayid, 5,2),SUBSTR(sb.dayid, 7,2)),'T',sb.`timestart`) COLLATE latin1_danish_ci AS start,
    CONCAT(CONCAT_WS('-',SUBSTR(sb.dayid, 1,4),SUBSTR(sb.dayid, 5,2),SUBSTR(sb.dayid, 7,2)),'T',sb.`timeend`)  COLLATE latin1_danish_ci AS end  ,
    s.color AS backgroundColor ,s.name as service,sb.jobtypeid,'' AS title,$resourceid,IFNULL(CONCAT(e.firstname),'None') AS employee,ifnull(c.name,'Anonymous') as customer, 1 AS booking FROM bookings sb 
    LEFT JOIN services s ON s.id = sb.serviceid
	INNER JOIN customers c on c.id = sb.customerid
    LEFT JOIN employees e ON e.id = sb.employeeid
    $filters
    ) tbl2) tbl3 ";
		 
		try {
			$schedules = R::getAll ( $sql );
			  
			// Include support for JSONP requests
			if (! isset ( $_GET ['callback'] )) {
				echo json_encode ( $schedules );
			} else {
				echo $_GET ['callback'] . '(' . json_encode ( $schedules ) . ');';
			}
		} catch ( PDOException $e ) {
			$error = array (
					"error" => array (
							"text" => $e->getMessage () 
					) 
			);
			echo json_encode ( $error );
		}
	}
	function getAllSchedulelistByBranchId($request) {
		$search = "";
		if (isset ( $_GET ['search'] ) && ! empty ( $_GET ['search'] )) {
			$search = $_GET ['search'];
			$search = "  AND  (j.name LIKE '%" . $search . "%' OR e.firstname LIKE '%" . $search . "%')";
		}
		$branchid = 0;
		if (isset ( $_GET ['branchid'] ) && ! empty ( $_GET ['branchid'] )) {
			$branchid = $_GET ['branchid'];
		}
		$sql = "select sc.*, s.datefrom,s.schedulegroupid,s.dateto  from schedulegroup sc
    			inner join schedule s on s.schedulegroupid = sc.id
    		
				 
    			where s.branchid ='" . $branchid . "'  $search group by sc.id order by id desc ";
		try {
			$schedules = R::getAll ( $sql );
			
			// Include support for JSONP requests
			if (! isset ( $_GET ['callback'] )) {
				echo json_encode ( $schedules );
			} else {
				echo $_GET ['callback'] . '(' . json_encode ( $schedules ) . ');';
			}
		} catch ( PDOException $e ) {
			$error = array (
					"error" => array (
							"text" => $e->getMessage () 
					) 
			);
			echo json_encode ( $error );
		}
	}
	function getEmployeeByJobTypeId() {
		$franchiseid = @$_GET ['franchiseid'];
		$jobtypeid = @$_GET ['jobtypeid'];
		$filters = "";
		if (isset ( $franchiseid ) && ! empty ( $franchiseid )) {
			
			$filters .= " where ej.franchiseid=" . $franchiseid;
		}
		if (isset ( $jobtypeid ) && ! empty ( $jobtypeid )) {
			if ($jobtypeid != "0")
				$filters .= " and s.jobtypeid=" . $jobtypeid;
		}
		
		$sql = " SELECT CONCAT(e.firstname , ' ' , e.lastname) AS name ,e.id as id,e.picture FROM employees e
    	inner join schedule s on s.employeeid = e.id
    	inner join employeejobtypes ej on ej.employeeid = e.id
    	$filters
    	GROUP BY e.firstname";
		try {
			$schedules = R::getAll ( $sql );
			// Include support for JSONP requests
			if (! isset ( $_GET ['callback'] )) {
				echo json_encode ( $schedules );
			} else {
				echo $_GET ['callback'] . '(' . json_encode ( $schedules ) . ');';
			}
		} catch ( PDOException $e ) {
			$error = array (
					"error" => array (
							"text" => $e->getMessage () 
					) 
			);
			echo json_encode ( $error );
		}
	}
	function getAllByFranchise($franchiseid) {
		$jobtypeid = 0;
		$employeeid = 0;
		
		try {
			$sql = "";
			$branchid = null;
			if (isset ( $_GET ['branchid'] ) && ! empty ( $_GET ['branchid'] )) {
				$branchid = $_GET ['branchid'];
			}
			if (isset ( $_GET ['jobtypeid'] ) && ! empty ( $_GET ['jobtypeid'] )) {
				$jobtypeid = $_GET ['jobtypeid'];
				$jobtypeid = rtrim ( $jobtypeid, ',' );
				$sql = "SELECT j.color as backgroundColor,s.start,s.end, s.schedulegroupid, s.datefrom, s.dateto , 'Time slot scheduled' as title ,j.id as resourceId  from schedule s
			        		left join jobtypes j on j.id = s.jobtypeid
			        		where s.branchid = $branchid and j.id is not null and s.datefrom is not null and s.dateto is not null   and s.jobtypeid in($jobtypeid)";
			}
			if (isset ( $_GET ['employeeid'] ) && ! empty ( $_GET ['employeeid'] )) {
				$employeeid = $_GET ['employeeid'];
				
				$employeeid = rtrim ( $employeeid, ',' );
				if (empty ( $employeeid )) {
					$employeeid = 0;
				}
				
				$sql = "SELECT  '#999999' as backgroundColor, s.schedulegroupid,s.end,s.start,'Time slot scheduled ' AS title,    s.datefrom,s.dateto ,e.id as resourceId  from schedule s
			        		left join employees e on e.id = s.employeeid
			        		where s.branchid = $branchid and e.id is not null  and s.datefrom is not null and s.dateto is not null  and s.employeeid in($employeeid)";
			}
			$schedules = R::getAll ( $sql );
			$fullschedule = array ();
			foreach ( $schedules as $schedule ) {
				$date = array ();
				if (! is_null ( $schedule ['datefrom'] ) && ! is_null ( $schedule ['dateto'] ))
					;
				{
					$this->createDateRangeArray ( $schedule, $fullschedule );
				}
				// array_push($dates,$date);
			}
			// echo json_encode($fullschedule);
			$db = null;
			
			// Include support for JSONP requests
			if (! isset ( $_GET ['callback'] )) {
				echo json_encode ( ($fullschedule) );
			} else {
				echo $_GET ['callback'] . '(' . json_encode ( $fullschedule ) . ');';
			}
		} catch ( PDOException $e ) {
			$error = array (
					"error" => array (
							"text" => $e->getMessage () 
					) 
			);
			echo json_encode ( $error );
		}
	}
	function saveScheduleGroup() {
		if (isset ( $_GET ['schedulegroupid'] ) && ! empty ( $_GET ['schedulegroupid'] )) {
			$this->deleteSchedule ( $_GET ['schedulegroupid'] );
			$schedulegroup = R::dispense ( 'schedulegroup' );
			$schedulegroup->title = $_GET ['title'];
			$schedulegroup->isdeleted = 0;
			$schedulegroup->id = $_GET ['schedulegroupid'];
			$id = R::store ( $schedulegroup );
			echo json_encode ( $id );
		} else {
			$schedulegroup = R::dispense ( 'schedulegroup' );
			$schedulegroup->title = $_GET ['title'];
			$schedulegroup->isdeleted = 0;
			$id = R::store ( $schedulegroup );
			echo json_encode ( $id );
		}
	}
	function saveBooking($request) {
		$params = json_decode ( $request->getBody () );
		try {
			/*
			 * if(isset($params->id) && !empty($params->id)){
			 * //	$schedule = R::dispense( 'schedule' );
			 * $schedule->start = $params->timefrom;
			 * $schedule->end = $params->timeto;
			 * $schedule->id = $params->id;
			 * $schedule->dateto = $params->dateto;
			 * $schedule->datefrom = $params->datefrom;
			 * $schedule->jobtypeid = $params->jobtypeid;
			 * $schedule->employeeid =$params->employeeid;
			 * $schedule->branchid = $params->branchid;
			 * $schedule->createdby = R::isoDate();
			 * $id = R::store($schedule);
			 * echo json_encode('updated');
			 * }else{
			 */
			$schedule = R::dispense ( 'schedule' );
			$schedule->start = $params->timefrom;
			$schedule->end = $params->timeto;
			$schedule->dateto = $params->dateto;
			$schedule->datefrom = $params->datefrom;
			$schedule->jobtypeid = $params->jobtypeid;
			$schedule->employeeid = $params->employeeid;
			$schedule->branchid = $params->branchid;
			$schedule->schedulegroupid = $params->schedulegroupid;
			$schedule->createdby = R::isoDate ();
			$id = R::store ( $schedule );
			// }
		} catch ( PDOException $e ) {
			echo '{"error":{"text":' . $e->getMessage () . '}}';
		}
	}
	function createDateRangeArray($schedule, &$jsonschedule) {
		// takes two dates formatted as YYYY-MM-DD and creates an
		// inclusive array of the dates between the from and to dates.
		
		// could test validity of dates here but I'm already doing
		// that in the main script
		$aryRange = array ();
		$strDateFrom = $schedule ['datefrom'];
		$strDateTo = $schedule ['dateto'];
		$iDateFrom = mktime ( 1, 0, 0, substr ( $strDateFrom, 5, 2 ), substr ( $strDateFrom, 8, 2 ), substr ( $strDateFrom, 0, 4 ) );
		$iDateTo = mktime ( 1, 0, 0, substr ( $strDateTo, 5, 2 ), substr ( $strDateTo, 8, 2 ), substr ( $strDateTo, 0, 4 ) );
		
		if ($iDateTo >= $iDateFrom) {
			$aryRange ['start'] = date ( 'Y-m-d', $iDateFrom ) . "T" . $schedule ['start'];
			$aryRange ['end'] = date ( 'Y-m-d', $iDateFrom ) . "T" . $schedule ['end'];
			$aryRange ['resourceId'] = $schedule ['resourceId'];
			$aryRange ['backgroundColor'] = $schedule ['backgroundColor'];
			$aryRange ['title'] = $schedule ['title'];
			
			$jsonschedule [] = $aryRange;
			// /array_push($aryRange,); // first entry
			while ( $iDateFrom < $iDateTo ) {
				$iDateFrom += 86400; // add 24 hours
				$aryRange ['start'] = date ( 'Y-m-d', $iDateFrom ) . "T" . $schedule ['start'];
				$aryRange ['end'] = date ( 'Y-m-d', $iDateFrom ) . "T" . $schedule ['end'];
				$aryRange ['backgroundColor'] = $schedule ['backgroundColor'];
				$aryRange ['resourceId'] = $schedule ['resourceId'];
				$aryRange ['title'] = $schedule ['title'];
				$jsonschedule [] = $aryRange;
			}
		}
	}
	function deleteScheduleByGroupId($id) {
		$this->deleteSchedule ( $id );
		$this->deleteScheduleByGroupId ( $id );
	}
	function deleteSchedule($id) {
		$sql = "delete from schedule where schedulegroupid=:id ";
		
		try {
			$db = getConnection ();
			$stmt = $db->prepare ( $sql );
			$stmt->bindParam ( "id", $id );
			$stmt->execute ();
			$db = null;
		} catch ( PDOException $e ) {
			// error_log($e->getMessage(), 3, '/var/tmp/php.log');
			echo '{"error":{"text":' . $e->getMessage () . '}}';
		}
	}
	function deleteScheduleGroup($id) {
		$sql = "delete from schedulegroup where id=:id ";
		
		try {
			$db = getConnection ();
			$stmt = $db->prepare ( $sql );
			$stmt->bindParam ( "id", $id );
			$stmt->execute ();
			$db = null;
			echo json_encode ( $id );
		} catch ( PDOException $e ) {
			// error_log($e->getMessage(), 3, '/var/tmp/php.log');
			echo '{"error":{"text":' . $e->getMessage () . '}}';
		}
	}
}
?>