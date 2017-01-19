<?php

return [

    'connections' => [
        'school' => [
            'driver' => 'mysql',
            'host' => 'localhost',
            'database' => 'gaofen_school',
            'username' => 'gaofen_school',
            'password' => '5w6D83b3',
            'charset' => 'utf8',
            'collation' => 'utf8_unicode_ci',
            'prefix' => 'xuexiao_',
        ],
        'comment' => [
            'driver' => 'mysql',
            'host' => 'localhost',
            'username' => 'gaofen_comment',
            'password' => '67TPSdZc6GVKFVH2',
            'database' => 'gaofen_comment',
            'charset' => 'utf8',
            'collation' => 'utf8_unicode_ci',
            'prefix' => 'gf_',
        ],
        'auth' => [
            'driver' => 'mysql',
            'host' => 'localhost',
            'database' => 'gaofen_u',
            'username' => 'gaofen_u',
            'password' => 'nstYfKNL32KjpAQ2',
            'charset' => 'utf8',
            'collation' => 'utf8_unicode_ci',
            'prefix' => 'auth_',
        ],
        'pay' => [
            'driver' => 'mysql',
            'host' => 'localhost',
            'database' => 'gaofen_u',
            'username' => 'gaofen_u',
            'password' => 'nstYfKNL32KjpAQ2',
            'charset' => 'utf8',
            'collation' => 'utf8_unicode_ci',
            'prefix' => 'auth_',
        ],
        'huodong' => [
            'driver' => 'mysql',
            'host' => 'localhost',
            'username' => 'gaofen_wei',
            'password' => 'aSGYPPfVGRcXnMMb',
            'database' => 'gaofen_wei',
            'charset' => 'utf8',
            'collation' => 'utf8_unicode_ci',
            'prefix' => '',
        ],
        'teacher' => [
            'driver' => 'mysql',
            'host' => 'localhost',
            'database' => 'gaofen_teacher',
            'username' => 'gaofen_teacher',
            'password' => '3wSFXyLwU4TTBq4p',
            'charset' => 'utf8',
            'collation' => 'utf8_unicode_ci',
            'prefix' => 'tc_',
        ],
        'form' => [
            'driver' => 'mysql',
            'host' => 'localhost',
            'database' => 'gaofen_form',
            'username' => 'gaofen_form',
            'password' => 'uQtXud32mZ5PfKDA',
            'charset' => 'utf8',
            'collation' => 'utf8_unicode_ci',
        ],
        'mongo_form' => [
            'driver' => 'mongodb',
            'host' => 'localhost',
            'port' => 27017,
            'database' => 'database',
        ],
        'event' => [
            'driver' => 'mysql',
            'host' => 'localhost',
            'database' => 'gaofen_event',
            'username' => 'gaofen_event',
            'password' => 'xxefHX6M3pRuypdX',
            'charset' => 'utf8',
            'collation' => 'utf8_unicode_ci',
        ],

    ], // end of connections

];
