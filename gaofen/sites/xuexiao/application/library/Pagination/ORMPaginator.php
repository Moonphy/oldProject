<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/4/30
 * Time: 下午3:46
 */

namespace Pagination;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\Factory as SBFactory; // 兼容性

class ORMPaginator extends Paginator
{
    protected $delimiter = '<!--nextpage-->';

    protected $entry;
    /**
     * @var int
     */
    private $splitPart;

    /**
     * Create a new Paginator instance.
     *
     * @param  \Illuminate\Pagination\Factory $factory
     * @param Model $entry
     * @param int $splitPart
     * @param int $page
     * @param null $delimiter
     * @internal param array $items
     */
    public function __construct(SBFactory $factory, Model $entry, $splitPart, $page = 1, $delimiter = null)
    {
        $this->entry = $entry;

        $contents = $this->splitPost($splitPart);

        $total = count($contents);

        $perPage = 1;

        $this->splitPart = $splitPart;

        $this->delimiter = $delimiter ? $delimiter : $this->delimiter;

        parent::__construct($factory, $contents, $total, $perPage);
        $this->setupPaginationContext();
        $this->currentPage = $page;
    }

    /**
     * Get the current page for the request.
     *
     * @param  int|null $total
     * @return int
     */
    public function getCurrentPage($total = null)
    {
        $page = parent::getCurrentPage($total);

//        假如超过最大分页,当前页返回第一页
        return $this->offsetExists($page - 1) ? $page : 1;

    }

    protected function splitPost($splitPart)
    {
        return explode($this->delimiter, $this->entry->$splitPart);
    }

    protected function getSplitPart()
    {
        $page = $this->getCurrentPage();

        return $this->offsetGet($page - 1);
    }

    public function getEntry()
    {
        return $this->entry;
    }

    public function __get($property)
    {
        if ($property === $this->splitPart) {

            return $this->getSplitPart();
        }

        return $this->entry->$property;
    }

}