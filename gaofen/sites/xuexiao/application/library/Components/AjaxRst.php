<?php
namespace Components;

class AjaxRst
{
    protected $_result = [

        'rst' => [],

        'errno' => 0,

        "err" => ""
    ];

    public function addRst(array $rst)
    {
        $this->_result['rst'] += $rst;
    }

    /**
     * 添加错误信息和代码
     * @param string $error_message  错误信息
     * @param integer $error_code    错误代码
     */
    public function addError($error_message, $error_code)
    {
        $this->_result['err'] = $error_message;

        $this->_result['errno'] = $error_code;
    }

    /**
     * 输出结果
     * @return JSON
     */
    public function output()
    {
        header('Content-type: application/json');
        return json_encode($this->_result);
    }
}