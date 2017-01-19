<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/15
 * Time: 上午11:18
 */

namespace Modules\Huodong\Star2015;


use Modules\Huodong\Star2015\GaofenShare;
use ORM\Auth\Weixin;
use ORM\Huodong\Weixin\Star2015\Card;
use ORM\Huodong\Weixin\Star2015\Share;
use Repositories\BaseDBRepo;

/**
 * Class CardModel
 * @package Modules\Huodong\Star2015
 */
class CardModel
{
    /**
     * @var Weixin
     */
    private $weixinInfo;

    /**
     * @param Weixin $weixin
     */
    public function __construct(Weixin $weixin)
    {
        $this->weixinInfo = $weixin;
    }

    /**
     * 增加封面图
     * @param array $data
     * @return bool|\Illuminate\Database\Eloquent\Model
     */
    public function uploadCover(array $data)
    {
        if ($this->getMyCard()) {

            $card = new \ORM\Huodong\Weixin\Star2015\Cover;
            $repo = new BaseDBRepo($card);
            $repo = new UploadCover($repo, $this->weixinInfo);

            return $repo->create($data);
        }
    }

    /**
     * 判断卡片是否属于浏览者本人
     * @param Card $card
     * @return bool
     */
    public function isMyCard(\ORM\Huodong\Weixin\Star2015\Card $card)
    {
        return $card->open_id == $this->weixinInfo->openid;
    }

    /**
     * 创建一张卡片
     * @param array $data
     * @return bool|\Illuminate\Database\Eloquent\Model
     */
    public function createCard(array $data)
    {
        $card = new \ORM\Huodong\Weixin\Star2015\Card;
        $repo = new BaseDBRepo($card);
        $cardDeco = new \Modules\Huodong\Star2015\Card($repo, $this->weixinInfo);

        return $cardDeco->create($data);
    }

    /**
     * @return mixed
     */
    public function getMyCard($withCover = false)
    {
        $card = new \ORM\Huodong\Weixin\Star2015\Card;

        $orm = $card->where('open_id', $this->weixinInfo->openid);

        if ($withCover) {
            $orm = $orm->with('covers');
        }

        return $orm->first();
    }

    /**
     * @param $id
     * @return \Illuminate\Database\Eloquent\Model|\Illuminate\Support\Collection|null|static
     */
    public function getACard($id)
    {
        $card = new \ORM\Huodong\Weixin\Star2015\Card;

        $card = $card->with('covers')->find($id);

        return $card;
    }

    /**
     * @param Card $card
     * @return mixed
     */
    public function canIPlay(Card $card)
    {
        $play = \DIBuilder::make('Modules\Huodong\Star2015\CanIPlay');

        return $play->canIPlay($card->id, $this->weixinInfo->openid);
    }

    /**
     * @param Card $card
     * @return \Modules\Huodong\Star2015\GaofenShare
     */
    public function getShare(Card $card)
    {
        $url = \F::URL('/huodong/weixin_star2015_card/show', ['id' => $card->id]);
        $url = my_domain() . $url;

        return new GaofenShare($card, $url);

    }

    /**
     * @param array $data
     * @return bool|\Illuminate\Database\Eloquent\Model
     */
    public function updateShare(array $data)
    {
        if ($this->getACard($data['id'])) {
            $share = new Share;
            $repo = new BaseDBRepo($share);
            $repo = new UpdateShare($repo, $this->weixinInfo);

            return $repo->create($data);
        }
    }

    public function destoryMe($id)
    {
        Card::destroy($id);
    }

}