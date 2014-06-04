<?php
	require "engine.php";
	require "config.php";
	
	//permits only allowed uri
	if($_POST["uri"] != "/aircon/get_sensors_info" ||
		$_POST["uri"] != "/aircon/get_control_info"
	){
		http_response_code(405); //method not allowed
		exit;
	}else{
		var_dump(get_json_info($_POST["uri"],$ip));
	}
?>
