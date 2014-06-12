var request_control_loading = 0;
var request_sensor_loading = 0;
var timer = 5000; //millisecond

var control_response;
var control_timeout;

var sensor_response;
var sensor_timeout;


function request_control() {
	
	var target="api.php";
	var request="GET";
	var parameters="uri=/aircon/get_control_info";
	
	var xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange  = function () {
		if ( xmlhttp.readyState == 4 ){
			request_control_loading=0;
			if((! request_control_loading) && (! request_sensor_loading)){set_loading(0);}
			if( xmlhttp.status==200 ){
				var response = JSON.parse(xmlhttp.responseText);
				control_response=response;
				control_response_handler(response);
				control_timeout = setTimeout(request_control, timer);
			}else{
				console.log("Error: control ajax request failed");
				set_alert(1,"<b>Error:</b> control ajax request failed");
			}
		}else{
			//alert(xmlhttp.readyState);
		}
	}
	
	xmlhttp.open(request,target + "?" + parameters ,true);
	xmlhttp.send();
	request_control_loading = 1;
	set_loading(1);
}

function send_control(opts){
	var target="api.php";
	var request="POST";
	
	var xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange  = function () {
		if ( xmlhttp.readyState == 4 ){
			if( xmlhttp.status==200 ){
				var response = JSON.parse(xmlhttp.responseText);
				console.log(response);
			}else{
				console.log("Error: send control request failed");
			}
		}else{
			//alert(xmlhttp.readyState);
		}
	}
	
	xmlhttp.open(request,target,true);
	xmlhttp.setRequestHeader("Content-type","application/json");
	xmlhttp.send(JSON.stringify(opts));
		
}

function request_sensor(){
	
	var target="api.php";
	var request="GET";
	var parameters="uri=/aircon/get_sensor_info";
	
	var xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange  = function () {
		if ( xmlhttp.readyState == 4 ){
		request_sensor_loading=0;
			if((! request_control_loading) && (! request_sensor_loading)){set_loading(0);}
			if( xmlhttp.status==200 ){
				var response = JSON.parse(xmlhttp.responseText);
				sensor_response=response;
				sensor_response_handler(response);
				sensor_timeout = setTimeout(request_sensor, timer);
			}else{
				console.log("Error: sensor ajax request failed");
				set_alert(1,"<b>Error:</b> sensor ajax request failed");
			}
		}else{
			
			//alert(xmlhttp.readyState);
		}
	}
	xmlhttp.open(request,target + "?" + parameters ,true);
	//xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send();
	request_sensor_loading = 1;
	set_loading(1);
}

function control_response_handler(response){
	reset_wing();
	reset_fan();
	reset_mode();
	
	//target temp
	
	var target_temp =parseInt(response.stemp);
	
	if(response.mode === "0" || response.mode === "1"){	
		if(target_temp <= 18){
			set_target_temp_arrow( 1,true	);		
			set_target_temp_arrow(-1,false);
		}else if( target_temp >= 31 ){
			set_target_temp_arrow( 1,false);
			set_target_temp_arrow(-1,true	);
		}else{
			set_target_temp_arrow( 1,true);
			set_target_temp_arrow(-1,true	);	
		}
	}else if(response.mode === "3"){
		if(target_temp <= 18){
			set_target_temp_arrow( 1,true	);		
			set_target_temp_arrow(-1,false);
		}else if( target_temp >= 33 ){
			set_target_temp_arrow( 1,false);
			set_target_temp_arrow(-1,true	);
		}else{
			set_target_temp_arrow( 1,true);
			set_target_temp_arrow(-1,true	);	
		}
	}else if(response.mode === "4"){
		if(target_temp <= 10){
			set_target_temp_arrow( 1,true	);		
			set_target_temp_arrow(-1,false);
		}else if( target_temp >= 31 ){
			set_target_temp_arrow( 1,false);
			set_target_temp_arrow(-1,true	);
		}else{
			set_target_temp_arrow( 1,true);
			set_target_temp_arrow(-1,true	);	
		}
	}else{
		set_target_temp_arrow( 1,true);
		set_target_temp_arrow(-1,true	);
	}
	
	set_target_temp(target_temp);
	
	
	set_power(parseInt(response.pow));
	set_mode(parseInt(response.mode));
	var f_mode = response.f_rate;
	if(f_mode === "A"){
		f_mode = 1;	
	}else if(f_mode === "B"){
		f_mode = 2;
	}else{
		f_mode = parseInt(f_mode);
	}
	set_fan(f_mode);
	set_wing(parseInt(response.f_dir));
}

function sensor_response_handler(response){
	set_home_temp(parseInt(response.htemp));
	set_outside_temp(parseInt(response.otemp));
}

function minimize_opt(opt){
	var min_opt = {};
	
	for (var x in opt) {
    	if(x == "pow" 		||
    		x == "mode" 	||
    		x == "stemp" 	||
    		x == "shum" 	||
    		x == "f_rate" 	||
    		x == "f_dir"    		
    	){
    		min_opt[x] = opt[x];
    	}
   }
   
   return min_opt;
}


//----------ON CLICK FUNCTIONS------------


function mode_onclick(num){
	if(!control_response) return;
	var temp = minimize_opt(control_response);
	temp["mode"] = num;
	temp["f_rate"] = control_response["dfr"+num];
	temp["f_dir"] = control_response["dfd"+num];
	temp["shum"] = "0";
	if(num == "6"){
		temp["stemp"] = "0";
	}else{
		temp["stemp"] = control_response["dt"+num];
	}
	send_control(temp);
	update();
}

function power_onclick(){
	if(!control_response) return;
	var temp = minimize_opt(control_response);
	temp.pow = ((temp.pow == "0") ? 1 : 0);
	send_control(temp);
	update();
}

function fan_onclick(level){
	if(!control_response) return;
	var temp = minimize_opt(control_response);
	temp.f_rate = level;
	send_control(temp);
	update();
}

function wing_onclick(num){
	if(!control_response) return;
	var temp = minimize_opt(control_response);
	if(num == control_response.f_dir){
		temp.f_dir = 0;
	}else{
		temp.f_dir = num;
	}
	send_control(temp);
	update();
}

function temp_onclick(inc){
	if(!control_response) return;
	var temp = minimize_opt(control_response);
	temp.stemp = (parseInt(control_response.stemp) + inc).toString();
	send_control(temp);
	update();
}


//---------GUI SET FUNCTIONS------------

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
	if(isNaN(temp)){
		show_target_temp(0);
		document.getElementById("target_temp").innerHTML=" ~ ";
	}else{
		document.getElementById("target_temp").innerHTML=" "+temp+" C";
		show_target_temp(1);
	}
}

function show_target_temp(boolean){
	var tt_col = document.getElementById("target_temp_col");
	if(boolean){
		tt_col.classList.remove("sr-only");
	}else{
		tt_col.classList.add("sr-only");
	}
}

function set_target_temp_arrow(inc,boolean){
	var arrow_id;
	if(inc == 1) arrow_id = "target_temp_up";
	else if (inc == -1) arrow_id = "target_temp_down";
	else console.log("arrow inc not recognized");
	
	var arrow_node = document.getElementById(arrow_id);
	
	if(boolean)	arrow_node.classList.remove("disabled");
	else arrow_node.classList.add("disabled");
	
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
			set_fan_img(1);
			break;
		case 4:
			set_fan_img(2);
			break;
		case 5:
			set_fan_img(3);
			break;
		case 6:
			set_fan_img(4);
			break;
		case 7:
			set_fan_img(5);
			break;
		
		default:
			console.log("set_fan() switch: default case reached");
	}
}

function set_fan_img(num){
	var temp;
	for(var i=1; i<6; ++i){
		temp = document.getElementById("fan_lvl_" + i.toString());
		if(i <= num){
			temp.src="media/level_"+i.toString()+"_on.svg";
		}else{
			temp.src="media/level_"+i.toString()+"_off.svg";
		}
	}
}

function reset_fan(){
	var fan_list= document.getElementsByClassName("fan-btn");
	for(var i=0; i<fan_list.length; ++i){
		fan_list[i].classList.remove("btn-info");
		fan_list[i].classList.add("btn-default");
	}
	set_fan_img(0);
}

function reset_wing(){
	var wing_list = document.getElementsByClassName("wing-btn");
	for(var i=0; i<wing_list.length; ++i){
		wing_list[i].classList.remove("btn-info");
		wing_list[i].classList.add("btn-default");
	}
}

function set_wing(wing_mode){
	switch(wing_mode){
		case 0:
			reset_wing();
			break;
		case 1:
			var elem = document.getElementById("wing_v");
			elem.classList.remove("btn-default");
			elem.classList.add("btn-info");
			break;
		case 2:
			var elem = document.getElementById("wing_h");
			elem.classList.remove("btn-default");
			elem.classList.add("btn-info");
			break;
		case 3:
			var elem = document.getElementById("wing_b");
			elem.classList.remove("btn-default");
			elem.classList.add("btn-info");
			break;
		default:
			console.log("set_wing() switch: default case reached");
	}
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
	clearTimeout(control_timeout);
	clearTimeout(sensor_timeout);
	if( ! request_control_loading )
		request_control();
	if( ! request_sensor_loading )
		request_sensor();
}

update();
