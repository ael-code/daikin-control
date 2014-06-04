<?php
	require "engine.php";
	require "config.php";
	
	//permits only allowed uri
	if($_POST["uri"] != "/aircon/get_sensor_info" && $_POST["uri"] != "/aircon/get_control_info" ){
		http_response_code(405); //method not allowed
		exit;
	}else{
		print(get_json_info($_POST["uri"],$ip));
	}
?>
