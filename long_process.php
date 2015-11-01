<?php
	$maxValue = 100;
	//echo "max/$maxValue";
	
    for($i=90;$i<=$maxValue;$i++){ 
        session_start(); 
        $_SESSION["progress"]=$i; 
        session_write_close(); 
        sleep(1); 
    } 
?>