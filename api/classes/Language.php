<?php
class Language
{
    public $offset = 0;
	public $app = null;
    // method declaration
    public $branchId;
    function __construct($app){
    	// Section language
    	 $this->branchId = @$_SESSION['franchiseid'];
    	$app->get('/languages', function () {
            if(authorize('abc')){
                $this->getLanguages(1);
            }
    	});
    	$app->get('/languagetranslate', function () {
    		$fields = $_GET['specific'];
    		$langugeid = $_GET['languageid'];
    		if($fields == "0"){
    			 	$search = $_GET['search'];
    				 $this->fetchLanguages($langugeid,$search); 
    		}else{
    			 	$this->fetchLanguagesSpecific($langugeid);
    			 
    		}
    			
    	});
    	$app->post('/languagetranslate', function () {
    	        $request = Slim::getInstance()->request();
    			$this->saveLanguageTranslate($request);
    		 
    	});
    	$app->get('/deletelanguage',function(){
    		 
    			
    			$request = Slim::getInstance()->request();
    			$this->deleteLanguageTranslate($_GET['id']);
    		 
    	});
    }
    function getLanguages( ) {  
        $sql = "select * from languages";
            try {
                    $db = getConnection();
                    $stmt = $db->query($sql);
                    $languages = $stmt->fetchAll(PDO::FETCH_OBJ);
                    $db = null;

            // Include support for JSONP requests
            if (!isset($_GET['callback'])) {
                echo json_encode($languages,true);
            } else {
                echo $_GET['callback'] . '(' . json_encode($languages,true) . ');';
            }

            } catch(PDOException $e) {
                    $error = array("error"=> array("text"=>$e->getMessage()));
                    echo json_encode($error,true);
            }
    }
    function fetchLanguagesSpecific($languageid) { 
          
        $sql = "select title,languagetitle from languagetranslate where languageid = :id  ";
            try {
                    $db = getConnection();
                    $stmt = $db->prepare($sql);
                    $stmt->bindParam("id", $languageid);
                    $stmt->execute();
                    $languages = $stmt->fetchAll(PDO::FETCH_OBJ);
                    $db = null;

            // Include support for JSONP requests
            if (!isset($_GET['callback'])) {
                echo json_encode($languages);
            } else {
                echo $_GET['callback'] . '(' . json_encode($languages) . ');';
            }

            } catch(PDOException $e) {
                    $error = array("error"=> array("text"=>$e->getMessage()));
                    echo json_encode($error);
            }
    }
    function fetchLanguages($languageid,$search) {
        if($search)
        	$search = "and title like %$search%";
    	$sql = "select * from languagetranslate where languageid =:id  $search";
    	try {
    		$db = getConnection();
    		$stmt = $db->prepare($sql);
    		$stmt->bindParam("id", $languageid);
    	 
    		$stmt->execute();
    		$languages = $stmt->fetchAll(PDO::FETCH_OBJ);
    		$db = null;
    
    		// Include support for JSONP requests
    		if (!isset($_GET['callback'])) {
    			echo json_encode($languages);
    		} else {
    			echo $_GET['callback'] . '(' . json_encode($languages) . ');';
    		}
    
    	} catch(PDOException $e) {
    		$error = array("error"=> array("text"=>$e->getMessage()));
    		echo json_encode($error);
    	}
    }
    function saveLanguageTranslate($request){
    	 
    		$params = json_decode($request->getBody());
    		if(@$params->id){
    			$sql = "update languagetranslate set languageid=:languageid, title=:title,languagetitle=:languagetitle  ";
    			$sql .=" where id=:id";
    			try {
    				$db = getConnection();
    				$stmt = $db->prepare($sql);
    				$stmt->bindParam("languageid", $params->languageid);
    				$stmt->bindParam("title", $params->title);
    				$stmt->bindParam("languagetitle", $params->languagetitle);
    				$stmt->bindParam("id", $params->id);
    				$stmt->execute();
    				 
    				$db = null;
    				echo json_encode($params);
    			 } catch(PDOException $e) {
    				//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    				echo '{"error":{"text":'. $e->getMessage() .'}}';
    			}
    		}else{
		    		$sql = "INSERT INTO languagetranslate (languageid, title,languagetitle) ";
		    		$sql .="VALUES (:languageid, :title,  :languagetitle)";
		    		try {
		    			$db = getConnection();
		    			$stmt = $db->prepare($sql);
		    			$stmt->bindParam("languageid", $params->languageid);
		    			$stmt->bindParam("title", $params->title);
		    			$stmt->bindParam("languagetitle", $params->languagetitle); 
		    	
		    			$stmt->execute();
		    			$params->id = $db->lastInsertId();
		    			$db = null;
		    			echo json_encode($params);
		    		} catch(PDOException $e) {
		    			//error_log($e->getMessage(), 3, '/var/tmp/php.log');
		    			echo '{"error":{"text":'. $e->getMessage() .'}}';
		    		}
    		}
    	 
    }
    function deleteLanguageTranslate($id){
    	 
    	$sql = "delete from languagetranslate where id=:id ";
    	 
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