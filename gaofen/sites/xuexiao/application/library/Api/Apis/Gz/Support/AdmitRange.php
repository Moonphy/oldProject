<?php
namespace Api\Apis\Gz\Support;

use Api\OpenApi;

/**
 * 招生范围调整
 */
class AdmitRange
{
    protected $_nextObject;

    public function __construct($next)
    {
        $this->_nextObject = $next;
    }

    public function __call($method, $params)
    {
        $params = call_user_func_array([$this, 'handle'], $params);
        return call_user_func_array([$this->_nextObject, $method], [$params]);
    }

    /**
     * 广州范围
     * @param  array $params
     * @return arrat 调整招生范围后参数
     */
    public function handle($params)
    {
        $city = OpenApi::param($params, 'city', 289);
        $range = OpenApi::param($params, 'range_id', 0);

        if ($city == 289 && !in_array($range, range(0, 4))) {
            $params['range_id'] = $range.',1';
        }

        return $params;
    }
}
