<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/14
 * Time: 下午4:05
 */

namespace Modules\Huodong\Star2015;


use ORM\Huodong\Weixin\Star2015\Card;

class GaofenShare
{
    /**
     * @var Card
     */
    private $card;
    private $url;

    public function __construct(Card $card, $url)
    {
        $this->card = $card;
        $this->url = $url;
    }

    public function toJson($type = '')
    {
        $data = [
            'link' => $this->url,
            'imgUrl' => my_domain().$this->card->covers->first()->pic,
        ];

        if ($type == 'timeline') {

            $data += [
                'title' => '我正在参加全城悬赏，寻找升学宗师!',
                'desc' => '我正在参加全城悬赏，寻找升学宗师!',
            ];
        } else {

            $data += [
                'title' => '我正在参加全城悬赏，寻找升学宗师',
                'desc' => '参与小游戏，帮我赢大奖，期待为我加油！',
            ];
        }

        return json_encode($data);
    }

}