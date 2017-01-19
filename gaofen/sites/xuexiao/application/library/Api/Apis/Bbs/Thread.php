<?php
namespace Api\Apis\Bbs;

use Api\Apis\Base as Base;
use Api\OpenApi;
use Phprpc;

class Thread extends Base
{
    private $rpcClient = false;

    public function __construct(Phprpc $rpc)
    {
        $this->rpcClient =  $rpc->rpc_dzxclient('http://bbs.gaofen.com/api/live/rpc_server.php');
    }

    /**
     * 获取bbs社区帖子
     *
     * @param array $p
     *
     * $parameter['tids'] = '1,2,3';//指定主题ID列 用逗号隔开
     * $parameter['bannedids'] = '1,2,3';//禁止的主题ID列 用逗号隔开
     * $parameter['fids'] = array(1,2,3);//所属版块 数组
     * $parameter['uids'] = '1,2,3';//指定用户 用逗号隔开
     * $parameter['typeids'] = '1,2,3';//主题类别 用逗号隔开
     * $parameter['sortids'] = array(1,2,3);//分类信息ID列
     * $parameter['special'] = array(1,2,3);//特殊主题
     * $parameter['stick'] = array(1,2,3);//置顶帖
     * $parameter['digest'] = array(1,2,3);//精华帖
     * $parameter['startrow'] = 1;//起始行
     * $parameter['items'] = 20;
     * $parameter['orderby'] = ['lastpost','dateline','replies','views','heats','recommends'];//排序方式 选一个
     * $parameter['rewardstatus'] = [1,2];//悬赏主题 0全部 1已解决 2为解决
     * $parameter['titlelength'] = 40;//标题长度
     * $parameter['summarylength'] = 100;//主题简介长度
     * $parameter['recommend'] = 1;//是否推荐主题
     * $parameter['keyword'] = '高考';//关键词
     * $parameter['lastpost'] = 3600;//最后更新时间 单位s
     * $parameter['keyword'] = '高考';//标题关键词
     * $parameter['picrequired'] = 1;//是否必须带图片
     * $parameter['viewmod'] = 1;//是否文章模式查看
     * $parameter['stamp'] = [0,1,2,3,4,5,6,7,8];//图章鉴定类别 NULL 无图章 0精华 1热帖 2美图 3优秀 4置顶 5推荐 6原创 7版主推荐 8爆料
     * $parameter['activity'] = 1 // 1 获取活动数据 0 不获取
     * $parameter['activityimage'] = 1 // 1 获取活动图片 0 不获取
     * $parameter['isgroup'] = 1 // 1 为群组帖子 0 普通帖子
     *
     * @return array.
     */
    public function dzxThread($p = array())
    {
        $picrequired    = OpenApi::param($p, 'picrequired', false);
        $summarylength  = OpenApi::param($p, 'summarylength', false);

        $style = array();
        $parameter = array();
        //获取图片地址
        if ($picrequired) {
            $style['getpic'] = 1;
        }
        //获取摘要
        if ($summarylength) {
            $style['getsummary'] = 1;
        }

        $page = OpenApi::param($p, 'page', 1);
        $count = OpenApi::param($p, 'count', 20);

        $parameter = $p;
        $parameter['startrow'] = ($page - 1) * $count;
        $parameter['items'] = $count;

        unset($p['picrequired']);
        unset($p['summarylength']);
        unset($p['page']);
        unset($p['count']);

        $result = $this->rpcClient->dzxapi_t_thread($style, $parameter);
        if (empty($result)) {
            return array();
        }
        return $result;
    }
}
