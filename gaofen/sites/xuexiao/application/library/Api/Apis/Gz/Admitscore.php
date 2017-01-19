<?php
namespace Api\Apis\Gz;

use Api\OpenApi;
use Api\Apis as ApiBase;
use Api\Base\Gz\Admitscore as AdmitScoreApiBase;

class Admitscore extends ApiBase\Base
{
    private $_base = null;

    public function __construct(AdmitScoreApiBase $AdmitScoreApiBase)
    {
        $this->_base = $AdmitScoreApiBase;
    }

    public function get($p = array())
    {
        $id = OpenApi::param($p, 'id');
        $useFormat = OpenApi::param($p, '_useFormat', true);

        if (empty($id)) {
            return array();
        }

        $info = $this->_base->get($id, false, $useFormat);


        return $info;
    }

    public function getBatch($p = array())
    {
        $ids = OpenApi::param($p, 'ids');
        $useFormat = OpenApi::param($p, '_useFormat', true);

        if (empty($ids) || !is_array($ids)) {
            return array();
        }

        $list = $this->_base->getBatch($ids, false, $useFormat);

        return $list;
    }

    public function create($p = array())
    {
        $rs = $this->_base->save($p);

        if (!$rs) {
            OpenApi::throwException(100000, '创建失败');
        }

        return $rs;
    }

    public function update($p = array())
    {
        $id = OpenApi::param($p, 'id');

        if (empty($id)) {
            OpenApi::throwException(100000, '缺少参数');
        }

        $rs = $this->_base->save($p, $id);
        if (!$rs) {
            OpenApi::throwException(100000, '更新失败');
        }

        return $rs;
    }

    public function listByCond(array $p = array())
    {
        $page = OpenApi::param($p, 'page', 1);
        $limit = OpenApi::param($p, 'limit', 30);
        $useFormat = OpenApi::param($p, '_useFormat', true);

        $ids = $this->_base->listIdsByCond($p);

        if (empty($ids)) {
            return array('list' => array(), 'total' => 0);
        }

        $total = count($ids);

        $page    = max($page, 1);
        $offset = ($page-1)*$limit;
        $ids    = array_slice($ids, $offset, $limit);
        $list    = array();
        if ($ids) {
            $list = $this->getBatch(array('ids' => $ids, '_useFormat' => $useFormat));
        }
        return array('list' => array_values($list), 'total' => $total);
    }

    public function delete(array $p = array())
    {
        $id = OpenApi::param($p, 'id');

        $rs = $this->_base->delete($id);
        if (!$rs) {
            OpenApi::throwException(10000, '删除失败');
        }

        return $rs;
    }


    /**
     * 查看历年分数
     * @param \Api\Apis\Gz\Search $search
     * @param \Api\Base\Gz\School $school
     * @param  array             $params
     *  gz_property 录取范围
     *  year 年份
     *  luqu_id
     *  low_mark (low_mark可以根据范围查找)
     * @return array
     */
    public function history(\Api\Apis\Gz\Search $search, \Api\Base\Gz\School $school, array $params)
    {
        $admitRange = new Support\AdmitRange($search);
        $ids = $admitRange->admitScore($params);
        $list = [];

        if ($ids['ids']) {
            $list = $this->_base->getBatch($ids['ids'], false, true);
            $school_ids = array_column($list, 'sid');
            $schools = $school->getBatch($school_ids);

            foreach ($list as $index => $score_record) {
                $sid = $score_record['sid'];

                $list[$index]['school_info'] = isset($schools[$sid]) ? $schools[$sid] : [];
            }
        }

        return ['list' => $list, 'total' => count($list)];
    }
}
