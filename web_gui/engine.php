<?php

//get sensors info ( return an array )
function get_sensors_info($aircon_ip){

	$url= "http://$aircon_ip/aircon/get_sensor_info";
	$data = file_get_contents($url);
	if($data === FALSE){
		return FALSE;
	}else{
		$array=explode(",",$data);
		$sensor_info= array();
		foreach($array as $value){
			$pair= explode("=",$value);
			$sensor_info[$pair[0]]=$pair[1];
		}
		//debug
		//echo var_dump($sensor_info);
	}
	
	return $sensor_info;
}

//get conditioner info ( return an array )
function get_control_info($aircon_ip){
	
	$url= "http://$aircon_ip/aircon/get_control_info";
	$data = file_get_contents($url);
	if($data === FALSE){
		return FALSE;
	}else{
		$array=explode(",",$data);
		$control_info= array();
		foreach($array as $value){
			$pair= explode("=",$value);
			$control_info[$pair[0]]=$pair[1];
		}
		//debug
		//echo var_dump($control_info);
	}
	
	return $control_info;
}

//retrive infos encoded in JSON format
function get_info($uri,$aircon_ip){
	$url= "http://$aircon_ip$uri";
	$data = file_get_contents($url);
	if($data === FALSE){
		return FALSE;
	}else{
		$array=explode(",",$data);
		$control_info= array();
		foreach($array as $value){
			$pair= explode("=",$value);
			$control_info[$pair[0]]=$pair[1];
		}
	}
	return json_encode($control_info);
}
?>
