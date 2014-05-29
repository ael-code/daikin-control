daikin-control
==============

The '''Daikin Emura FTXG-L''' air conditioner comes with a wifi module preinstalled that allows you to control via internet.
The solution provided by Daikin is a mobile app (very well designed) that allows you to control the air conditioner even remotely, exploiting the REST API of the wifi module.

Even if the system works, there are some problems:

- It is no possible to control the AC from a web browser. You must use the official mobile application. If your device is not supported or you are from a computer you can not control your air conditioner over the internet.
- To control your AC remotely from outside your lan, your requests must go through the Daikin server. The device response is slow because the system is based on polling request. (you can't set the ip of the AC on the mobile application)
- Even if the remote management system involves the use of an account with password, there is a big security issue, password and username can be accessed from inside your LAN with a GET request. (try basic_info request)


This project aims to provide 2 main things:

- **unoffcial documentation** of Daikin API needed to control the air conditioner
- **web interface** to manage air conditioner settings

>Throughout this document is to be considered valid for the Daikin Emura FTXG-L with software version 1.4.3

##API System

Daikin original API use REST

You can use GET http request to retrive informations and POST http request to apply new settings.

Uri                | GET | POST | desc
-------------------|-----|------|-----
/common/basic_info | X   |      | Provides Daikin account information (security issue!), software version, mac address and generic info
/common/get_remote_method | X | | Provides information on the polling system
/common/set_remote_method | | X | Set information on the polling system (reduce remote time update ??)
/aircon/get_model_info | X | | Provides model informarion
/aircon/get_control_info | X | | Main Uri to request all current status parameters
/aircon/set_control_info | | X | Main Uri to set status parameters ( control almost all)
/aircon/get_sensor_info | X | | Provides information on temperatures and sensors
/aircon/get_timer  | X | | ?
/aircon/set_timer  | | X | ?
/aircon/get_price  | X | | ?
/aircon/set_price  | | X | ?
/aircon/get_target | X | | ?
/aircon/set_target | | X | ?
/aircon/get_week_power| X | | ?
/aircon/get_year_power| X | | ?
/aircon/get_program | X | | ?
/aircon/set_program | | X | ?
/common/get_notify  | X | | ?
/common/set_notify  | | X | ?
/common/set_regioncode | | X | ?
/common/set_led | | X | ?

##Control Parameters

###Power
param name :  **pow**

description: represents the power state of the device

value | desc
:----:|-----
  0   | OFF
  1   | ON

###Mode

param name :  **mode**

description: represents the operating mode

value | desc
:----:|-----
  1   | AUTO
  2   | DEHUMDIFICATOR
  3   | COLD
  4   | HOT
  6   | FAN


###Fan rate

param name : **f_rate**

description: represents the fan mode

value | desc
:----:|-----
A     | auto
B     | silence
3     | lvl_1
4     | lvl_2
5     | lvl_3
6     | lvl_4
7     | lvl_5


##Unsupported settings
This list show which functionality are not supported in API

- led brightness switch

##Useful resource
- http://daikinsmartdbt.jp/


##Control Info Examples

Switched Off
```
ret=OK,pow=0,mode=7,adv=,stemp=24.0,shum=0,dt1=24.0,dt2=M,dt3=25.0,dt4=25.0,dt5=25.0,dt7=24.0,dh1=0,dh2=50,dh3=0,dh4=0,dh5=0,dh7=0,dhh=50,b_mode=7,b_stemp=24.0,b_shum=0,alert=255,f_rate=4,f_dir=0,b_f_rate=4,b_f_dir=0,dfr1=4,dfr2=5,dfr3=7,dfr4=5,dfr5=5,dfr6=5,dfr7=4,dfrh=5,dfd1=0,dfd2=0,dfd3=3,dfd4=0,dfd5=0,dfd6=0,dfd7=0,dfdh=0
```
Auto 25C ( CONFORT AIR ) ( INTELLIGENT EYE )
```
ret=OK,pow=1,mode=7,adv=,stemp=25.0,shum=0,dt1=25.0,dt2=M,dt3=22.0,dt4=25.0,dt5=25.0,dt7=25.0,dh1=0,dh2=50,dh3=0,dh4=0,dh5=0,dh7=0,dhh=50,b_mode=7,b_stemp=25.0,b_shum=0,alert=255,f_rate=A,f_dir=0,b_f_rate=4,b_f_dir=0,dfr1=4,dfr2=5,dfr3=4,dfr4=5,dfr5=5,dfr6=5,dfr7=4,dfrh=5,dfd1=0,dfd2=0,dfd3=0,dfd4=0,dfd5=0,dfd6=0,dfd7=0,dfdh=0
```
Hot 25c ( AIR silence )
```
ret=OK,pow=1,mode=4,adv=,stemp=25.0,shum=0,dt1=25.0,dt2=M,dt3=22.0,dt4=25.0,dt5=25.0,dt7=25.0,dh1=0,dh2=50,dh3=0,dh4=0,dh5=0,dh7=0,dhh=50,b_mode=4,b_stemp=25.0,b_shum=0,alert=255,f_rate=B,f_dir=0,b_f_rate=B,b_f_dir=0,dfr1=B,dfr2=B,dfr3=B,dfr4=B,dfr5=B,dfr6=B,dfr7=B,dfrh=5,dfd1=0,dfd2=0,dfd3=0,dfd4=0,dfd5=0,dfd6=0,dfd7=0,dfdh=0
```

method=polling&notice_ip_int=3600&notice_sync_int=60
