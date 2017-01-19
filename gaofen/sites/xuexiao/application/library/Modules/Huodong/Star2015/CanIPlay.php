<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/14
 * Time: 上午10:58
 */

namespace Modules\Huodong\Star2015;


use ORM\Huodong\Weixin\Star2015\Card;
use ORM\Huodong\Weixin\Star2015\Game;

class CanIPlay
{
    protected $gameEntry;
    protected $cardEntry;

    public function __construct(Card $cardEntry, Game $gameEntry)
    {
        $this->cardEntry = $cardEntry;
        $this->gameEntry = $gameEntry;
    }

    public function canIPlay($gameId, $playerId)
    {
        // 检查创造者创建了多少张卡片
        $card = $this->cardEntry->find($gameId);
        $creatorCards = $card->total_covers;

        // 玩家玩了多少遍
        $game = $this->gameEntry->where('open_id', $playerId)
            ->where('sid', $card->id)->get();

        $playerPlays = $game->count();

        // 创造者只能玩一次
        if ($card->open_id == $playerId) {

            return $playerPlays < 1;
        }

        return $playerPlays < $creatorCards;
    }

}