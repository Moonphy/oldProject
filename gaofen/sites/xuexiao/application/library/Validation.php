<?php

use Illuminate\Validation\Factory;
use Illuminate\Validation\DatabasePresenceVerifier;
use Illuminate\Container\Container;
use Illuminate\Filesystem\Filesystem;
use Symfony\Component\Translation\TranslatorInterface;
use Illuminate\Translation\Translator;
use Illuminate\Translation\FileLoader;
use Illuminate\Database\ConnectionResolver;
use Illuminate\Database\ConnectionResolverInterface;
use Illuminate\Database\Connectors\ConnectionFactory;

class Validation
{
    /**
     * The current globally used instance.
     *
     * @var \Services\Validation\Capsule\Manager
     */
    protected static $instance;

    /**
     * The validation factory instance.
     *
     * @var \Illuminate\Validation\Factory
     */
    protected $validator;

    /**
     * The Translator implementation.
     *
     * @var \Symfony\Component\Translation\TranslatorInterface
     */
    protected $translator;

    /**
     * The IoC container instance.
     *
     * @var \Illuminate\Container\Container
     */
    protected $container;

    /**
     * 数据库验证集合
     * @var Array<PresenceVerifierInterface>
     */
    protected $verifiers = [];

    /**
     * Create a new validation capsule manager.
     *
     * @param string $fallbackLocale
     * @param string $path
     * @param \Illuminate\Container\Container $container
     */
    public function __construct($fallbackLocale = null, $path = null, Container $container = null)
    {
        $this->setupContainer($container);

        $this->setupTranslator($fallbackLocale, $path);

        $this->setupValidator();

        // $this->setConnection();
    }

    /**
     * Setup the IoC container instance.
     *
     * @param \Illuminate\Container\Container $container
     * @return void
     */
    protected function setupContainer($container)
    {
        $this->container = $container ?: new Container;

        // $this->container->instance('config', new Fluent);
    }

    /**
     * Setup the translator instance.
     *
     * @param string $fallbackLocale
     * @param string $path
     * @return void
     */
    protected function setupTranslator($fallbackLocale, $path)
    {
        $file = new Filesystem;
        $loader = new FileLoader($file, $path);
        $trans = new Translator($loader, 'en');

        $trans->setFallback($fallbackLocale);
        $this->translator = $trans;
    }

    /**
     * Set the Translator implementation.
     *
     * @param \Symfony\Component\Translation\TranslatorInterface $translator
     * @return void
     */
    public function setTranslator(TranslatorInterface $translator)
    {
        $this->translator = $translator;
        $this->validator->setTranslator($this->translator);
    }

    /**
     * Build the validation factory instance.
     *
     * @return void
     */
    protected function setupValidator()
    {
        $this->validator = new Factory($this->translator, $this->container);
    }

    /**
     * Set the database connection.
     *
     * @param array $config
     * @return void
     */
    public function setConnection($connectionName = 'default')
    {
        if (isset($this->verifiers[$connectionName])) {

            return $this->validator->setPresenceVerifier($this->verifiers[$connectionName]);
        }

        $connection = new ConnectionFactory($this->container);

        $db = new ConnectionResolver(array(
            null => $connection->make($this->container->config['database.connections'][$connectionName])
        ));

        $this->setPresenceVerifier($db, $connectionName);
    }

    /**
     * Register the database presence verifier.
     *
     * @param \Illuminate\Database\ConnectionResolverInterface $db
     * @return void
     */
    public function setPresenceVerifier(ConnectionResolverInterface $db, $connectionName = 'default')
    {
        $presence = new DatabasePresenceVerifier($db);
        $this->verifiers[$connectionName] = $presence;
        $this->validator->setPresenceVerifier($presence);
    }

    /**
     * Make this capsule instance available globally.
     *
     * @return void
     */
    public function setAsGlobal()
    {
        static::$instance = $this;
    }

    /**
     * Get the validation factory instance.
     *
     * @return \Illuminate\Validation\Factory
     */
    public function getValidator()
    {
        return $this->validator;
    }

    /**
     * Get the IoC container instance.
     *
     * @return \Illuminate\Container\Container
     */
    public function getContainer()
    {
        return $this->container;
    }

    /**
     * Set the IoC container instance.
     *
     * @param \Illuminate\Container\Container $container
     * @return void
     */
    public function setContainer(Container $container)
    {
        $this->container = $container;
    }

    /**
     * 全局验证代理
     * @param  array  $data           代验证的数据
     * @param  array  $rules          验证规则
     * @param  array  $messages       验证失败的提示信息
     * @param  string $connectionName 数据库连接的名字
     * @return \Illuminate\Validation\Validator
     */
    public static function make(array $data, array $rules, array $messages, $connectionName = 'default')
    {
        $validator = Yaf_Registry::get('Validation');

        if ($validator && $connectionName) {

            $validator->setConnection($connectionName);

        }else{

            $validator = new Validation();
        }

        return $validator->getValidator()->make($data, $rules, $messages);
    }

    /**
     * 自定义验证规则
     * @param  Closure $func [description]
     * @return void
     */
    public static function resolver(\Closure $func)
    {
        $factory = Yaf_Registry::get('Validation');

        return $factory->getValidator()->resolver($func);
    }
}
