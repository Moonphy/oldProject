<?php
namespace Pagination;

/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/4/29
 * Time: 下午2:21
 */
class Paginator extends \Illuminate\Pagination\Paginator
{
    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray()
    {
        return array(
            'total' => $this->total,
            'per_page' => $this->perPage,
            'current_page' => $this->currentPage,
            'last_page' => $this->lastPage,
            'from' => $this->from,
            'to' => $this->to,
            'list' => $this->getCollection()->toArray(),
        );
    }

    public function links($view, array $params, $module = '')
    {
        return $this->factory->getPaginationView($this, $params, $view, $module);
    }

    public function hasPreviousPage()
    {
        return $this->getPreviousPage() > 0;
    }

    public function hasNextPage()
    {
        return $this->getNextPage() <= $this->getLastPage();
    }

    public function getPreviousPage()
    {
        return $this->getCurrentPage() - 1;
    }

    public function getNextPage()
    {
        return $this->getCurrentPage() + 1;
    }

}