<?php
namespace Presenters\GZ;

use \Presenters\AbstractModelPresenter;

class School extends AbstractModelPresenter
{
    /**
     * 格式化输出学校属性
     * @param array properties 需要输出的属性(高中首页和搜索页输出属性不同, 默认全部输出)
     * @return string
     */
    public function property(array $properties = ['cate', 'gz_property', 'gz_admit_batch', 'gz_admit_range'], $implode = '<i>,</i>')
    {
        $list = [];

        foreach ($properties as $value) {
            $list = array_merge($list, $this->_getPropertyName($value, $this->_model->$value));
        }

        $list = array_map(function ($value) {
             return '<span>'.$value.'</span>';
        }, $list);

        return implode($implode, $list);
    }

    /**
     * 高中首页输出学校类型和级别
     * @return string
     */
    public function level_property()
    {
        $list = [];

        $list = array_merge($list, $this->_getPropertyName('gz_property', $this->_model->gz_property));
        $list = array_merge($list, $this->_getPropertyName('gz_level', $this->_model->gz_level));

        return implode(',', $list);
    }

    /**
     * 把属性id还成对应的名字
     * @param  属性字段 $key property|district|attype
     * @param  array|string $propertyValue 属性的id值
     * @return array
     */
    protected function _getPropertyName($key, $propertyValue)
    {
        $filters = NY('Gz_SchoolModel')->getFilters();


        $f = [];
        $propertyValue = is_array($propertyValue) ? $propertyValue : array($propertyValue);

        $method = '_pre'.ucfirst($key).'Property';
        if (method_exists($this, $method)) {
            $propertyValue = $this->{$method}($propertyValue);
        }

        if (is_array($propertyValue)) {
            foreach ($propertyValue as $property) {
                // 忽略id == 0的数据
                if ($property && isset($filters[$key]['list'][$property])) {
                    $f[] = $filters[$key]['list'][$property];
                }
            }
        } else {
            $f[] = $propertyValue;
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

    protected function _preGz_admit_rangeProperty(array $admit_range)
    {
        $admit_range = NY('Gz_SchoolModel')->explainAdmitRange($admit_range);

        $str = '面向'.implode('、', $admit_range).'招生';
        return $str;
    }

    /**
     * 录取批次
     * @return string xxx/xxx/xxx
     */
    protected function _getGz_admit_batchProperty(array $admit_batch)
    {
        $str = implode('/', $admit_batch);

        return $str;
    }


    public function admit_range_text() {
        return NY('Gz_SchoolModel')->explainAdmitRange($this->_model->gz_admit_range);
    }
}
