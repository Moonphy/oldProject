<?php
namespace Api\Apis\Cp;

use Api\Apis\Base as Base;
use Api\OpenApi;
use Phprpc;

class Article extends Base
{
    private $rpcClient = false;

    public function __construct(Phprpc $rpc)
    {
        $this->rpcClient =  $rpc->rpc_dzxclient(RPC_URL_ARTICLE);
    }

    /**
     * 获取文章列表
     * @param array $params
     * @return mixed
     */
    public function getArticleList(array $params)
    {
        $p = null;

        foreach ($params as $key => $value) {

            if (is_array($value)) {

                $value = implode(',', $value);
            }

            $p .= $key.'='.$value.'&';
        }
        return $rst = $this->rpcClient
        ->rpc_post($p);
    }


}
