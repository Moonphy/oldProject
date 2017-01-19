<?php


class Teacher_TeacherModel
{
    public function explainPayStatus($pay_status) {
    	return CFG::teacher('pay_status', $pay_status);
    }

    public function explainPayType($pay_type){
    	return CFG::teacher('pay_type', $pay_type);
    }

    public function explainOrderType($order_type){
        return CFG::teacher('order_type', $order_type);
    }

    public function explainOrderStatus($order_status){
        return CFG::teacher('order_status', $order_status);
    }
}
