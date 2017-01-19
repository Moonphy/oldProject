<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/3/13
 * Time: 下午6:04
 */

namespace spec;

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Events\Dispatcher;
use Illuminate\Container\Container;

trait PrepareDatabase 
{
    /**
     * 准备数据库测试
     */
    public function prepareForDatabase()
    {
        \F::setEnv('TDD');
        $modules = \CFG::database('modules', $this->_module);

        $capsule = new Capsule;

        foreach (explode(',', $modules) as $connectionName) {
            $conncetionData = \CFG::database('connections', $connectionName);
            $capsule->addConnection($conncetionData);
        }

        $capsule->setAsGlobal();

        $container = new Container;
        // 事件分发
        $capsule->setEventDispatcher(new Dispatcher($container));

        // 启动数据库
        $capsule->bootEloquent();

    }

}