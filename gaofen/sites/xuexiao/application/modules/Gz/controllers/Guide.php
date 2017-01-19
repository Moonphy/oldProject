<?php
use Traits\Gz\GuideData;
use Carbon\Carbon;

/**
 * 选校指南
 * 分数线查询
 */
class GuideController extends Yaf_Controller_Abstract
{
    use GuideData;

    /**
     * 选校指南静态页
     */
    public function indexAction()
    {
    }

    /**
     * 选校指南
     */
    public function selectAction()
    {
        /*
        1）【考生所在区域】默认未选中
        2）【参考年份】默认选中2014年，【录取类别】默认选中户籍生
        3）【录取类别】的选项根据年份而变。2014年：户籍生、借读生、外区生。 2013年及以前：公费生、择校生、自筹生
        4）【中考总分/估分】需填入纯数字，并且为1-810之间的正整数，包含1和810。
        */
        $form = DIBuilder::make('Html\Form', ['model' => V('g')]);
        $model = DIBuilder::singleton('Gz_ChosenModel');

        $data = $this->getSelectData($model);

        $this->getView()->assign($data);
        $this->getView()->assign(compact('form', 'district', 'years', 'defaultYear'));
    }

    /**
     * 选项结果
     */
    public function resultAction()
    {
        /*
        1）推荐结果分3种情况：
        a）如估分高于所有学校和批次的分数线，则固定推荐4家学校：华附、省实、广雅、执信
        b）如估分在最高和最低分数线范围内的，则按精确程度推荐学校。例如，考生695分，则推荐分数线在690-670分的学校和批次。
        c）如估分低于所有学校和批次的分数线，则显示文案：对不起，您的估分太低了，建议报考中专学校。
        2）列表内学校按当前热度排序
        */

        $inputs = V('g');
        $this->rememberSelectedDistrict($inputs);

        $inputs['low_mark'] = V('g:low_mark', 500);
        $inputs['district_id'] = V('g:district_id', 3046);
        $inputs['offset'] = V('g:offset', 10);

        $model = DIBuilder::singleton('Gz_ChosenModel');
        $form = DIBuilder::make('Html\Form', ['model' => $inputs]);

        $data = $this->getSelectData($model);
        $historyData = $this->getHistoryData($model);

        $history = $model->getRecommandSchools($inputs);

        if ($history->isEmpty()) {
            $defaultYear = $this->_getDefaultYear();
            // 在没有数据的情况下，找出最大和最小的分数
            $max_min_score = $model->getMaxMinScore($defaultYear);

            // 判断提示语
            $message = $this->_noneResultMessage($inputs['low_mark'], $max_min_score);

            // 没有提示语，说明分数高于所有学校和批次的分数线
            // 则固定推荐4家学校：华附、省实、广雅、执信
            $history = !$message ? $model->getDefaultSchools($defaultYear) : $history;
        }

        $inputs['offset'] = V('g:offset', 10);

        $this->getView()->assign($data);
        $this->getView()->assign($historyData);
        $this->getView()->assign(compact('history', 'district', 'inputs', 'message', 'form'));
    }

    /**
     * 分数线查询
     */
    public function historyAction()
    {
        /*
        1）年份从每年的7月1日开始选中当年（如2015年7月1日前默认选中2014年，7月1日后默认选中2015年，批次默认选中提前批，招生范围默认为不限，录取类别默认为不限。
        2）录取类别的选项根据年份而变。详见【估分选校】的说明。
        */
        $form = DIBuilder::make('Html\Form', ['model' => V('g')]);
        $model = DIBuilder::singleton('Gz_ChosenModel');

        $data = $this->getHistoryData($model);

        $input = array_merge(['year' => $data['defaultYear'], 'batch_id' => 2], V('g'));
        $history = $model->getScoreHistory($input);

        $this->getView()->assign($data);
        $this->getView()->assign(compact('form', 'history'));
    }

    /**
     * 志愿填报
     */
    public function aspirationAction()
    {
        $model = DIBuilder::singleton('Gz_ChosenModel');
        $news = $model->getZhongkaoNews();

        $now = Carbon::now();
        $this->getView()->assign(compact('news', 'now'));
    }

    public function _noneResultMessage($your_score, $max_min_score)
    {
        if ($your_score < $max_min_score->min_mark) {
            return '对不起，您的估分太低了，建议报考中专学校';
        }

        if ($your_score >= $max_min_score->min_mark && $your_score <= $max_min_score->max_mark) {
            return '抱歉，暂无学校推荐';
        }
    }
}
