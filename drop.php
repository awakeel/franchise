<?php

$con=mysql_connect('mysql16.unoeuro.com','outsourced_dk','gJuTgT6j3');
mysql_select_db('outsourced_dk_db');

$database_tables = mysql_query('show tables');

$preserve_tables = array('countries','currencies','customers');

/*
*  Check the tables to clean up and clear all the data
*/

while($row=mysql_fetch_array($database_tables)){

 $table = trim($row[0]);
 if(!(in_array($table,$preserve_tables))){
  mysql_query("truncate ".$table);
 }

}

?>