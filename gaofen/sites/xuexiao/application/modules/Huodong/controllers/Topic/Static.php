<?php
class Topic_StaticController extends Yaf_Controller_Abstract
{	

    function viewAction($id) {
        $this->getView()->display("topic/static/{$id}.html");
        return false;
    }

}