<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/3/23
 * Time: 上午11:48
 */

namespace Repositories\Contracts;


interface RelationProvider
{
    /**
     * @param $primaryKey
     * @param $foreignKey
     * @param array $parentIds
     * @param array $otherCondiction
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getRelationEntries($primaryKey, $foreignKey, array $parentIds, array $otherCondiction = []);
}