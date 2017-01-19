<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/4/28
 * Time: 上午10:07
 */

namespace Api\Repositories\Decorators;

use Repositories\Decorators\BaseDecorator;
use Repositories\Contracts\Repository;
use Traits\AsteriskTrait;

/**
 * 处理api中带*的参数值
 * Class Asterisk
 * @package Api\Repositories\Decorators
 */
class Asterisk extends BaseDecorator
{
    /**
     * @var array
     */
    protected $replaceFields;

    use AsteriskTrait;

    /**
     * @param Repository $repo
     * @param array $replaceFields 允许使用*的字段
     */
    public function __construct(Repository $repo, array $replaceFields = [])
    {
        parent::__construct($repo);
        $this->repo = $repo;
        $this->replaceFields = $replaceFields;
    }

    /**
     * 把带星号的参数值修改成Like参数
     * @param array $conditions
     * @return array
     */
    public function replaceToLikeQuery(array $conditions)
    {
        foreach ($conditions as $key => $value) {

            if ($this->isReplaceable($key, $value)) {
                $conditions[$key] = ['like', $this->replaceAsteriskToQuery($value)];
            }
        }

        return $conditions;
    }

    /**
     * 删除参数中的*
     * @param array $conditions
     * @return array
     */
    public function replaceAsterisk(array $conditions)
    {

        foreach ($conditions as $key => $value) {

            if ($this->isReplaceable($key, $value)) {
                $conditions[$key] = $this->removeAsterisk($value);
            }
        }

        return $conditions;
    }

    /**
     * 是否需要替换参数中得*
     * @param $key
     * @param $value
     * @return bool
     */
    public function isReplaceable($key, $value)
    {
        if (empty($this->replaceFields)) {

            return $this->isAsterisk($value);
        }

        return in_array($key, $this->replaceFields) && $this->isAsterisk($value);
    }

    /**
     * 创建一条新记录, 如果创建成功,返回这个对象
     * @param array $data
     * @return \Illuminate\Database\Eloquent\Model|bool
     */
    public function create(array $data)
    {
        $replacedData = $this->replaceAsterisk($data);

        return $this->repo->create($replacedData);
    }

    /**
     * 根据唯一标示符返回一条记录
     * @param $uuid          唯一标示符, 譬如id
     * @param array $columns 需要返回的字段
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function find($uuid, array $columns = ['*'])
    {
        $uuid = $this->removeAsterisk($uuid);

        return $this->repo->find($uuid, $columns);
    }


    /**
     * 根据条件返回一个记录集合
     * @param array $conditions
     * @param array $columns
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function findBy(array $conditions, array $columns = ['*'])
    {
        $replacedConditions = $this->replaceToLikeQuery($conditions);

        return $this->repo->findBy($replacedConditions, $columns);
    }

    /**
     * 和findBy一样,不过会带上总记录条数
     * @param int $page
     * @param int $limit
     * @param array $conditions
     * @param array $columns
     * @return mixed
     */
    public function paginate($page = 1, $limit = 1, array $conditions, array $columns = ['*'])
    {
        $replacedConditions = $this->replaceToLikeQuery($conditions);

        return $this->repo->paginate($page, $limit, $replacedConditions, $columns);
    }

}