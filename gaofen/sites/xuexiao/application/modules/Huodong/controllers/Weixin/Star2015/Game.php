<?php

/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/12
 * Time: 上午10:31
 */
class Weixin_Star2015_GameController extends Yaf_Controller_Abstract
{
    use \Weixin\AuthTrait;

    protected $gameId = null;
    protected $weixinInfo;

    protected $gameEntry;
    protected $cardEntry;

    protected $play;

    public function init()
    {
        $this->weixinInfo = $this->getWeixinInfo();

        $this->gameId = V('R:id');

        if (!$this->gameId) {

            $this->redirect(F::URL('/huodong/weixin_star2015_card/index'));
        }

        $this->cardEntry = new \ORM\Huodong\Weixin\Star2015\Card();

        $this->gameEntry = new \ORM\Huodong\Weixin\Star2015\Game();

        $this->play = new \Modules\Huodong\Star2015\CanIPlay($this->cardEntry, $this->gameEntry);

        $this->getView()->assign('gameId', $this->gameId);
        $this->getView()->assign('weixinInfo', $this->weixinInfo);
    }

    /**
     * 游戏正式页面
     */
    public function indexAction()
    {
        // 判断用户已否能玩游戏
        if (!$this->play->canIPlay($this->gameId, $this->weixinInfo->openid)) {
            $this->redirect(F::URL('/huodong/weixin_star2015_card/show', ['id' => $this->gameId]));
            return false;
        }

        $weixinCfg = DIBuilder::make('Modules\Cp\ShareObject');
        $this->getView()->assign(compact('weixinCfg'));
    }

    public function recordAction()
    {
        if ($this->play->canIPlay($this->gameId, $this->weixinInfo->openid)) {
            // 结算分数
            $score = V('R:score', 0);

            $data = [
                'open_id' => $this->weixinInfo->openid,
                'score' => $score,
                'wecha_id' => $this->weixinInfo->openid,
                'wechaname' => $this->weixinInfo->nickname,
                'headimgurl' => $this->weixinInfo->headimgurl
            ];

            $game = $this->gameEntry->newInstance($data);

            $this->cardEntry->find($this->gameId)->games()->save($game);

            echo '{"ret":1,"errcode":0,"errmsg":""}';
        } else {

            echo '{"ret":0,"errcode":1,"errmsg":""}';
        }

        return false;

    }


}