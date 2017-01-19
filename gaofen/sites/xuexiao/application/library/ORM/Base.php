<?php
namespace ORM;

use Illuminate\Database\Eloquent\Model as Eloquent;

class Base extends Eloquent
{

    protected $guarded = ['deleted_at'];

    public $timestamps = false;

}