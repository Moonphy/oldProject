<?php
namespace Pagination;

use F;
use Illuminate\Pagination\Factory as ParentFactory;
use Yaf_Request_Http;


/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/4/24
 * Time: 下午5:04
 */
class Factory extends ParentFactory
{
    /**
     * Create a new pagination factory.
     *
     * @param  string $pageName
     * @param Yaf_Request_Http $request
     */
    public function __construct($pageName = 'page', Yaf_Request_Http $request)
    {
        $this->pageName = $pageName;
        $this->request = $request;
    }

    /**
     * Get the number of the current page.
     *
     * @return int
     */
    public function getCurrentPage()
    {
        $page = (int)$this->currentPage ?: $this->request->getRequest($this->pageName, 1);

        if ($page < 1 || filter_var($page, FILTER_VALIDATE_INT) === false) {
            return 1;
        }

        return $page;
    }

    /**
     * Get a new paginator instance.
     *
     * @param  array $items
     * @param  int $total
     * @param  int|null $perPage
     * @return Paginator
     */
    public function make($items, $total, $perPage = null)
    {
        $paginator = new Paginator($this, $items, $total, $perPage);

        return $paginator->setupPaginationContext();
    }

    /**
     * Get the pagination view.
     *
     * @param Paginatior $paginator
     * @param array $params
     * @param string $view
     * @param null $module
     * @return string
     * @internal param $Pagination
     */
    public function getPaginationView(Paginator $paginator, array $params = [], $view, $module)
    {
        $data = array('environment' => $this, 'paginator' => $paginator);

        $data += $params;

        return F::TPL($view, $data, $module, true);
    }

    public function getCurrentUrl()
    {
        return null;
    }
}