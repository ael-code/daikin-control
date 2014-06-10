<?php
	require "engine.php";
	require "config.php";
	
	//control if uri is sended
	if(! isset($_GET["uri"])){
		http_response_code(405); //method not allowed
		exit;
	}
	
	
	if($_GET["uri"] == "/aircon/set_control_info"){
		echo $_SERVER["QUERY_STRING"];
	}else if($_GET["uri"] == "/aircon/get_sensor_info" || $_GET["uri"] == "/aircon/get_control_info"){
		$json_info=get_json_info($_GET["uri"],$ip);
		//request failed
		if($json_info===FALSE){
			http_response_code(503); //service Unavailable 
			exit;
		}
		print(get_json_info($_GET["uri"],$ip));
	}else{
		http_response_code(405); //method not allowed
		exit;
	}
?>
