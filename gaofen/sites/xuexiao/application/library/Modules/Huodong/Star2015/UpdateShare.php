<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/15
 * Time: 上午11:57
 */

namespace Modules\Huodong\Star2015;


use ORM\Auth\Weixin;
use Repositories\Contracts\Repository;
use Repositories\Decorators\BaseDecorator;

class UpdateShare extends BaseDecorator
{
    public function __construct(Repository $repo, Weixin $weixinInfo)
    {
        parent::__construct($repo);
        $this->weixinInfo = $weixinInfo;
    }

    public function create(array $data)
    {
        $data = [
            'wechaname' => $this->weixinInfo->nickname,
            'sid' => $data['id'],
            'open_id' => $this->weixinInfo->openid,
            'wecha_id' => $this->weixinInfo->openid,
            'headimgurl' => $this->weixinInfo->headimgurl
        ];
        return $this->repo->create($data);
    }

}
