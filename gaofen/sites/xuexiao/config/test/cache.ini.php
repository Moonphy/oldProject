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
    ],

    'drivers' => [

        'redis' => array(
            'master' => array(
                'server' => '127.0.0.1',
                'port' => 16379,
            ),
            'slave' => array(
                'server' => '127.0.0.1',
                'port' => 16380,
            ),
        ),
    ],

    'connections' => [

        'school' => [
            'database' => '15',
        ],
        'auth' => [
            'database' => '15',
        ],
        'teacher' => [
            'database' => '15',
        ],
        'cp' => [
            'database' => '15',
        ],
        'default' => [
            'database' => '15',
        ],
    ]
];