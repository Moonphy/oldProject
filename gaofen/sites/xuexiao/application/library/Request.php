<?php

/**
 * 
 */
class Request
{
    public static function getModuleName() {
        return strtolower(Yaf_Dispatcher::getInstance()->getRequest()->getModuleName());
    }

    public static function getControllerName() {
        return strtolower(Yaf_Dispatcher::getInstance()->getRequest()->getControllerName());
    }

    public static function getActionName() {
        return strtolower(Yaf_Dispatcher::getInstance()->getRequest()->getActionName());
    }

    public static function getParams() {
    	Yaf_Dispatcher::getInstance()->getRequest()->getParams();
    }
}