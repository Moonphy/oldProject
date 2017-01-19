<?php
namespace Adapters\Mongodb;

use Illuminate\Database\ConnectionResolverInterface;

/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/28
 * Time: 下午12:39
 */
class MongoConnectionResolver implements ConnectionResolverInterface
{

    /**
     * Get a database connection instance.
     *
     * @param  string $name
     * @return \Illuminate\Database\Connection
     */
    public function connection($name = null)
    {
        $config = \CFG::database('connections', $name);

        return new Connection($config);
    }

    /**
     * Get the default connection name.
     *
     * @return string
     */
    public function getDefaultConnection()
    {
        // TODO: Implement getDefaultConnection() method.
    }

    /**
     * Set the default connection name.
     *
     * @param  string $name
     * @return void
     */
    public function setDefaultConnection($name)
    {
        // TODO: Implement setDefaultConnection() method.
    }
}