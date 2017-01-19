<?php
namespace Presenters\CZ;
use \Presenters\AbstractModelPresenter;

class Tip extends AbstractModelPresenter
{

    public function content()
    {
        $content = explode(PHP_EOL, $this->_model->content);

        $str = NULL;

        foreach ($content as $string) {

            $str .= '<p>'.$string.'</p>';
        }

        return $str;
    }

    public function imperssion()
    {
        $impression = $this->_model->impression;
        $impression = explode('@', $impression);

        $str = NULL;

        foreach ($impression as $impress) {

            $str .= '<span class="item">'.$impress.'</span>';
        }

        return $str;
    }
}