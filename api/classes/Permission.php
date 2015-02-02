<?php

class Permission {

    public $offset = 0;
    public $errormsg;
    public $successmsg;
    private $_siteKey;
	public $branchid;
	public $auth;
    // method declaration
    function __construct($app,$auth) {
    	$this->auth = $auth; 
        	$app->get('/modules', function () use ($app) {
        		 $this->getModules();
        	});
        		$app->get('/allmodules', function () use ($app) {
        			$this->getAllModules();
        		});
      }   
function getModules( ){
	  
	 if(isset($_SESSION['isfranchise']) && !empty($_SESSION['isfranchise']) && $_SESSION['isfranchise'] == "1" && empty($_SESSION['branches'][0]['id']) && !isset($_GET['branchid'])){
		$sql = " select * from modules  order by sortorder
			";
	  }else{
		$b = "";
		if(isset($_GET['branchid']) && !empty($_GET['branchid'])){
			$branchid = $_GET['branchid'];
			$b = " and ed.branchid = $branchid";
		}
		if(isset( $_SESSION['employeeid']))
		$employeeid = $_SESSION['employeeid'];
		$roleid= $_SESSION['roleid'];
		if(isset($_SESSION['isfranchise']) && !empty($_SESSION['isfranchise'])){
			$sql = " select * from modules  order by sortorder
			";
			
		}else{
		$sql = "SELECT modules.id,modules.name ,modules.text ,modules.childof,ed.`branchid`    FROM modules
		         INNER JOIN   rolemodules ON rolemodules.moduleid = modules.id
				 INNER JOIN role r ON r.id = rolemodules.`roleid`
				 LEFT JOIN employeedepartments ed ON ed.`roleid` = r.id
				  WHERE ed.`employeeid` = $employeeid.$b
				  group by modules.name
				 ORDER BY modules.sortorder ";
		}
	}
	try {
		$modules = R::getAll($sql);
		// Include support for JSONP requests
		if (!isset($_GET['callback'])) {
			echo json_encode($modules);
		} else {
			echo $_GET['callback'] . '(' . json_encode($modules) . ');';
		}
	
	} catch(PDOException $e) {
		$error = array("error"=> array("text"=>$e->getMessage()));
		echo json_encode($error);
	}
}
function getAllModules( ){

	$sql = "select * from modules";

	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);

		$stmt->execute();
		$modules = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		// Include support for JSONP requests
		if (!isset($_GET['callback'])) {
			echo json_encode($modules);
		} else {
			echo $_GET['callback'] . '(' . json_encode($modules) . ');';
		}

	} catch(PDOException $e) {
		$error = array("error"=> array("text"=>$e->getMessage()));
		echo json_encode($error);
	}
}
function saveLoginHistory($ip,$employeeid){
 
		$sql = "INSERT INTO loginhistory (ip, employeeid,time,branchid) ";
		$sql .="VALUES (:ip, :employeeid , NOW(),:branchid)";
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam("ip", $ip);
			$history = $stmt->bindParam("employeeid", $employeeid); 
			$history = $stmt->bindParam("branchid", $_SESSION['branchid'] );
			$stmt->execute(); 
			$db = null;
			return true;
		} catch(PDOException $e) {
			//error_log($e->getMessage(), 3, '/var/tmp/php.log');
			echo '{"error":{"text":'. $e->getMessage() .'}}';
		}
 

}
 
}
?>