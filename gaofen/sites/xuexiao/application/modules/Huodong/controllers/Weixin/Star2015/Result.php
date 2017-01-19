<?php
use ORM\Huodong\Weixin\Star2015\Card;

/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/7/14
 * Time: 上午11:21
 */
class Weixin_Star2015_ResultController extends Yaf_Controller_Abstract
{
    public function indexAction()
    {
        $cards = Card::with('covers')->paginate(50);

        $this->getView()->assign(compact('cards'));

    }
}