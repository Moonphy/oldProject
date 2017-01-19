<?php
namespace Presenters\CZ;

use \Presenters\AbstractModelPresenter;

/**
 * Class School
 * @package Presenters\CZ
 */
class School extends AbstractModelPresenter
{
    /**
     * @return mixed
     */
    public function rank()
    {
        if ($this->_model->cate == 1) {
            return $this->_model->range_rank_yg;
        } else {
            return $this->_model->range_rank_ng;
        }
    }

    /**
     * 格式化输出点评
     * @return string
     */
    public function tags($custom = 'school')
    {
        $tags = array_filter($this->_model->tags, function ($var) {
            return $var;
        });

        if (!$tags) {
            return null;
        }

        $method = '_'.strtolower($custom).'Tags';
        return $this->{$method}($tags);
    }

    /**
     * @param $tags
     * @return string
     */
    protected function _schoolTags($tags)
    {
        $tags = array_map(function ($value) {
             return \CFG::tags('tags', $value) ? '<a href="'.\F::URL('/Cz/Tags/list', array('tagid'=>$value)).'" target="_blank" class="pill">'.\CFG::tags('tags', $value).'</a>' : '';
        }, $tags);

        return implode('', $tags);
    }

    /**
     * 大首页标签
     * @param array $tags
     * @return string
     */
    protected function _indexTags(array $tags)
    {
        $tags = NY('Cz_SchoolModel')->getTagByIds($tags);
        $reason = '<span class="label">推荐理由：</span>';
        return $reason.'<span>'.implode('、', $tags).'</span>';
    }

    protected function _weixinTags(array $tags) {
         $tags = NY('Cz_SchoolModel')->getTagByIds($tags);
         return $tags?'<span>'.implode('</span><span>', $tags).'</span>':'';
    }

    /**
     * @param $tags
     * @return string
     */
    protected function _frontTags($tags)
    {
        $tags = array_map(function ($value) {
             return \CFG::tags('tags', $value) ? \CFG::tags('tags', $value) : '';
        }, $tags);

        return implode('/', array_filter($tags));
    }

    /**
     * 格式化输出学校属性
     * @return string
     */
    public function property(array $properties = ['district', 'cate', 'attype'])
    {
        $list = [];
        foreach ($properties as $value) {
            $list = array_merge($list, $this->_getPropertyName($value, $this->_model->$value));
        }

        $list = array_map(function ($value) {
             return '<span>'.$value.'</span>';
        }, $list);

        return implode('，', $list);
    }

    /**
     * 把属性id还成对应的名字
     * @param  属性字段 $key property|district|attype
     * @param  array|string $propertyValue 属性的id值
     * @return array
     */
    protected function _getPropertyName($key, $propertyValue)
    {
        $filters = NY('Cz_SchoolModel')->getFilters();

        $f = [];
        $propertyValue = is_array($propertyValue) ? $propertyValue : array($propertyValue);

        foreach ($propertyValue as $property) {
            // 忽略id == 0的数据
            if ($property) {
                $f[] = $filters[$key]['list'][$property];
            }
        }

        /**
         * 假如存在方法 _get+属性名+Property 例如: _getAttypeProperty
         * 调用该方法二次格式化属性输出的文案
         */
        $method = '_get'.ucfirst($key).'Property';

        if ($f && method_exists($this, $method)) {
            return  [$this->{$method}($f)];
        }

        return $f;
    }

    /**
     * 初中库首页格式化输出入学途径的部分
     * @return string 入学途径：xxx、xxx、xxx
     */
    protected function _getAttypeProperty(array $attype)
    {
        $str = '入学途径：';

        return $str.implode('/', $attype);
    }

    /**
     * 中考分数线
     * @return string|null
     */
    public function scores()
    {
        $id = $this->_model->id;
        $scores = \F::api('/Cz/Score/listByCond', ['sid' => $id, 'limit' => 1]);

        if (!$scores['list']) {
            return null;
        }
        return '，中考'.$scores['list'][0]['score_avg'].'分';
    }

    /**
     * 特长生大类
     * @return string|null
     */
    public function admitForte()
    {
        $id = $this->_model->id;
        $admitForte = \F::api('/Cz/Admitforte/listByCond', ['sid' => $id]);

        if (!$admitForte['list']) {
            return null;
        }
        $admitForteList = \CFG::school('admit_forte');
        $forte_types = array_column($admitForte['list'], 'type'); // 特长生大类id

        $forte_types = array_only($admitForteList, $forte_types);

        $names = array_column($forte_types, 'name');

        return '，招收'.implode('/', $names).'特长生';
    }
}
