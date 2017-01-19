<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/4/23
 * Time: 上午10:44
 */

namespace Api;

use Illuminate\Database\Eloquent\Model as ORM;
use Repositories\BaseDBRepo;
use Repositories\Contracts\Repository;
use Repositories\Decorators\With;
use Repositories\Decorators\WithAsterisk;


Trait ApiParameterTrait
{
    /**
     * 返回属于本api的参数
     * @param array $paramters
     * @return array
     */
    public function getBaseParamters(array $paramters)
    {
        /**
         * 筛选出所有不带"."的参数
         */
        $paramters = array_where($paramters, function ($key) {

            $keys = explode(':', $key);

            return count($keys) === 1;

        });

        return $paramters;
    }

    /**
     * 返回交给其他api所需的参数
     * @param array $paramters
     * @return array
     */
    public function getWithParamters(array $paramters)
    {
        /**
         * 筛选出所有带"."的参数
         */

        $paramters = array_where($paramters, function ($key) {

            $keys = explode(':', $key);

            return count($keys) > 1;

        });

        /**
         * 首个带.的参数作为key,组成新的数组
         * 转换前 ['aaa.bbb' => 1, 'aaa.ccc' => 2, 'aaa.ddd.eee' => 3]
         * 转换后 ['aaaa' => ['bbb' => 1, 'ccc' => 2, 'ddd.eee' => 3]];
         */
        $p = [];
        foreach ($paramters as $key => $value) {

            $keys = explode(':', $key);

            $k = array_shift($keys);

            if (!isset($p[$k])) {

                $p[$k] = [];
            }

            $p[$k][implode('.', $keys)] = $value;

        }


        return $p;
    }

    public function getFieldParamters(array $paramters)
    {
        if (isset($paramters['field'])) {

            return explode(',', $paramters['field']);
        }

        return ['*'];
    }

}