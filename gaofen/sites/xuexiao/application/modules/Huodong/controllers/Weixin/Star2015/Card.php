<?php
use ORM\Huodong\Weixin\Star2015\EventShare;

/**
 * 卓越希望之星2015活动
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/12
 * Time: 上午10:07
 */
class Weixin_Star2015_CardController extends Yaf_Controller_Abstract
{
    use \Weixin\AuthTrait;

    /**
     * @var \Modules\Huodong\Star2015\CardModel
     */
    protected $model;
    /**
     * @var
     */
    protected $weixinInfo;

    /**
     *
     */
    public function init()
    {
        $action = $this->getRequest()->getActionName();

        if (!in_array($action, ['auth', 'callback'])) {

            $this->weixinInfo = $this->getWeixinInfo();

            if (!$this->weixinInfo) {

                $this->auth();
                exit;
            }

            $this->model = new \Modules\Huodong\Star2015\CardModel($this->weixinInfo);
        }
    }

    /**
     * @return bool
     */
    public function indexAction()
    {
        // 判断用户是否已制作过卡片
        if ($card = $this->model->getMyCard()) {
            $this->redirect(F::URL('/huodong/weixin_star2015_card/show', ['id' => $card->id]));

            return false;
        }
        $weixinCfg = DIBuilder::make('Modules\Cp\ShareObject');
        $this->getView()->assign(compact('weixinCfg'));
    }

    /*
     * 贺卡制作页
     */
    public function createAction()
    {
        // 判断用户是否已制作过卡片
        if ($card = $this->model->getMyCard()) {
            $this->redirect(F::URL('/huodong/weixin_star2015_card/show', ['id' => $card->id]));

            return false;
        }

        $weixinInfo = $this->weixinInfo;
        $weixinCfg = DIBuilder::make('Modules\Cp\ShareObject');

        $eventShare = EventShare::find($weixinInfo->openid);

        $phone = $eventShare ? $eventShare->phone : null;

        $this->getView()->assign(compact('weixinInfo', 'weixinCfg', 'phone'));

    }

    /**
     * 上传成功页面
     */
    public function storeAction()
    {
        if ($card = $this->model->getMyCard()) {

            echo '{"errcode":40008,"errmsg":"不能重复创建贺卡"}';
            return false;
        }

        // 更新card, cover
        if ($this->model->createCard(V('R'))) {

            return $this->updateAction();
        }

        return false;
    }

    /**
     * 更新贺卡封面
     */
    public function updateAction()
    {
        if ($this->model->uploadCover(V('R'))) {

            echo '{"ret":1, "errcode":0,"errmsg":""}';

        } else {

            echo '{"errcode":40008,"errmsg":"add fail"}';
        }

        return false;
    }

    /**
     * 贺卡详细页
     */
    public function showAction()
    {
        $id = V('G:id', null);
        $justPlay = V('G:just_play', 0);


        // 没有open_id, 没有制作过卡片,回到index
        if (!$id) {

            $card = $this->model->getMyCard(true);


        } else {

            $card = $this->model->getACard($id);
        }

        if (!$card) {

            $this->redirect(F::URL('/huodong/weixin_star2015_card/index'));

            return false;
        }

        // 判断是否能玩
        $canPlay = $this->model->canIPlay($card);

        //判断是否制作人访问
        $isOwned = $this->model->isMyCard($card);

//       $isOwned = true;
//        $canPlay = false;
        $weixinCfg = DIBuilder::make('Modules\Cp\ShareObject');

        $gaofenShare = $this->model->getShare($card);

        $this->getView()->assign(compact('card', 'isOwned', 'canPlay', 'weixinCfg', 'gaofenShare'));


        // 非制作者本人, 没法游戏|刚玩了游戏
        if (!$isOwned && (!$canPlay || $justPlay)) {
            echo $this->render('sharebyfriends');

            return false;
        }
    }

    /**
     * 触发用户转发分享事件
     * @return bool
     */
    public function onShareAction()
    {

        if ($this->model->updateShare(V('R'))) {

            echo '{"ret":1,"errcode":0,"errmsg":""}';
        }

        return false;
    }

    /**
     * 异步从微信服务器下载用户上传的图片,并给图片生成缩略图和水印
     * @return bool
     */
    public function downPicAction()
    {
        $media_id = V('R:media_id');

        if (empty($media_id)) {
            echo '{"errcode":10000,"errmsg":"empty"}';
        } else {

            $image = DIBuilder::make('Weixin\Image', ['watermark' => ATTACH_DIR . 'cctv_event.png']);
            $path = $image->getResource($media_id);
            echo json_encode(array('ret' => $path, 'errcode' => 0, 'errmsg' => ''));
        }

        return false;
    }

    /**
     * 删除贺卡,销毁所有图片和游戏记录
     * @return bool
     */
    public function destoryAction()
    {
        if (!F::inEnv('product')) {
            $this->model->destoryMe(V('R:id'));
        }

        F::setCookie($this->authCookieName, null, 1);

        $this->redirect(F::URL('/huodong/weixin_star2015_card/index'));

        return false;
    }

}