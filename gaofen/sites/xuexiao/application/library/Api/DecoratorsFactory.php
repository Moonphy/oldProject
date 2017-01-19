<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/4/28
 * Time: 下午3:57
 */

namespace Api;


use Api\Repositories\Decorators\Asterisk;
use Repositories\Contracts\Repository;
use Api\Repositories\Decorators\Field;
use Api\Repositories\Decorators\WithAsterisk;
use Api\Repositories\Decorators\With;
use Illuminate\Database\Eloquent\Model as ORM;
use Traits\AsteriskTrait;

class DecoratorsFactory
{
    use AsteriskTrait;

    /**
     * @var array
     */
    private $decorators = [];

    static protected $allDecorators = ['asterisk', 'with', 'field'];
    protected $decoratorParamters = [];

    /**
     * @param array $decorators
     */
    public function __construct(array $decorators = ['asterisk', 'with', 'field'])
    {
        $this->decorators = $decorators;
    }

    /**
     * @param array $decorators
     * @return static
     */
    public function only(array $decorators)
    {
        return new static(array_only(self::$allDecorators, $decorators));
    }

    /**
     * @param array $decorators
     * @return static
     */
    public function except(array $decorators)
    {
        return new static(array_except(self::$allDecorators, $decorators));
    }

    /**
     * @param array $decorators
     * @return $this
     */
    public function order(array $decorators)
    {
        $this->decorators = $decorators;

        return $this;
    }

    /**
     * @param $decorator
     * @param array $paramter
     * @return $this
     */
    public function setDecoratorParamters($decorator, array $paramter)
    {
        $this->decoratorParamters[strtolower($decorator)] = $paramter;

        return $this;
    }

    /**
     * @param Repository $repo
     * @param array $params
     * @param ORM $entry
     * @return Repository
     */
    public function make(Repository $repo, array $params, ORM $entry)
    {
        $p = [
            'repo' => $repo,
            'params' => $params,
            'entry' => $entry
        ];

        foreach ($this->decorators as $decoratorName) {

            $method = 'get' . ucfirst($decoratorName) . 'Decorator';
            $p['repo'] = call_user_func_array([$this, $method], $p);
        }

        return $p['repo'];
    }

    /**
     * @param Repository $repo
     * @param array $params
     * @return Repository|Field
     */
    public function getFieldDecorator(Repository $repo, array $params)
    {
        if (isset($params['field'])) {

            return new Field($repo);
        }

        return $repo;
    }

    /**
     * @param Repository $repo
     * @param array $params
     * @return Asterisk|Repository
     */
    public function getAsteriskDecorator(Repository $repo, array $params)
    {
        foreach ($params as $key => $value) {

            if ($this->isAsterisk($value)) {

                $p = isset($this->decoratorParamters['asterisk']) ? $this->decoratorParamters['asterisk'] : [];
                $p['repo'] = $repo;

                return \DIBuilder::make('Api\Repositories\Decorators\Asterisk', $p);
            }

        }

        return $repo;
    }

    /**
     * @param Repository $repo
     * @param array $params
     * @param ORM $entry
     * @return Repository
     */
    public function getWithDecorator(Repository $repo, array $params, ORM $entry)
    {
        if (isset($params['with'])) {

            $with = is_array($params['with']) ? $params : explode(',', $params['with']);

            foreach ($params as $key => $value) {

                if ($this->isAsterisk($value)) {

                    return new WithAsterisk($entry, $repo, $with, $params);
                }

            }

            $repo = new With($entry, $repo, $with, $params);
        }

        return $repo;
    }
}