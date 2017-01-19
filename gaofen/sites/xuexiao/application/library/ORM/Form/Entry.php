<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/6/1
 * Time: 下午3:03
 */

namespace ORM\Form;


use ORM\Base;
use Presenters\ModelPresenterTrait;

class Entry extends Base
{
    use ModelPresenterTrait;

    protected $connection = 'form';

    public $timestamps = true;

    protected $table = 'entries';

    public static function boot()
    {
        parent::boot();
    }

    public function form()
    {
        return $this->belongsTo('ORM\Form\Form');
    }

    /**
     * 对外加密主键id
     * @param $id
     * @return mixed
     */
    public function getIdAttribute($id)
    {
        return $this->encodeId($id);
    }

    /**
     * 对外加密主键id
     * @param $formId
     */
    public function getFormIdAttribute($formId)
    {
        return $this->encodeId($formId);
    }

    protected function encodeId($value)
    {
        $crypter = \DIBuilder::make('Adapters\Encrypt\EncryptInterface');

        return $crypter->encode($value);
    }

}