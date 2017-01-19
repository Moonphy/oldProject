<?php
use ORM\CZ\Tip;
use Carbon\Carbon;

class Api_Cz_TipModel
{
    protected $_col = ['school_id', 'username', 'content', 'avatar',
    'role', 'shared_at', 'period', 'impression'];

    public function getOne($id)
    {
        return Tip::find($id)->toArray();
    }

    public function getIds(array $condiction)
    {
        $tip = Tip::whereNotIn('id', [0]);

        foreach ($condiction as $where => $value) {

            $tip->where($where, $value);
        }

        $tip->orderBy('shared_at', 'DESC');

        return $tip->get(['id'])->lists('id');
    }

    public function getBatch(array $ids)
    {
        $tip = Tip::whereIn('id', $ids)->get()->toArray();
        $tip = array_reset_key($tip, 'id');

        return $tip;
    }

    public function create(array $params)
    {
        $data = array_only($params, $this->_col);

        $data['shared_at'] = Carbon::createFromTimeStamp($params['shared_at']);

        return Tip::create($data);
    }

    public function update($id, array $params)
    {
        $data = array_only($params, $this->_col);

        $data['shared_at'] = Carbon::createFromTimeStamp($params['shared_at']);

        return Tip::find($id)->update($data);
    }

    public function delete(array $ids)
    {
        if ($ids) {

            return Tip::whereIn('id', $ids)->delete();
        }

    }
}