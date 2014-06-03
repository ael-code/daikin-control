<?php

$aircon_ip="192.168.1.11";

//------------------------------------------

require "engine.php";
	
$sensor_info = get_sensors_info($aircon_ip);
if( $sensor_info === FALSE){
	echo "ERROR: host not found";
	exit(1);
}

$control_info = get_control_info($aircon_ip);
if( $control_info === FALSE){
	echo "ERROR: host not found";
	exit(1);
}
	
?>

<!DOCTYPE html>
<html>
<head>
	<!-- Bootstrap -->
	<link href="/bootstrap/css/bootstrap.min.css" rel="stylesheet">

	<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
	<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
	<!--[if lt IE 9]>
		<script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
	   <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
	<![endif]-->
	<title>Home Temperature</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<style type="text/css">
   	body {
   	  padding-top: 10px;
   	 }
	</style>
</head>
	<!--page content-->
<body>
	<div class='container'>
		<!-- ON/OFF -->
		<div class="row">
	  		<div class="col-sm-offset-10 col-sm-2">
	  		<?php
	  		print '<b><span class="glyphicon glyphicon-off" ';
	  		if(  $control_info["pow"] == "0" ){
	  			print 'style="font-size:1.6em;color:red;text-shadow: 0px 0px 2px red;"/> OFF';
	  		} else {
	  			print 'style="font-size:1.6em;color:green;text-shadow: 0px 0px 2px green;"/> ON';
	  		}
	  		print '</b>'
	  		?>
	  		</div>
	  	</div>
		<!-- TEMPERATURES -->
		<h3>Temperatures</h3>
		<div class="row">
	  		<div class="col-sm-6">
				<div class="panel panel-default">
				  <div style="font-size:2em;" class="panel-body">
					<span class="glyphicon glyphicon-home" />
					<b><?php echo $sensor_info["htemp"] ?> C</b>
				  </div>
				</div>
			</div>
	  		<div class="col-sm-6">
				<div class="panel panel-default">
		         <div style="font-size:2em;" class="panel-body">
						<span class="glyphicon glyphicon-tree-deciduous" />
						<b><?php echo $sensor_info["otemp"]?> C</b>
		        	</div>
		      </div>
			</div>
		</div>
		
	</div>
	
	<script>
		function timedRefresh(timeoutPeriod) {
				setTimeout("location.reload(true);",timeoutPeriod);
			}
		timedRefresh(3000);
	</script>
</body>
</html>
