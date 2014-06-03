<?php
	if($_SERVER['REQUEST_METHOD'] == 'POST'){
	echo "no post request";
	}else{
	echo "post request";}
	var_dump($_POST);
	require "engine.php";
	var_dump(get_info($_POST["uri"],$_POST["ip"]));
?>
