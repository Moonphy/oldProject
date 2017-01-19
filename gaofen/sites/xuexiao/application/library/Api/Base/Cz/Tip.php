<?php
namespace Api\Base\Cz;

use Api_Cz_TipModel;
use Cache\Api as Cache;
use Api\Base\Base as Base;

class Tip extends Base
{
    protected $_model;

    protected $_cache;

    protected $_rules = [

    'username' => 'required',
    'content' => 'required',
    'role' => 'required',
    'shared_at' => 'required',
    'period' => 'required',
    'impression' => 'required',
    ];

    protected $_messages = [
    'id.required' => '经验不存在',
    'id.exists' => '经验不存在',
    'school_id.required' => '缺少学校id',
    'school_id.exists' => '学校不存在',
    'username.required' => '缺少用户名',
    'content.required' => '缺少经验',
    'role.required' => '缺身份',
    'shared_at.required' => '缺分享时间',
    'period.required' => '缺在校时间',
    'impression.required' => '缺总体印象',

    ];

    /**
     * @param Api_ItemModel $model
     */
    public function __construct(Api_Cz_TipModel $model, Cache $cache)
    {
        $this->_model = $model;

        $this->_cache = $cache;
    }

    /**
     * 发表动态
     * @param  array  $params
     * @return
     */
    public function create(array $params)
    {
        $rules = $this->_rules;

        /**
         * 检查学校id是否存在
         */
        $rules['school_id'] = 'required|exists:cz_school,id';
        $validator = $this->_validation($params,
                                        $rules,
                                        $this->_messages);

        /**
         * model保存经验到数据库中
         */
        $tip = $this->_model->create($params);

        $this->getBatch(['school_id' => $tip->school_id], true);

        return $tip->toArray();
    }

    public function update(array $params)
    {
        $rules = $this->_rules;
        $rules['id'] = 'required|exists:cz_tips,id';

        $validator = $this->_validation($params,
                                        $rules,
                                        $this->_messages);

        $id = $params['id'];

        $tip = $this->_model->update($id, $params);

        $tip = $this->_cache->get('cztip:school:id', $id);

        $this->getBatch(['school_id' => $tip->school_id], true);

    }

    public function delete(array $params)
    {
        $rules = array_only($this->_rules, ['school_id']);
        $rules['ids'] = 'required';
        $rules['school_id'] = 'required|exists:cz_school,id';

        $validator = $this->_validation($params,
                                        $rules,
                                        $this->_messages);

        $ids = explode(',', $params['ids']);

        if ($ids) {

            $this->_model->delete($ids);
        }

        $this->getBatch(['school_id' => $params['school_id']], true);

        return $ids;
    }

    /**
     * 获取动态
     * @param  array  $params
     * @return
     */
    public function getBatch(array $params, $reset = true)
    {
        $rules = ['school_id' => 'required'];

        $validator = $this->_validation($params,
                                        $rules,
                                        $this->_messages);

        $school_id = $params['school_id'];
        $opt = ['kname' => 'cztip:school:list', 'kvar' => $school_id];



        $tip_ids = $this->cacheCall(['model' => $this->_model,
                                           'func' => 'getIds'],
                                           ['params' => array_except($params, ['page', 'limit'])], $opt, $reset);

        $page = isset($params['page']) ? $params['page'] : 1;
        $limit = isset($params['limit']) ? $params['limit'] : 3;

        $tip_ids = array_slice($tip_ids, ($page - 1) * $limit , $limit);

        $opt = ['kname' => 'cztip:school:id', 'kvars' => $tip_ids];

        $tips = $this->mutiCacheCall(['model' => $this->_model,
                                           'func' => 'getBatch'],
                                           ['ids' => $tip_ids], $opt, $reset);

        return $tips;

    }

}
