<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/29
 * Time: 上午11:41
 */

namespace Adapters\Log;


use Monolog\Handler\StreamHandler;
use Monolog\Logger as MonoLogger;

class MonologAdapter extends Logger
{
    /**
     * @var Logger
     */
    private $logger;

    public function __construct(MonoLogger $logger)
    {
        $this->logger = $logger;
        $this->logger->pushHandler(new StreamHandler(LOG_PATH . '/debug.log', MonoLogger::DEBUG));
    }

    public function getLogger()
    {
        return $this->logger;
    }

}