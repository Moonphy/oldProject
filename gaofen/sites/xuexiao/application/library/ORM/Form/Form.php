<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/28
 * Time: 上午11:21
 */

namespace ORM\Form;


use ORM\Base;
use Presenters\ModelPresenterTrait;

class Form extends Base
{
    use ModelPresenterTrait;

    protected $connection = 'form';

    public $timestamps = true;

    public static function boot()
    {
        parent::boot();
    }

    /**
     * 对外加密主键id
     * @param $id
     * @return mixed
     */
    public function getIdAttribute($id)
    {
        $crypter = \DIBuilder::make('Adapters\Encrypt\EncryptInterface');

        return $crypter->encode($id);
    }

    public function entries()
    {
        return $this->hasMany('ORM\Form\Entry');
    }

}
