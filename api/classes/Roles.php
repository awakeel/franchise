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
			   try {
				
				$roles =  R::getAll( 'SELECT * FROM role WHERE franchiseid = :franchiseid',
				 [':franchiseid' => $_GET['franchiseid']]
				 );
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
		if(isset($_GET['search']) && !empty($_GET['search']) !=''){
			$search = $_GET['search'];
			$search =  "  and  (r.name LIKE '%". $search ."%') ";
		}
		$franchiseid  = "";
		if(isset($_GET['franchiseid']) && !empty($_GET['franchiseid'])){
			$f = $_GET['franchiseid'];
			$franchiseid = "where r.franchiseid = $f";
		}
		$sql = "select  r.*, GROUP_CONCAT(CONCAT(modules.id, '-', modules.name)  SEPARATOR ', ')
				as modulename from role as r
				left join rolemodules on rolemodules.roleid = r.id
				left join modules on modules.id = rolemodules.moduleid
				$franchiseid
				 $search   
				group by r.name
				";
		 
		try {
			$roles =  R::getAll( $sql);
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
			$sql = "INSERT INTO role (name,description,franchiseid) ";
			$sql .="VALUES (:name,:desc,:franchiseid)";
			try {
				$db = getConnection();
				$stmt = $db->prepare($sql);
				$stmt->bindParam("desc", $params->description);
				$stmt->bindParam("name", $params->name);
				$stmt->bindParam("franchiseid", $_SESSION['franchiseid'] );
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
		$this->deleteRolePermission($roleid,$_SESSION['franchiseid'] );
		foreach($modules as $mod){
			
			$sql = "INSERT INTO rolemodules (roleid, moduleid,isallow,franchiseid) ";
			$sql .="VALUES (:roleid, :moduleid , 1,:franchiseid)";
			try {
				$db = getConnection();
				$stmt = $db->prepare($sql);
				$stmt->bindParam("moduleid", $mod);
				$history = $stmt->bindParam("roleid", $roleid);
				$history = $stmt->bindParam("franchiseid", $_SESSION['franchiseid'] );
				$stmt->execute();
				$db = null;
				 
			} catch(PDOException $e) {
				//error_log($e->getMessage(), 3, '/var/tmp/php.log');
				echo '{"error":{"text":'. $e->getMessage() .'}}';
			}
		}
		
	
	
	}
	function deleteRolePermission($roleid,$franchiseid){
		 
		$sql = "delete from rolemodules where roleid = $roleid and franchiseid = $franchiseid";
	
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql); 
			$stmt->execute();
			$db = null; 
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
			echo json_encode(['error'=>'Integrity constraint'] );
		}
	}

}
?>
 