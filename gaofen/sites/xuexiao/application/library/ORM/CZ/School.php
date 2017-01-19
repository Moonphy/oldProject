<?php
namespace ORM\CZ;

use Illuminate\Database\Eloquent\SoftDeletingTrait;
use ORM\Base as ORMBase;
use Presenters\ModelPresenterTrait;

/**
 * Class School
 * @package ORM\CZ
 */
class School extends ORMBase
{
    use SoftDeletingTrait;
    use ModelPresenterTrait;

    /**
     * @var string
     */
    protected $table = 'cz_school';
    /**
     * @var string
     */
    protected $_present = '\Presenters\CZ\School';
    /**
     * @var bool
     */
    public $timestamps = true;

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function scores()
    {
        return $this->hasMany('ORM\CZ\Score', 'sid', 'id');
    }

    public function admitFortes()
    {

        return $this->hasMany('ORM\CZ\Admitforte', 'sid', 'id');
    }
}
