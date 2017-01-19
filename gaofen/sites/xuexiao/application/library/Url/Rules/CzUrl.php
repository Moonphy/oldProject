<?php
namespace Url\Rules;
use \Url\RewriteRules;
use \Url\UrlDataTrait;

class CzUrl implements RewriteRules
{
    use UrlDataTrait;

    protected $_chuzhong = '/chuzhong';

    protected $_rules = [];

    public function __construct($url)
    {
        $this->parseUrl($url);
        $this->_chuzhong = \F::inEnv('test') ? '' : $this->_chuzhong;
    }

    public function getRules()
    {
        $query = $this->query;
        $path = $this->path;

        $this->_rules = [
            '/school/index' => array('to' => '/'),
            '/cz/school/rank' => array('to' => $this->_chuzhong.'/rank.html'),
            '/cz/school/front' => array('to' => $this->_chuzhong.'/'),

            //后台上传处理
            '/admin/upload/html5upload' => array('to' => $this->_chuzhong.'/Admin/upload/html5Upload'),
            '/admin/upload/keuploadjson' => array('to' => $this->_chuzhong.'/Admin/upload/keUploadJson'),//keUploadJson
        ];

        if(empty($query)) {
            $this->_rules['/cz/school/guide'] =array('to' => $this->_chuzhong.'/shengxue.html');
            $this->_rules['/cz/school/index'] = array('to' => $this->_chuzhong.'/list.html');
        }

        return $this->_rules;
    }

    public function getConditions()
    {
        $query = $this->query;
        $path = $this->path;

        $conditions = [
            '/cz/school/album' => array('to' => $this->_chuzhong.'/photo_{sid}.html', 'params' => $query),
            '/cz/school/detail' => array('to' => $this->_chuzhong.'/jieshao_{id}.html', 'params' => $query),
            '/cz/school/guide' => array('to' => $this->_chuzhong.'/shengxue/?type={type}&step={step}', 'params' => $query),
            '/cz/tags/list' => array('to' => $this->_chuzhong.'/bq-{tagid}.html', 'params' => $query),
        ];

        //首页兼容搜索处理
        if ($path == '/cz/school/index') {
            if (isset($query['q'])) {
                $conditions['/cz/school/index'] = array('to' => $this->_chuzhong.'/list/keyword-{q}.html', 'params' => $query);
            } elseif ((isset($query['district']) || isset($query['property']) || isset($query['attype']))) {
                $conditions['/cz/school/index'] = array('to' => $this->_chuzhong.'/list-q{district}p{property}a{attype}.html', 'params' => $query);
            }
        }

        //详细页seo处理
        if ($path == '/cz/school/view') {
            if (isset($query['type']) && $query['type'] == 1) {
                //学校实力
                $query['typename'] = 'shili';
                $conditions['/cz/school/view'] = array('to' => $this->_chuzhong.'/{typename}_{id}.html', 'params' => $query);
            } elseif (isset($query['type']) && $query['type'] == 3) {
                //学生生活
                $query['typename'] = 'shenghuo';
                $conditions['/cz/school/view'] = array('to' => $this->_chuzhong.'/{typename}_{id}.html', 'params' => $query);
            } elseif (isset($query['type']) && $query['type'] == 4) {
                //学校要闻
                $query['typename'] = 'zixun';
                $conditions['/cz/school/view'] = array('to' => $this->_chuzhong.'/{typename}_{id}.html', 'params' => $query);
            } elseif (isset($query['type']) && $query['type'] == 5) {
                //资料推荐
                $query['typename'] = 'ziliao';
                $conditions['/cz/school/view'] = array('to' => $this->_chuzhong.'/{typename}_{id}.html', 'params' => $query);
            } else {
                //招生信息
                $conditions['/cz/school/view'] = array('to' => $this->_chuzhong.'/{id}.html', 'params' => $query);
            }
        }

        //对比页seo处理
        if ($path == '/cz/school/cmp') {
            if (isset($query['ids'])) {
                $query['ids'] = implode('_', explode(',', $query['ids']));
            }
            $conditions['/cz/school/cmp'] = array('to' => $this->_chuzhong.'/duibi_{ids}.html', 'params' => $query);
        }


        return $conditions;
    }

    public function getPatterns()
    {
        return [];
    }
}
