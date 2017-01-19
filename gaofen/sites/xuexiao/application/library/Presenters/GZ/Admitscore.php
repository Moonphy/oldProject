<?php
namespace Presenters\GZ;

use \Presenters\AbstractModelPresenter;

/**
 * 历史分数线
 */
class Admitscore extends AbstractModelPresenter
{
    public function __get($property)
    {
        $output = parent::__get($property);
        return $this->_zeroOutput($output);
    }

    /**
     * 格式化学校名称
     * @param  integer $current_index 当前循环的index
     * @param  integer $rowspan       需要合并的行数
     * @return string
     */
    public function history_name($current_index, $rowspan)
    {
        $schoolName = $this->_model->school_info['name'];
        $url = \F::URL('/gz/school/view', ['id' => $this->_model->sid]);

        $html = "<a href='$url' target='_blank'>$schoolName</a>";
        return $this->_getRowspan($current_index, $rowspan, $html);
    }

    /**
     * 格式化招生范围
     * @param  integer $current_index 当前循环的index
     * @param  integer $rowspan       需要合并的行数
     * @return string
     */
    public function admit_range($current_index, $rowspan)
    {
        // 假如招生类别是民办luqu_id=4，分开招生范围处理
        if ($this->_model->luqu_id == 4) {
            $admit_range = \CFG::school('school', 'gz_admit_range', $this->_model->admit_range_id);
        } else {
            $model = \DIBuilder::singleton('Gz_SchoolModel');
            $admit_range = $model->explainAdmitRange(explode(',', $this->_model->admit_range_id));
            $admit_range = $admit_range[0];
        }

        return '<td>'.$admit_range.'</td>';
    }

    public function batch()
    {
        return \CFG::school('school', 'gz_admit_batch', $this->_model->batch_id);
    }

    public function luqu_type()
    {
        return \CFG::school('luqu_type', $this->_model->luqu_id);
    }

    public function max_wish_num($current_index, $rowspan)
    {
        return $this->_getRowspan($current_index, $rowspan, $this->_zeroOutput($this->_model->max_wish_num));
    }

    protected function _zeroOutput($num)
    {
        return !$num ? '-' : $num;
    }

    protected function _getRowspan($current_index, $rowspan, $data)
    {
        if ($current_index == 0) {
            return "<td rowspan='$rowspan'>".$data.'</td>';
        }
    }
}
