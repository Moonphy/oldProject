<?php

$config['charset'] = 'utf8';
$config['prefix'] = 'aws_';
$config['driver'] = 'MySQLi';
$config['master'] = array (
  'charset' => 'utf8',
  'host' => '192.168.1.123:3307',
  'username' => 'root',
  'password' => 'gaofen100',
  'dbname' => 'gaofen_i',
);
$config['slave'] = false;