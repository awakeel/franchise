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
    }
    function getQuickStats( ) {
    
		 $sql = "SELECT * 
					FROM
					(SELECT COUNT(employees.id) AS emp FROM employees   WHERE branchid = $this->branchId ) AS T1,  
					(SELECT COUNT(services.id) AS ser FROM services   WHERE branchid = $this->branchId ) AS T2, 
					(SELECT COUNT(jobtypes.id) AS job  FROM jobtypes   WHERE branchid = $this->branchId ) AS T3,
					(SELECT COUNT(schedule.id) AS sch FROM SCHEDULE   WHERE branchid = $this->branchId ) AS T4 ,
		 		    (SELECT COUNT(branches.id) AS dep FROM branches   WHERE id = $this->branchId ) AS t5  
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
}
?>