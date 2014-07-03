<?php
require "engine.php";
require "config.php";

if($_SERVER["REQUEST_METHOD"] == "POST"){
	$aRequest = json_decode(file_get_contents('php://input'), true);
   $json_ret = set_array_info("/aircon/set_control_info",$ip,$aRequest);
   //request failed
   if($json_ret===FALSE){
	   http_response_code(503); //service Unavailable 
      exit;
   }
	print($json_ret);

}else if($_SERVER["REQUEST_METHOD"] == "GET"){
	//control if uri is sended
	if( (! isset($_GET["uri"])) || ( 
		$_GET["uri"] != "/aircon/get_sensor_info" && 
		$_GET["uri"] != "/aircon/get_control_info" 
		)){
		http_response_code(405); //method not allowed
		exit;
	}
	
	$json_info=get_json_info($_GET["uri"],$ip);
	//request failed
	if($json_info===FALSE){
		http_response_code(503); //service Unavailable 
		exit;
	}
	print($json_info);
}
?>
