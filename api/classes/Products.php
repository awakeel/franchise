<?php
class Products
{ 
	public $branchid;
	// method declaration
	public $auth;
	function __construct($app,$auth){
		$this->branchId = @$_SESSION['branchid'];
	    	$app->get('/products', function () {
	    		$request = Slim::getInstance()->request(); 
	    		$this->getAllByBranchId($request);
	    	});
    		$app->post('/products',function(){
	    		$request = Slim::getInstance()->request();
	    			$this->saveProducts($request);
    		});
    		$app->get('/deleteproducts',function(){
    			$request = Slim::getInstance()->request();
    			$this->deleteProducts($request);
    		});
    		$app->post('/pictureuploads',function(){
    			$this->fileUpload();
    		});
    		 
    			
    }
    
    function getAllByBranchId($request) { 
    	$search = "";
    	if(isset($_GET['search'])){
    		$search = $_GET['search'];
    		$search =  "  AND  (name LIKE '%". $search ."%' OR description LIKE '%". $search ."%')";
    	}
    	$franchiseid = 0;
    	if(isset($_GET['franchiseid'])  && !empty($_GET['franchiseid'])){
    		$franchiseid = $_GET['franchiseid'];
    	 
    	} 
    	$sql = "select * from products where franchiseid ='".$franchiseid."'  $search order by id desc";
    	    try {
              	$products = R::getAll($sql);
            // Include support for JSONP requests
	            if (!isset($_GET['callback'])) {
	                echo json_encode($products);
	            } else {
	                echo $_GET['callback'] . '(' . json_encode($products) . ');';
	            }
 			 } catch(PDOException $e) {
                    $error = array("error"=> array("text"=>$e->getMessage()));
                    echo json_encode($error);
            }
    }
    function fileUpload(){
    	//https://github.com/a1y25/jquery---multiple-files-generate-multiple-forms-and-ajax-upload/blob/master/index.html
    	//if(isset($_POST['image'])){
    	$error = false;
    	$files = array();
    	 
    	$uploaddir = '../products/images/';
    	foreach($_FILES as $file)
    	{
    		if(move_uploaded_file($file['tmp_name'], $uploaddir .basename($file['name'])))
    		{
    			$files[] = $uploaddir .$file['name'];
    		}
    		else
    		{
    			$error = true;
    		}
    	}
    	$data = ($error) ? array('error' => 'There was an error uploading your files') : array('files' => $files);
    	echo json_encode($file['name']);
    }
    function saveProducts($request){
    	    
    		$params = json_decode($request->getBody());
    		try {
	    		if(isset($params->id) && !empty($params->id)){
	    			$products = R::dispense( 'products' );
	    			$products->id = $params->id;
	    			$products->name = $params->name;
	    			$products->color = $params->color;
	    			$products->comments = $params->comments;
	    			$products->franchiseid = $params->franchiseid;
	    			
	    			$id = R::store($products);
	    		}else{
	    			$products = R::dispense( 'products' );
	    			 $products->name = $params->name;
	    			 $products->price = $params->price;
	    			 $products->description = $params->description;
	    			 $products->image = $params->image;
	    			 $products->franchiseid = $params->franchiseid;
	    			 $products->createdon = R::isoDate(); 
	    			 $products->serviceid = $params->serviceid;
	    			 $products->branchid = $params->branchid;
	    			 $id = R::store($products);
	    		}
    		  		echo json_encode($params);
    		 } catch(PDOException $e) {
    			  echo '{"error":{"text":'. $e->getMessage() .'}}';
    		 }
    		 
    	 
    }
    function deleteJobTypes(){
    	 $id = $_GET['id'];
    	$sql = "delete from products where id=$id";
    	 
    	try {
    		$products = R::exec($sql);
    		echo json_encode($id);
    	} catch(Exception $e) {
    		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    		echo json_encode(['error'=>'Integrity constraint'] );
    	}
    }
}
?>