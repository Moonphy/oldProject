<?php
/**
 * Created by PhpStorm.
 * User: tim
 * Date: 17/3/15
 * Time: 9:26 PM
 */

return [

    'modules' => [
        'default'   => 'default',
        ''          => 'default',
        'cz'        => 'school',
        'czweixin'  => 'school',
        'czadmin'   => 'school',
        'gzadmin'   => 'school',
        'gz'        => 'school',
        'auth'      => 'auth',
        'teacher'   => 'teacher',
        'cp'        => 'cp',
        'huodong'   => 'huodong',
    ],

    'drivers' => [

        'redis' => array(
            'master' => array(
                'server' => '192.168.1.168',
                'port' => 16379,
            ),
            'slave' => array(
                'server' => '192.168.1.168',
                'port' => 16380,
            ),
        ),
    ],

    'connections' => [
        'huodong' => [
            'database' => '9',
        ],
        'school' => [
            'database' => '10',
        ],
        'auth' => [
            'database' => '11',
        ],
        'teacher' => [
            'database' => '11',
        ],
        'cp' => [
            'database' => '13',
        ],
        'default' => [
            'database' => '15',
        ],
    ]
];