<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/3/19
 * Time: 下午2:56
 */

namespace Repositories\Contracts;

use Repositories\Criterion;

/**
 * Interface CriteriaInterface
 * @package Bosnadev\Repositories\Contracts
 */
interface CriteriaInterface {

    /**
     * @param bool $status
     * @return $this
     */
    public function skipCriteria($status = true);

    /**
     * @return mixed
     */
    public function getCriteria();

    /**
     * @param Criterion $criteria
     * @return $this
     */
    public function getByCriteria(Criterion $criteria);

    /**
     * @param Criterion $criteria
     * @return $this
     */
    public function pushCriteria(Criterion $criteria);

    /**
     * @return $this
     */
    public function  applyCriteria();
}