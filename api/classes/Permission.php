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
      }   
function getModules( ){
	 
	$sql = "select modules.id,modules.name ,modules.text ,modules.childof from modules
			inner join   rolemodules on rolemodules.moduleid = modules.id
			where rolemodules.isallow = '1' and rolemodules.roleid = '".$this->auth->getRoleId()."' ";
	 
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