var request_control_loading = 0;
var request_sensor_loading = 0;
var timer = 5000; //millisecond

function request_control() {
	
	var xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange  = function () {
		if ( xmlhttp.readyState == 4 ){
			request_control_loading=0;
			if((! request_control_loading) && (! request_sensor_loading)){set_loading(0);}
			if( xmlhttp.status==200 ){
				var jsonObj = JSON.parse(xmlhttp.responseText);
				control_response_handler(jsonObj);
				setTimeout(request_control, timer);
			}else{
				console.log("Error: control ajax request failed");
				set_alert(1,"<b>Error:</b> control ajax request failed");
			}
		}else{
			//alert(xmlhttp.readyState);
		}
	}
	xmlhttp.open("POST","http://tommyael.tk/aircon/api.php",true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send("uri=/aircon/get_control_info");
	request_control_loading = 1;
	set_loading(1);
}

function request_sensor(){
	var xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange  = function () {
		if ( xmlhttp.readyState == 4 ){
		request_sensor_loading=0;
			if((! request_control_loading) && (! request_sensor_loading)){set_loading(0);}
			if( xmlhttp.status==200 ){
				var jsonObj = JSON.parse(xmlhttp.responseText);
				sensor_response_handler(jsonObj);
				setTimeout(request_sensor, timer);
			}else{
				console.log("Error: sensor ajax request failed");
				set_alert(1,"<b>Error:</b> sensor ajax request failed");
			}
		}else{
			
			//alert(xmlhttp.readyState);
		}
	}
	xmlhttp.open("POST","http://tommyael.tk/aircon/api.php",true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send("uri=/aircon/get_sensor_info");
	request_sensor_loading = 1;
	set_loading(1);
}

function control_response_handler(jsonObj){
	reset_mode();
	reset_fan();
	set_target_temp(parseInt(jsonObj.stemp));
	set_power(parseInt(jsonObj.pow));
	set_mode(parseInt(jsonObj.mode));
	var f_mode = jsonObj.f_rate;
	if(f_mode === "A"){
		f_mode = 1;	
	}else if(f_mode === "B"){
		f_mode = 2;
	}else{
		f_mode = parseInt(f_mode);
	}
	set_fan(f_mode);
}

function sensor_response_handler(jsonObj){
	set_home_temp(parseInt(jsonObj.htemp));
	set_outside_temp(parseInt(jsonObj.otemp));
}


function set_power(boolean){
	power = document.getElementById("power")
	if(boolean){
		power.innerHTML = " ON";				
	}else{
		power.innerHTML = " OFF";
	}
}

function reset_mode(){
	var mode_list= document.getElementsByClassName("mode-btn btn-info");
	
	for(var i=0; i<mode_list.length; ++i){
		mode_list[i].className="btn btn-default mode-btn";
	}
}

function set_mode(mode){
	if(mode === 1 || mode === 7) mode = 0;
	
	//0-1-7 auto
	//2 dehum
	//3 cooling
	//4 heating
	//6 fan
	switch(mode){
		case 0:
			document.getElementById("mode_auto").className="btn btn-info mode-btn";
			break;
		case 2:
			document.getElementById("mode_dehum").className="btn btn-info mode-btn";
			break;
		case 3:
			document.getElementById("mode_cooling").className="btn btn-info mode-btn";
			break;
		case 4:
			document.getElementById("mode_heating").className="btn btn-info mode-btn";
			break;
		case 6:
			document.getElementById("mode_fan").className="btn btn-info mode-btn";
			break;
		default:
			console.log("set_mode() switch: default case reached");
	}
}

function set_home_temp(temp){
	document.getElementById("home_temp").innerHTML=" "+temp+" C";	
}

function set_outside_temp(temp){
	document.getElementById("outside_temp").innerHTML=" "+temp+" C";
}

function set_target_temp(temp){
	document.getElementById("target_temp").innerHTML=" "+temp+" C";	
}

function set_fan(f_mode){				
	switch(f_mode){
		case 1:
			document.getElementById("fan_auto").className="btn btn-info fan-btn";
			break;
		case 2:
			document.getElementById("fan_eco").className="btn btn-info fan-btn";
			break;
		case 3:
			document.getElementById("fan_lvl_img").src="media/level_1.png";
			break;
		case 4:
			document.getElementById("fan_lvl_img").src="media/level_2.png";
			break;
		case 5:
			document.getElementById("fan_lvl_img").src="media/level_3.png";
			break;
		case 6:
			document.getElementById("fan_lvl_img").src="media/level_4.png";
			break;
		case 7:
			document.getElementById("fan_lvl_img").src="media/level_5.png";
			break;
		
		default:
			console.log("set_fan() switch: default case reached");
	}
}

function reset_fan(){
	var fan_list= document.getElementsByClassName("btn-info fan-btn");
	for(var i=0; i<fan_list.length; ++i){
		fan_list[i].className="btn btn-default fan-btn";
	}
	document.getElementById("fan_lvl_img").src="media/level_0.png";
}
function set_loading(boolean){
	var spinner = document.getElementById("spinner");
	if(boolean){
		spinner.classList.remove("sr-only");
	}else{
		spinner.classList.add("sr-only");
	}
}

function set_alert(boolean,mex){
	var alert = document.getElementById("alert");
	if(boolean){
		alert.classList.remove("sr-only")
		alert.className="alert alert-danger";
		alert.lastElementChild.innerHTML=mex;
		
	}else{
		alert.className="alert alert-danger sr-only";
		alert.classList.add("sr-only");
	
	}
}

function update(){
	request_control();
	request_sensor();
}

update();
