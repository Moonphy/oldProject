<?php

namespace Traits\Gz;

use Carbon\Carbon;

trait GuideData
{
    public function getSelectData(\Gz_ChosenModel $model)
    {
        $district = $model->getDistrictByCity(V('g:city', 289));
        // 删除广州周边
        $district = array_except($district, 65535);
        $years = $this->_getYears();
        $defaultYear = $this->_getDefaultYear();

        return compact('district', 'years', 'defaultYear');
    }

    public function getHistoryData(\Gz_ChosenModel $model)
    {
        $admitRange = $model->getAdmitRange();
        $years = $this->_getYears();

        $luqu_type = $model->getLuquType();
        $batch = $model->getBatch();

        $defaultYear = $this->_getDefaultYear();

        return compact('admitRange', 'years', 'defaultYear', 'luqu_type', 'batch');
    }

    public function rememberSelectedDistrict(array $inputs)
    {
        isset($inputs['district_id']) ? \F::setCookie('LastSelectedDistrict', $inputs['district_id']) : null;
    }

    public function getLastSelectedDistrict()
    {
        return \F::getCookie('LastSelectedDistrict');
    }

    protected function _getYears()
    {
        $range = range($this->_getDefaultYear(), 2011);
        return array_combine($range, $range);
    }

    /**
     * 获取默认选中的年份
     * 年份从每年的7月1日开始选中当年（如2015年7月1日前默认选中2014年，7月1日后默认选中2015年
     * @return integer
     */
    protected function _getDefaultYear()
    {
        $targetTime = Carbon::createFromDate(date('Y'), 7, 1);
        $now = Carbon::now();
        return  $now->gt($targetTime) ? $targetTime->year : $now->subYear()->year;
    }
}
