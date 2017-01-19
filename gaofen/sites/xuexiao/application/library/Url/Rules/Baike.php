<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/8
 * Time: 上午10:11
 */

namespace Url\Rules;


use Url\RewriteRules;
use Url\UrlDataTrait;

class Baike implements RewriteRules
{
    use UrlDataTrait;

    /**
     * @var \SchoolType
     */
    private $schoolType;

    public function __construct($url, \SchoolType $schoolType)
    {
        $this->parseUrl($url);
        $this->schoolType = $schoolType;
    }

    public function getRules()
    {
        return $rules = array(
            //pc
            '/entry/index' => array('to' => '/'),
            '/entry/index/school/xsc' => array('to' => '/xxbk/'),
            '/entry/index/school/zhongkao' => array('to' => '/czbk/'),
            '/entry/index/school/gaokao' => array('to' => '/gzbk/'),
            //mobile
            '/entrymobile/index' => array('to' => '/bk/'),
            '/entrymobile/index/school/xsc' => array('to' => '/xxbk/'),
            '/entrymobile/index/school/zhongkao' => array('to' => '/czbk/'),
            '/entrymobile/index/school/gaokao' => array('to' => '/gzbk/'),
        );

    }

    public function getConditions()
    {
        return [];
    }

    public function getPatterns()
    {
        $query = $this->query;

        //百科等殊处理school_type变格式化拼音
        $alias = array(3 => 'xxbk', 2 => 'czbk', '1' => 'gzbk');
        $query['school_type'] = $alias[$this->schoolType->toValue()];
        $query['page'] = isset($query['page']) ? $query['page'] : 1;


        $patterns = array(
            //pc
            '/entry/view/id/([0-9]+)' => array('to' => '/{school_type}/ct_$1.html', 'params' => $query),
            '/item/view/id/([0-9]+)' => array('to' => '/{school_type}/item_$1.html', 'params' => $query),
            '/entry/list/cid/([0-9]+)' => array('to' => '/{school_type}/list_$1_{page}.html', 'params' => $query),
            //mobile
            '/entrymobile/view/id/([0-9]+)' => array('to' => '/{school_type}/ct_$1.html', 'params' => $query),
            '/entrymobile/list/cid/([0-9]+)' => array('to' => '/{school_type}/list_$1_{page}.html', 'params' => $query),
        );

        return $patterns;
    }
}