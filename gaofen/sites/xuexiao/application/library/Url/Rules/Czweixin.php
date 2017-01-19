<?php
namespace Url\Rules;
use \Url\RewriteRules;
use \Url\UrlDataTrait;

class Czweixin implements RewriteRules
{
    use UrlDataTrait;

    protected $_rules = [
            //mobile
    '/czweixin/school/index' => array('to' => '/xuexiao/chuzhong/'),
    '/czweixin/school/list' => array('to' => '/xuexiao/chuzhong-list.html'),
    ];

    protected static $_patterns = [];

    public function __construct($url)
    {
        $this->parseUrl($url);
    }

    public function getRules()
    {
        return $this->_rules;
    }

    public function getConditions()
    {
        $query = $this->query;

        $conditions = [
            //mobile
        //'/czweixin/school/view' => array('to' => '/xuexiao/chuzhong-{id}.html?display={display|}', 'params' => $query),
        '/czweixin/school/album' => array('to' => '/xuexiao/chuzhong-tuji-{sid}.html', 'params' => $query),
        '/czweixin/school/article' => array('to' => '/xuexiao/chuzhong-article-{sid}.html', 'params' => $query),
        ];

        if ($this->path == '/czweixin/school/list') {
            if (!empty($query['q'])) {
                $conditions['/czweixin/school/list'] = array('to' => '/xuexiao/chuzhong-list.html?q={q}', 'params' => $query);
            } else {
                $conditions['/czweixin/school/list'] = array('to' => '/xuexiao/chuzhong-list-q{district|0}p{property|0}.html', 'params' => $query);
            }
        }

        if ($this->path == '/czweixin/school/view') {
            if (isset($query['display'])) {
                $conditions['/czweixin/school/view'] = array('to' => '/xuexiao/chuzhong-{id}.html?display={display|}', 'params' => $query);
            } else {
                $conditions['/czweixin/school/view'] = array('to' => '/xuexiao/chuzhong-{id}.html', 'params' => $query);
            }
        }
        return $conditions;
    }

    public function getPatterns()
    {
        return [];
    }
}
