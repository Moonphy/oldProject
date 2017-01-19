<?php if (!defined('BASEPATH')) {
    exit('No direct script access allowed');
}
/**
 * 项目名称:  高分CMS
 * 建立日期:  2013年02月25日
 *
 * 启动加载程序
 *
 * @作者 heli <heli@gaofen.com>
 * @版本 $Id:
 **/
use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Events\Dispatcher;

class Bootstrap extends Yaf_Bootstrap_Abstract
{
    protected $container;
    use \Traits\QueryLoggerTrait;

    public function _initApp()
    {
        $this->container = DIBuilder::getApplication();
    }

    /**
     * 预配置数据库
     *
     */
    public function _initCapsule()
    {
        $connections = CFG::database('connections');

        $capsule = new Capsule($this->container);

        $capsule->addConnection(reset($connections), 'default');

        foreach ($connections as $connectionName => $conncetionData) {
            $capsule->addConnection($conncetionData, $connectionName);
        }

        $capsule->setAsGlobal();

        // 事件分发
        $capsule->setEventDispatcher($this->container['events']);

        // 启动数据库
        $capsule->bootEloquent();

    }

    public function _initValidation()
    {
        // 启动验证控件
        $validation = new Validation('en', __DIR__ . '/lang', $this->container);

        Yaf_Registry::set('Validation', $validation);
    }

    public function _initCustomValidation()
    {
        Validation::resolver(function ($translator, $data, $rules, $messages) {
            return new \Validators\CustomValidator($translator, $data, $rules, $messages);
        });
    }

    /**
     * SQL事件记录
     */
    public function _initQueryLogEvent()
    {
        if(defined('DB_IS_DEBUG') && DB_IS_DEBUG) {
            Capsule::listen(function ($query, $bindings, $time, $name) {

                return $this->log($query, $bindings, $time, $name);

            }, 'illuminate.query');
        }
    }

    public function _initRoute(Yaf_Dispatcher $dispatcher)
    {
        $config = new Yaf_Config_Ini(CONFIG_PATH . '/routes.ini');
        $router = $dispatcher->getRouter();
        $router->addConfig($config->routes);
    }
}
