<?php
 
class Roles {

 
	public $auth;
	// method declaration
	function __construct($app,$auth) {
		$this->auth = $auth;
		$app->get('/roles', function () use ($app) {
			$this->getModules();
		});
			$app->get('/allroles', function () use ($app) {
				$this->getRoles();
			});
			 
			$app->post('/roles', function () use ($app) {
				$request = Slim::getInstance()->request();
				$this->saveRole($request);
			});
			$app->get('/deleterole',function(){
				$request = Slim::getInstance()->request();
				$this->deleteRole($request);
			});
				$app->post('/savepermission',function(){
					$request = Slim::getInstance()->request();
					$this->saveModulePermission($request);
				});
				
	}
	function getRoles( ){
				$search = "";
				 
				$sql = "select  * from role
				";
			
				try {
				$db = getConnection();
				$stmt = $db->prepare($sql);
			
				$stmt->execute();
				$roles = $stmt->fetchAll(PDO::FETCH_OBJ);
				$db = null;
				// Include support for JSONP requests
				if (!isset($_GET['callback'])) {
				echo json_encode($roles);
				} else {
				echo $_GET['callback'] . '(' . json_encode($roles) . ');';
				}
			
				} catch(PDOException $e) {
				$error = array("error"=> array("text"=>$e->getMessage()));
				echo json_encode($error);
				}
		}
	function getModules( ){
		$search = "";
		if(@$_GET['search'] !=''){
			$search = $_GET['search'];
			$search =  "  where  (r.name LIKE '%". $search ."%') ";
		}
		$sql = "select  r.*, GROUP_CONCAT(CONCAT(modules.id, '-', modules.name)  SEPARATOR ', ')
				as modulename from role as r
				left join rolemodules on rolemodules.roleid = r.id
				left join modules on modules.id = rolemodules.moduleid
				$search  
				group by r.name
				";

		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);

			$stmt->execute();
			$roles = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			// Include support for JSONP requests
			if (!isset($_GET['callback'])) {
				echo json_encode($roles);
			} else {
				echo $_GET['callback'] . '(' . json_encode($roles) . ');';
			}

		} catch(PDOException $e) {
			$error = array("error"=> array("text"=>$e->getMessage()));
			echo json_encode($error);
		}
	}
	function saveRole($r){
		if($this->auth->getLoggedInMessages() == false){
			return false;
		}
		$params = json_decode($r->getBody());
		 
		if(isset($params->id) ){
			 $sql = "update role set name=:p, description=:d where id=".$params->id;
			
			try {
				$db = getConnection();
				$stmt = $db->prepare($sql);
				$stmt->bindParam("p", $params->name);
				$stmt->bindParam("d", $params->description); 
				$stmt->execute();
					
				$db = null;
				echo json_encode($params);
			} catch(PDOException $e) {
				//error_log($e->getMessage(), 3, '/var/tmp/php.log');
				echo '{"error":{"text":'. $e->getMessage() .'}}';
			}
		}else{
			$sql = "INSERT INTO role (name,description,branchid) ";
			$sql .="VALUES (:name,:desc,:branchid)";
			try {
				$db = getConnection();
				$stmt = $db->prepare($sql);
				$stmt->bindParam("desc", $params->description);
				$stmt->bindParam("name", $params->name);
				$stmt->bindParam("branchid", $_SESSION['branchid'] );
				$exec = $stmt->execute();
			
				echo json_encode($db->lastInsertId()  );
				$db = null;
			} catch(PDOException $e) {
				//error_log($e->getMessage(), 3, '/var/tmp/php.log');
				echo '{"error":{"text":'. $e->getMessage() .'}}';
			}
		}


	}
	function saveModulePermission($r){
		$modules = $_POST['modules'];
		$roleid = $_POST['roleid'];
		$modules = explode(",",$modules);
		$this->deleteRolePermission($roleid,$_SESSION['branchid'] );
		foreach($modules as $mod){
			
			$sql = "INSERT INTO rolemodules (roleid, moduleid,isallow,branchid) ";
			$sql .="VALUES (:roleid, :moduleid , 1,:branchid)";
			try {
				$db = getConnection();
				$stmt = $db->prepare($sql);
				$stmt->bindParam("moduleid", $mod);
				$history = $stmt->bindParam("roleid", $roleid);
				$history = $stmt->bindParam("branchid", $_SESSION['branchid'] );
				$stmt->execute();
				$db = null;
				 
			} catch(PDOException $e) {
				//error_log($e->getMessage(), 3, '/var/tmp/php.log');
				echo '{"error":{"text":'. $e->getMessage() .'}}';
			}
		}
		
	
	
	}
	function deleteRolePermission($roleid,$branchid){
		 
		$sql = "delete from rolemodules where roleid = $roleid and branchid = $branchid";
	
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
	function deleteRole(){
		$id = $_GET['id'];
		$sql = "delete from role where id=:id ";
	
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
 