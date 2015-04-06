<?php
class Common
{ 
	public $branchId;
    // method declaration
    function __construct($app){
    	$this->branchId  = @$_SESSION['branchid'];
    	$app->get('/countries', function () {
    		$this->getAllCountries( );
    	});
    		$app->get('/currencies', function () {
    			$this->getAllCurrencies(  );
    		});
    			$app->get('/timings', function () {
    				$this->getAllTimings(  );
    			});
    				$app->get('/dashboard/quickstats', function () {
    					$this->getQuickStats(  );
    				});
    					$app->get('/savepackage', function () {
    						$this->savePackage(  );
    					});
    					$app->get('/cities', function () {
    						$this->getCities(  );
    					});
    						$app->get('/package', function () {
    							$this->getAllPackages(  );
    						});
    							$app->get('/getallsystempackages', function () {
    								$this->getAllSystemPackages(  );
    							});
    					
    }
    function getAllPackages(){
    	$franchiseid = $_GET['franchiseid'];
    	$sql = "
    			 select ph.*,ph.createdon as createdtime ,p.*,f.noofsms from packageshistory ph inner join packages p on p.id = ph.packageid
    	 inner join franchises f on f.id = ph.franchiseid  where ph.franchiseid=$franchiseid order by ph.createdon DESC";
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
    function increaseSMS(){
    	$franchiseid = @$_GET['franchiseid'];
    	$sms = @$_GET['sms'];
    	if(!$sms)
    		$sms = 0;
    	$sql = "UPDATE franchises SET noofsms=noofsms + $sms   where id=$franchiseid";
    	 
    	try {
    		R::exec($sql);
    		echo json_encode(1);
    	} catch(Exception $e) {
    		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    		echo json_encode(['error'=>$e->getMessage()]);
    	} 
     
    }
    function getAllSystemPackages(){
    	 $sql = "select * from packages";
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
    function savePackage(){
	    $pid = @$_GET['packageid'];
	    $id = @$_GET['franchiseid'];
	    $sql = "update franchises set packageid=$pid where franchiseid = $id";
	    
    	try {
    	    R::exec($sql);
    	    echo json_encode(1);
    	} catch(Exception $e) {
    		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    			echo json_encode(['error'=>$e->getMessage()]);
    	}
    	$this->increaseSMS();
    	$this->savePackageHistory();
    
    }
    function savePackageHistory(){
    	$pid = @$_GET['packageid'];
    	$id = @$_GET['franchiseid']; 
    	$sql = "update packageshistory set currentpackage=0 where franchiseid = $id";
    	$sql1  = "insert into packageshistory(packageid,currentpackage,createdon,franchiseid)
    	           values($pid,'1',NOW(),$id)";
    	 
    	try {
    		
    		R::exec($sql);
    		R::exec($sql1);
    		echo json_encode(1);
    	} catch(Exception $e) {
    		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    		echo json_encode(['error'=>$e->getMessage()]);
    	}
    
    
    }
    function getQuickStats( ) {
    	$franchiseid = $_SESSION['franchiseid'];
		 $sql = "SELECT * 
					FROM
					(select Count(employees.id) as emp from employees where franchiseid = $franchiseid) as t1,
					(SELECT COUNT(services.id) AS ser FROM services   WHERE franchiseid = $franchiseid ) AS T2, 
					(SELECT COUNT(jobtypes.id) AS job  FROM jobtypes   WHERE franchiseid = $franchiseid ) AS T3,
					(SELECT COUNT(schedule.id) AS sch FROM schedule   WHERE branchid = $this->branchId ) AS T4 ,
		 		    (SELECT COUNT(branches.id) AS dep FROM branches   WHERE franchiseid =$franchiseid ) AS t5  
		 		 ";
    	try {
    		$db = getConnection();
    		$stmt = $db->prepare($sql);
    		$stmt->execute();
    		$quickstats = $stmt->fetchAll(PDO::FETCH_OBJ);
    		$db = null;
    
    		// Include support for JSONP requests
    		if (!isset($_GET['callback'])) {
    			echo json_encode($quickstats);
    		} else {
    			echo $_GET['callback'] . '(' . json_encode($quickstats) . ');';
    		}
    
    	} catch(PDOException $e) {
    		$error = array("error"=> array("text"=>$e->getMessage()));
    		echo json_encode($error);
    	}
    }
    function getAllCountries( ) { 
          
        $sql = "select * from countries";
            try {
                    $db = getConnection();
                    $stmt = $db->prepare($sql); 
                    $stmt->execute();
                    $countries = $stmt->fetchAll(PDO::FETCH_OBJ);
                    $db = null;

            // Include support for JSONP requests
            if (!isset($_GET['callback'])) {
                echo json_encode($countries);
            } else {
                echo $_GET['callback'] . '(' . json_encode($countries) . ');';
            }

            } catch(PDOException $e) {
                    $error = array("error"=> array("text"=>$e->getMessage()));
                    echo json_encode($error);
            }
    }
    function getAllCurrencies( ) {
    
    	$sql = "select * from currencies order by code desc limit 30,50 ";
    	try {
    		$db = getConnection();
    		$stmt = $db->prepare($sql);
    		$stmt->execute();
    		$currencies = $stmt->fetchAll(PDO::FETCH_OBJ);
    		$db = null;
    
    		// Include support for JSONP requests
    		if (!isset($_GET['callback'])) {
    			echo json_encode($currencies);
    		} else {
    			echo $_GET['callback'] . '(' . json_encode($currencies) . ');';
    		}
    
    	} catch(PDOException $e) {
    		$error = array("error"=> array("text"=>$e->getMessage()));
    		echo json_encode($error);
    	}
    }
    
    function getAllTimings( ) {
    
    	$sql = "select * from timings where branchid = $this->branchId ";
    	try {
    		$db = getConnection();
    		$stmt = $db->prepare($sql);
    		$stmt->execute();
    		$timings = $stmt->fetchAll(PDO::FETCH_OBJ);
    		$db = null;
    
    		// Include support for JSONP requests
    		if (!isset($_GET['callback'])) {
    			echo json_encode($timings);
    		} else {
    			echo $_GET['callback'] . '(' . json_encode($timings) . ');';
    		}
    
    	} catch(PDOException $e) {
    		$error = array("error"=> array("text"=>$e->getMessage()));
    		echo json_encode($error);
    	}
    }
    function getCities( ) { 
        $country =  @$_GET['country'];
    	$sql = "select * from data_adres_city where CountryCode='".$country."'";
    	try {
    		$timings = R::getAll($sql);
    
    		// Include support for JSONP requests
    		if (!isset($_GET['callback'])) {
    			echo json_encode($timings);
    		} else {
    			echo $_GET['callback'] . '(' . json_encode($timings) . ');';
    		}
    
    	} catch(PDOException $e) {
    		$error = array("error"=> array("text"=>$e->getMessage()));
    		echo json_encode($error);
    	}
    }
}
?>