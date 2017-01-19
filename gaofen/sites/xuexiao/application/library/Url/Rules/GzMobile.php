<?php
namespace Url\Rules;
use \Url\RewriteRules;
use \Url\UrlDataTrait;

class GzMobile implements RewriteRules
{
    use UrlDataTrait;

    protected $_rules = [
            //mobile
    '/gz/mobile_school/index' => array('to' => '/xuexiao/gaozhong/'),
    '/gz/mobile_school/list' => array('to' => '/xuexiao/gaozhong-list.html'),
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
        //'/gz/mobile_school/view' => array('to' => '/xuexiao/gaozhong-{id}.html?display={display|}', 'params' => $query),
        '/gz/mobile_school/album' => array('to' => '/xuexiao/gaozhong-tuji-{sid}.html', 'params' => $query),
        '/gz/mobile_school/article' => array('to' => '/xuexiao/gaozhong-article-{sid}.html', 'params' => $query),
        ];

        if ($this->path == '/gz/mobile_school/list') {
            if (!empty($query['q'])) {
                $conditions['/gz/mobile_school/list'] = array('to' => '/xuexiao/gaozhong-list.html?q={q}', 'params' => $query);
            } else {
                $conditions['/gz/mobile_school/list'] = array('to' => '/xuexiao/gaozhong-list-q{district|0}p{property|0}.html', 'params' => $query);
            }
        }

        if ($this->path == '/gz/mobile_school/view') {
            if (isset($query['display'])) {
                $conditions['/gz/mobile_school/view'] = array('to' => '/xuexiao/gaozhong-{id}.html?display={display|}', 'params' => $query);
            } else {
                $conditions['/gz/mobile_school/view'] = array('to' => '/xuexiao/gaozhong-{id}.html', 'params' => $query);
            }
        }
        return $conditions;
    }

    public function getPatterns()
    {
        return [];
    }
}
