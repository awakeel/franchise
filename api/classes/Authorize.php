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
        	$app->post('/changepassword', function () use ($app) {
        		$this->changePassword();
        	});
        		$app->post('/forgot', function () use ($app) {
        			$this->forgotPassword();
        		});
        	$app->get('/getsession', function () use ($app) {
        			$this->getSession();
        	});
        	$app->post("/switchdepartment",function() use ($app){
        		$this->changeDepartment();
        	});
        	$app->post('/process', function () use ($app) {
        			 	if ( isset($_POST['phone']) ) {
        					$phone = $_POST['phone'];
        				} else {
        					$phone = '';
        				} 
        				if ( isset($_POST['password']) ) {
        					$password =$_POST['password'];
        				} else {
        					$password = '';
        				}
        				$data = array(
        						'phone' => $phone, 
        						'password' =>   $password
        				);
        				$cursor = $this->Login($phone,$password );
        				
        				if(!isset($cursor[0]->phone)){
        					echo json_encode(['phone'=>false]);
        					return false;
        				}
        				if( $data['password'] !=  $cursor[0]->password){
        					echo json_encode(['password'=>false]);
        					return false;
        				}else if( $data['phone'] !=  $cursor[0]->phone){
        					echo json_encode(['phone'=>false]);
        					return false;
        				}else{
        					
        					
        				}
        			
        				if($cursor[0]->isactivated == "0"){
        					echo json_encode(['isactivated'=>false]);
        					return false;
        				}
        				if($cursor == false){
        					echo json_encode(['dep'=>false]);
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
        						$_SESSION['employeeid'] =  $cursor[0]->id;
        						$_SESSION['branchid'] =  $cursor[0]->branchid;
        						$_SESSION['franchiseid'] = $cursor[0]->franchiseid;
        						$_SESSION['isfranchise'] = $cursor[0]->isfranchise;
        						$_SESSION['roleid'] = $cursor[0]->roleid;
        						$basic['ip'] =  $_SERVER['REMOTE_ADDR'];
        						$basic['since'] = date("F j, Y, g:i a");
        						$basic['login_failure'] = false;
        						$basic['is_logged_in'] = true;
        						$cursor[0]->setting = $basic;
        						$_SESSION['user'] = $cursor[0];
        						
        						$this->saveLoginHistory($_SERVER['REMOTE_ADDR'],$cursor[0]->id);
        						//$this->updateIsNew($cursor[0]->id);
        					} else {
        						$_SESSION['login_failure'] = true;
        						$_SESSION['is_logged_in'] = false;
        					}
        				}
        				$_SESSION['firsttime'] = '';
        				echo json_encode($_SESSION);
        				 
        			});
    }
    function forgotPassword() {
    	$search = "";
    	if(isset($_POST['email']) && !empty($_POST['email'])){
    		$email = $_POST['email'];
    		 
    		try {
    			 $emp = R::findOne( 'employees', ' email = ? ', [ $email]);
    			 $empemail = "";
    			 $emailpassword = "";
    			 if($emp){
	    			 $empemail = $emp->email;
	    			 $emailpassword = $emp->password;
    			 } 
    			 if($empemail && $emailpassword){
    			 	$this->sendForgotEmail($empemail,$emailpassword); 
    			 	echo json_encode(array("msg"=>'Password sent to   '.$email));
    			 }else{
    			 	echo json_encode(["msg"=>'No account associated with  '.$email]);
    			 }
    			 	
    			 
    		} catch(PDOException $e) {
    			$error = array("error"=> array("text"=>$e->getMessage()));
    			echo json_encode($error);
    		}
    		   
    	}else{
    		echo json_encode(array('isemail'=>false));
    	}
    }
    function sendForgotEmail($email,$password) {
    	 
    	 
    	$headers = "From:KnockoutSports postmaster@knocksports.com\r\n";
    	$headers .= "MIME-Version: 1.0\r\n";
    	$headers .= "Content-Type: text/html; charset=UTF-8 \r\n";
    	$msg = "SMP <br> Password: ".$password;
    	mail($email, "SMP - Forgot Password ", $msg, $headers);
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
	$isFranchise = 0;
	if(isset($_SESSION['user']))
			$isFranchise= $_SESSION['user']->isfranchise;
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
		if(isset($_SESSION['user']))
		$branchids = $_SESSION['user']->id;
	}
	return $branchids;
}
 function getFranchiseId(){
	return $_SESSION['user']->franchiseid;
}
function Login($phone,$password){
	  
	try {
		$sql = "select e.*,f.company from employees e inner join franchises f on f.id = e.franchiseid where e.phone = :phone and e.password = :password";
	 	$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("phone", $phone);
		$stmt->bindParam("password", $password);
		$stmt->execute();
		$employees = $stmt->fetchAll(PDO::FETCH_OBJ);
		$branches; 
		if(isset($employees[0]->id) && !empty($employees[0]->id)){
		$sql = "select b.* from branches b 
				inner join employeedepartments ed on ed.branchid = b.id
				where b.isactivated = 1 and ed.employeeid = ".$employees[0]->id;
			$branches = R::getAll($sql);
			$_SESSION['branches'] = $branches;
		}
		if(!isset($branches[0]->id) && !isset($employees[0]->isfranchise) && !isset($employees[0]->phone))
			return false;
		 
		return  $employees;
		// Include support for JSONP requests
		 
	
	} catch(PDOException $e) {
		$error = array("error"=> array("text"=>$e->getMessage()));
		echo json_encode($error);
	}
}
function getSession(){
	    if(!isset($_GET['employeeid'])){
	    	echo json_encode($_SESSION);
	    	return;
	    }
	 	$employeeid = $_GET['employeeid'];
		$sql = "select e.*,f.company from employees e inner join franchises f on f.id = e.franchiseid where e.isactivated = 1 and e.id = $employeeid";
	
		$db = getConnection();
		$stmt = $db->prepare($sql); 
		$stmt->execute();
		$employees = $stmt->fetchAll(PDO::FETCH_OBJ);
		$branches;
		if(isset($employees[0]->id) && !empty($employees[0]->id)){
			$sql = "select  b.* from branches b
				inner join employeedepartments ed on ed.branchid = b.id
				where b.isactivated = 1 and ed.employeeid = ".$employees[0]->id;
			$branches = R::getAll($sql);
			$_SESSION['branches'] = $branches;
		}
	
		 
		// Include support for JSONP requests
			
	
		$basic = null;
	$_SESSION['is_logged_in'] = true;
	 
	$_SESSION['since'] = date("F j, Y, g:i a");
	$_SESSION['ip'] = $_SERVER['REMOTE_ADDR'];
	$_SESSION['login_failure'] = false;
	$_SESSION['employeeid'] =  $employees[0]->id;
	$_SESSION['branchid'] =  $employees[0]->branchid;
	$_SESSION['franchiseid'] = $employees[0]->franchiseid;
	$_SESSION['isfranchise'] = $employees[0]->isfranchise;
	$_SESSION['roleid'] = $employees[0]->roleid;
	$basic['ip'] =  $_SERVER['REMOTE_ADDR'];
	$basic['since'] = date("F j, Y, g:i a");
	$basic['login_failure'] = false;
	$basic['is_logged_in'] = true;
	$employees[0]->setting = $basic;
	$_SESSION['user'] = $employees[0];
	$_SESSION['firsttime'] = '';
	$_SESSION['firsttime'] = @$_GET['firsttime'];
	echo json_encode($_SESSION);
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
function changePassword(){
	$employeeid = $_POST['employeeid'];
	$password = $_POST['password1'];
   $sql = "update employees set password ='".$password."', passwordchanged = '1' where id=$employeeid "; 
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql); 
		$stmt->execute();
		$db = null;
		echo json_encode(array('msg'=>"true"));
	} catch(PDOException $e) {
		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	} 
	 
}
function changeDepartment(){
	$params = json_decode($request->getBody()); 
	$branches;
	if(isset($employees[0]->id) && !empty($employees[0]->id)){
		$sql = "select distinct b.* from branches b
				inner join employeedepartments ed on ed.branchid = b.id
				where b.isactivated = 1 and ed.employeeid = ".$employees[0]->id;
		$branches = R::getAll($sql);
		$_SESSION['branches'] = $branches;
	}
	$types = R::getAll($sql);
}
}
?>