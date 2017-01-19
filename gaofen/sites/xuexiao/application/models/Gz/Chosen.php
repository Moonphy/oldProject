<?php
use Illuminate\Database\Eloquent\Collection;

class Gz_ChosenModel
{
    /**
     * 根据城市获取地区
     * @param  integer $cityId
     * @return array
     */
    public function getDistrictByCity($cityId = 289)
    {
        $district = CFG::school('location', 'city', $cityId, 'district');

        return $district ? $district : [];
    }

    /**
     * 录取范围
     * @return array
     */
    public function getLuquType()
    {
        $luquType = CFG::school('luqu_type');

        return $luquType ? $luquType : [];
    }

    /**
     * 录取批次
     * @return array
     */
    public function getBatch()
    {
        $batch = CFG::school('school', 'gz_admit_batch');

        return $batch ? $batch : [];
    }

    /**
     * 招生范围
     * @return array
     */
    public function getAdmitRange()
    {
        $batch = CFG::school('school', 'gz_admit_range');

        return $batch ? $batch : [];
    }

    /**
     * 历史分数线
     * @param  array $input
     * @return array|Collection|static
     * @throws Exception
     */
    public function getScoreHistory(array $input)
    {
        $rst = F::api('/gz/Admitscore/history', $input);
        $scores = sub_array_to_orm($rst['list'], 'ORM\GZ\Admitscore');
        $scores = new Collection($scores);
        $scores = $scores->sortBy('id')->groupBy('sid');

        return $scores;
    }

    /**
     * 根据分数评估学校
     * @param  array $input
     * @return array|Collection|static
     * @throws Exception
     */
    public function getRecommandSchools(array $input)
    {
        $cityId = 289;
        $range_ids = \CFG::admit_range_translate($cityId, $input['district_id']);

        $input['range_id'] = $range_ids ? implode(',', $range_ids) : 0;
        $offset = isset($input['offset']) ? $input['offset'] : 10;
        $higest = (int)$input['low_mark'] + $offset;
        $lowest = (int)$input['low_mark'] - $offset;
        $input['low_mark'] = $higest . ',' . $lowest;

        $rst = F::api('/gz/Admitscore/history', $input);

        $scores = sub_array_to_orm($rst['list'], 'ORM\GZ\Admitscore');
        $scores = new Collection($scores);
        $scores = $scores->groupBy('sid');

        return $scores;
    }

    /**
     * 高于分数线，规定推荐华附、省实、广雅、执信
     * @param $year
     * @return array|Collection|static
     * @throws Exception
     */
    public function getDefaultSchools($year)
    {
        $input['year'] = $year;
        $input['sid'] = '145,54,55';
        $rst = F::api('/gz/Admitscore/history', $input);

        $scores = sub_array_to_orm($rst['list'], 'ORM\GZ\Admitscore');
        $scores = new Collection($scores);
        $scores = $scores->groupBy('sid');

        return $scores;
    }

    /**
     * 返回对应年份最高和最低的分数
     * @param $year
     * @return array
     */
    public function getMaxMinScore($year)
    {
        $model = new Api_Gz_AdmitscoreModel();

        return $model->getMaxMinScore(['year' => $year]);
    }

    /**
     * 中考新闻
     * @return array|mixed
     * @throws Exception
     */
    public function getZhongkaoNews()
    {
        $condiction = ['catslug' => 'zkzhiyuan'];

        $articles = \F::api('/Cp/Article/getArticleList', $condiction);

        return $articles;
    }
}
