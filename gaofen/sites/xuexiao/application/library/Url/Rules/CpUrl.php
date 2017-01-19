<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/7
 * Time: 下午4:18
 */

namespace Url\Rules;


use Url\RewriteRules;
use Url\UrlDataTrait;

class CpUrl implements RewriteRules
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
        return [
            '/cp/mobile/index' => ['to' => '/list/' . $this->schoolType->toAlias()],
            '/cp/mobile/list' => [
                'to' => '/list/list' . $this->schoolType->toAlias(),
            ]
        ];
    }

    public function getConditions()
    {
        $query = $this->query;
        if (isset($query['school_type'])) {

            $query['school_type'] = $this->schoolType->toAlias($query['school_type']);

        } else {

            $query['school_type'] = $this->schoolType->toAlias();
        }

        $listRules = isset($query['page']) ? '/list/list{school_type}{page}' : '/list/list{school_type}';
        $viewRules = isset($query['page']) ? '/article/{id}-{page}.htm' : '/article/{id}.htm';

        return [
            '/cp/mobile/index' => ['to' => '/list/{school_type}', 'params' => $query],
            '/cp/mobile/list' => ['to' => $listRules, 'params' => $query],
            '/cp/mobile/view' => ['to' => $viewRules, 'params' => $query],
        ];
    }

    public function getPatterns()
    {
        return [];
    }
}