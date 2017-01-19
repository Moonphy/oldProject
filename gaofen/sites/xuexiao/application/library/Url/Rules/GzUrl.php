<?php
namespace Url\Rules;
use \Url\RewriteRules;
use \Url\UrlDataTrait;

class GzUrl implements RewriteRules
{
    use UrlDataTrait;

    protected $_dir = '/gaozhong';

    protected $_rules = [];

    public function __construct($url)
    {
        $this->parseUrl($url);
        //$this->_dir = \F::inEnv('test') ? '' : $this->_dir;
    }

    public function getRules()
    {
        $query = $this->query;
        $path = $this->path;

        $this->_rules = [
            '/school/index' => array('to' => '/'),
            '/gz/school/index' => array('to'=> '/middle'),
            '/gz/guide/index' => array('to' => $this->_dir.'/shengxue.html'),
            '/gz/guide/aspiration' => array('to' => '/middle-zhiyuan.html'),
            '/gz/guide/select' => array('to' => $this->_dir.'/shengxue/select'),
            '/gz/guide/history' => array('to' => $this->_dir.'/shengxue/history'),
            '/gz/guide/result' => array('to' => $this->_dir.'/shengxue/result'),

            //后台上传处理
            '/admin/upload/html5upload' => array('to' => $this->_dir.'/Admin/upload/html5Upload'),
            '/admin/upload/keuploadjson' => array('to' => $this->_dir.'/Admin/upload/keUploadJson'),//keUploadJson
        ];

        if(empty($query)) {
            $this->_rules['/gz/school/list'] = array('to' => '/middle-list.html');
        }

        return $this->_rules;
    }

    public function getConditions()
    {
        $query = $this->query;
        $path = $this->path;

        $conditions = [
            '/gz/school/album' => array('to' => '/middle-{sid}-scene.html', 'params' => $query),
            '/gz/school/detail' => array('to' => '/middle-{id}-jieshao.html', 'params' => $query),
            '/gz/guide/select' => array('to' => $this->_dir.'/shengxue/select?district_id={district_id|}&year={year|}&low_mark={low_mark|}', 'params' => $query),
            '/gz/guide/history' => array('to' => $this->_dir.'/shengxue/history?year={year|}&batch_id={batch_id|}&range_id={range_id|}&luqu_id={luqu_id|}', 'params' => $query),
        ];

        //首页兼容搜索处理
        if ($path == '/gz/school/list') {
            if (isset($query['q'])) {
                $conditions['/gz/school/list'] = array('to' => '/middle-list-keyword-{q}.html', 'params' => $query);
            } elseif (!empty($query)) {
                $conditions['/gz/school/list'] = array('to' => '/middle-list-q{district|0}l{level|0}p{property|0}b{batch_id|0}r{range_id|0}c{cate|0}.html', 'params' => $query);
            }
        }


        //详细页seo处理
        if ($path == '/gz/school/view') {
            if (isset($query['type']) && $query['type'] == 7) {
                //分数线
                $query['typename'] = 'fenshuxian';
                $conditions['/gz/school/view'] = array('to' => '/middle-{id}-{typename}.html', 'params' => $query);
            } elseif (isset($query['type']) && $query['type'] == 8) {
                //高考成绩
                $query['typename'] = 'gkcj';
                $conditions['/gz/school/view'] = array('to' => '/middle-{id}-{typename}.html', 'params' => $query);
            }elseif (isset($query['type']) && $query['type'] == 9) {
                //招生信息
                $query['typename'] = 'zhaosheng';
                $conditions['/gz/school/view'] = array('to' => '/middle-{id}-{typename}.html', 'params' => $query);
            } elseif (isset($query['type']) && $query['type'] == 10) {
                //其它信息
                $query['typename'] = 'other';
                $conditions['/gz/school/view'] = array('to' => '/middle-{id}-{typename}.html', 'params' => $query);
            } elseif (isset($query['type']) && $query['type'] == 11) {
                //学校要闻
                $query['typename'] = 'news';
                $conditions['/gz/school/view'] = array('to' => '/middle-{id}-{typename}.html', 'params' => $query);
            } elseif (isset($query['type']) && $query['type'] == 12) {
                //资料推荐
                $query['typename'] = 'ziliao';
                $conditions['/gz/school/view'] = array('to' => '/middle-{id}-{typename}.html', 'params' => $query);
            } else {
                //招生信息
                $conditions['/gz/school/view'] = array('to' => '/middle-{id}.html', 'params' => $query);
            }
        }

        //对比页seo处理
        if ($path == '/gz/school/cmp') {
            if (isset($query['ids'])) {
                $query['ids'] = implode('_', explode(',', $query['ids']));
            }
            $conditions['/gz/school/cmp'] = array('to' => $this->_dir.'/duibi_{ids}.html', 'params' => $query);
        }


        return $conditions;
    }

    public function getPatterns()
    {
        return [];
    }
}
