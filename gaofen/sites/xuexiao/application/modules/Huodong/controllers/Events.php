<?php
use Filters\ControllerFilterTrait;

/**
 * 活动移动版控制器
 * Class EventsController
 */
class EventsController extends Yaf_Controller_Abstract
{
    use ControllerFilterTrait;

    use \Weixin\AuthTrait;

    /**
     *
     */
    public function init()
    {
//        \F::setEnv('product');
        $this->filters(['DisableView', 'AuthAjaxRequest'], ['only' => ['ajaxHuodongs']]);

        $agent = new UserAgent();

        if ($agent->is_weixin()) {

            $action = $this->getRequest()->getActionName();

            if (!in_array($action, ['auth', 'callback'])) {

                $this->weixinInfo = $this->getWeixinInfo();

                if (!$this->weixinInfo) {

                    $this->auth();
                    exit;
                }
            }
        }

    }

    /**
     * 活动首页
     */
    public function indexAction()
    {
        $huodongList = DIBuilder::make(Modules\Huodong\HuodongList::class);

        $huodongs =  $huodongList->get(1, 8);

        $this->getView()->assign(compact('huodongs'));
    }

    /**
     * 活动详细页
     */
    public function showAction()
    {
        $id = V('g:id', null);

        $huodong = DIBuilder::make(Modules\Huodong\SpecifyHuodong::class);

        $this->getView()->assign('huodong', $huodong->get($id));
    }

    /**
     * 通过ajax获取更多活动
     */
    public function ajaxHuodongAction()
    {
        $page = V('g:page', 2);
        $huodongList = DIBuilder::make(Modules\Huodong\HuodongList::class);

        // 首次载入8个, 继续加载时每次载入5个
        $huodongs = $huodongList->get($page, 8);

        $string = F::TPL('/events/ajaxhuodongs.html', ['huodongs' => $huodongs['list']], 'Huodong', true);

        F::ajaxRst([
            'html' => $string,
            'count' => $huodongs['list'] ? $huodongs['list']->count():0,
        ]);
    }
}