<?php
use ORM\CZ\Tip;

class Admin_Cz_TipModel
{
    /**
     * 返回学校分享
     * @param  integer $school_id 学校id
     * @return Illuminate\Database\Eloquent\Collection 分享的集合
     */
    public function getTips($school_id, $limit, $page)
    {

        $results = new StdClass();
        $results->page = $page;
        $results->limit = $limit;
        $results->totalItems = 0;
        $results->items = array();

        $model = Tip::where('school_id', $school_id)
        ->orderBy('id', 'desc');

        $results->totalItems = $model->count();

        $tips = $model->skip($limit * ($page - 1))
        ->orderBy('created_at', 'DESC')
        ->take($limit)
        ->get();

        $results->items = $tips;

        return $results;
    }

    public function create(array $inputs)
    {
        $tip = $this->_getORM($inputs);

        $rest = F::api('cz/tip/create', $tip->toArray());

        return $rest;
    }

    public function update(array $inputs)
    {
        $tip = $this->_getORM($inputs);

        $rest = F::api('cz/tip/update', $tip->toArray());

        return $rest;
    }

    public function delete($ids, $school_id)
    {
     $rest = F::api('cz/tip/delete', ['ids' => $ids, 'school_id' => $school_id]);
     // var_dump($rest);

     return $rest;
 }

 protected function _getORM(array $inputs)
 {
    $inputs['impression'] = implode('@', [$inputs['impression1'],
                                    $inputs['impression2'],
                                    $inputs['impression3']]);
    $inputs['shared_at'] = strtotime($inputs['shared_at']);

    $inputs = array_only($inputs, ['id', 'school_id', 'username', 'content', 'avatar',
                         'role', 'shared_at', 'period', 'impression']);

    return NY('\ORM\CZ\Tip', ['attributes' => $inputs]);
}
}