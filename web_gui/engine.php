<?php

//retrive infos encoded in php array
function get_array_info($uri,$aircon_ip){
	
	$url= "http://$aircon_ip$uri";
	$data = @file_get_contents($url);
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
	return $control_info;
}

//retrive infos encoded in JSON format
function get_json_info($uri,$aircon_ip){
	$array_info=get_array_info($uri,$aircon_ip);
	if($array_info === FALSE)
		return FALSE;
	return json_encode($array_info);
}

?>
