<?php

namespace Html\Form;

use Html\Form;

class Simulatselect extends Select
{
    protected $_defaultName;

    public function simulatselect($name, array $options, $default = null)
    {
        $this->_name = $name;

        $this->_options = $options;
        $this->_options = $this->_isOptionPrefixAble() ? (array)$this->_options[0] + $this->_options[1] : $this->_options;

        $this->_default = $this->_getDefault($default);
        $this->_defaultName = $this->_getDefaultName();

        return $this->output();
    }

    public function output()
    {
        $name = $this->_name;
        $options = $this->_getOptions();

        $defaultValue = $this->_default;

        $defaultName = $this->_defaultName;

        return "<div class='ui-select'>
        <div class='ui-select-trigger'><span>$defaultName</span>
            <input value='$defaultValue' type='text' name='$name' /><i class='triangle'></i>
        </div>
        <div class='ui-dropdown hidden'>
            <div class='ui-dropdown-in'>
                <div class='query-result scrollable'>
                    <ul>
                    $options
                    </ul>
                    <div class='scroll-bar hidden'>
                        <div class='scroll-track'></div>
                        <div style='height:40px;' class='scroll-thumb'></div>
                    </div>
                </div>
            </div><i class='arrow'><i class='arrow-border'></i><i class='arrow-body'></i></i>
        </div>
    </div>";
    }

    public function _getOptions()
    {
        $option = null;
        foreach ($this->_options as $name => $value) {
            // 假如存在默认值，并且li中的值相同，会添加active的class
            $select = $this->_default && $name == $this->_default ? " class='active' " : "";

            $option .= "<li rel='value:$name' $select >$value</li>";
        }

        return $option;
    }

    /**
     * 获取默认值
     * @param  [type] $default [description]
     * @return [type]          [description]
     */
    protected function _getDefault($default)
    {
        $default = parent::_getDefault($default);

        // 如果没有默认值, 就从options中首个元素获取
        return $default ? $default : array_keys($this->_options)[0];
    }

    protected function _getDefaultName()
    {
        // 如果有设置default
        if ($this->_default) {
            return $this->_options[$this->_default];
        }

        return array_slice($this->_options, 0, 1)[0];
    }
}
