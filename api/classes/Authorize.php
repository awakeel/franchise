<?php

class Authorize {

    public $offset = 0;
    public $errormsg;
    public $successmsg;
    private $_siteKey;
	public $branchid;
    // method declaration
    function __construct($app) { 
        	$app->get('/logout', function () use ($app) {
        		session_unset();
        		echo json_encode('Logout');
        		//$app->redirect('/#login');
        	});
        		

        		$app->get('/getsession', function () use ($app) {
        			echo json_encode($_SESSION);
        		});

        			$app->post('/process', function () use ($app) {
        			 	if ( isset($_POST['phone']) ) {
        					$phone = $_POST['phone'];
        				} else {
        					$phone = '';
        				}
        				$data = array(
        						'phone' => $phone, 
        						'password' =>  $_POST['password'] ,
        				);
        				$cursor = $this->Login($phone,$_POST['password'] );
        			
        				if($data['password'] != @$cursor[0]->password){
        					echo json_encode(['password'=>false]);
        					return false;
        				}else if($data['phone'] != @$cursor[0]->phone){
        					echo json_encode(['phone'=>false]);
        					return false;
        				}
        				if ($cursor == NULL || count($cursor) < 1 ){
        					////$collection->insert($data);
        					$_SESSION['is_logged_in'] = false; 
        					
        				} else {
        					if ($data['password'] == $cursor[0]->password) {
        						$basic = null;
        						$_SESSION['is_logged_in'] = true;
        						$_SESSION['phone'] = $data['phone'];
        						$_SESSION['since'] = date("F j, Y, g:i a"); 
        						$_SESSION['ip'] = $_SERVER['REMOTE_ADDR'];
        						$_SESSION['login_failure'] = false;
        						$_SESSION['branchid'] =  $cursor[0]->branchid;
        						$_SESSION['roleid'] = $cursor[0]->roleid;
        						$basic['ip'] =  $_SERVER['REMOTE_ADDR'];
        						$basic['since'] = date("F j, Y, g:i a");
        						$basic['login_failure'] = false;
        						$basic['is_logged_in'] = true;
        						$cursor[0]->setting = $basic;
        						$_SESSION['user'] = $cursor[0];
        						
        						$this->saveLoginHistory($_SERVER['REMOTE_ADDR'],$cursor[0]->id);
        						$this->updateIsNew($cursor[0]->id);
        					} else {
        						$_SESSION['login_failure'] = true;
        						$_SESSION['is_logged_in'] = false;
        					}
        				}
        				 
        				echo json_encode($_SESSION);
        				 
        			});
    }
function isLoggedIn(){
	if(@$_SESSION['is_logged_in'] == true)
		return true;
	else
		return false;
}
function getLoggedInMessages(){
	if($this->isLoggedIn() == false){
		$error = array("error"=> array("text"=>'Boo! you are not logged in, please logged in'));
		echo json_encode($error);
		return false;
	}else{
		return true;
	}
}
function getRoleId(){
	return @$_SESSION['user']->roleid;
}
function getLoginType($branchid = 0, $useAsFranchise = false){
	$isFranchise = $_SESSION['user']->isfranchise;
	$branchids = 0;
	if($isFranchise){
		   if($useAsFranchise){
				$branches = $objBranches->getAll($_SESSION['user']->franchiseid);
				foreach($branches as $branch){
					$branchids.=$branch['id'].",";
				}
			}else if($branchid !=0){
				$branchids = $objBranches->getAllById($branchid);
				foreach($branches as $branch){
					$branchids.=$branch['id'];
				}
			}
	}else{
		$branchids = $_SESSION['user']->id;
	}
	return $branchids;
}
 function getFranchiseId(){
	return $_SESSION['user']->franchiseid;
}
function Login($phone,$password){
	 
	$sql = "select * from employees where phone = :phone and password = :password";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("phone", $phone);
		$stmt->bindParam("password", $password);
		$stmt->execute();
		$employees = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		return $employees;
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
function updateIsNew($employeeid){

	$sql = "update employees set isnew = 0 where id=$employeeid "; 
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
}
?>