<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/28
 * Time: 下午2:28
 */
namespace Api\Apis\Form;

use Api\Apis\Form\Decorators\FieldsToJson;
use Api\DecoratorsFactory;
use Api\OpenApi;
use ORM\Form\Form as DBForm;
use ORM\Form\MongoForm;
use Repositories\BaseDBRepo;
use Repositories\Criteria\OrderBy;
use Traits\EventTraits;
use Traits\Validator;

class Form
{
    use Validator;
    use EventTraits;

    /**
     * @var DBForm
     */
    private $dbForm;
    /**
     * @var MongoForm
     */
    private $mongoForm;
    /**
     * @var DecoratorsFactory
     */
    private $factory;

    public function __construct(DBForm $dbForm, DecoratorsFactory $factory)
    {
        $this->dbForm = $dbForm;
        $this->factory = $factory;
    }

    /**
     * @param array $params
     * @option string title required 表单标题
     * @option string description 表单描述
     * @option string fields 表单报名信息
     * @option datetime begin_at 表单开始时间
     * @option datetime expired_at 表单结束时间
     * @return bool|\Illuminate\Database\Eloquent\Model
     */
    public function create(array $params)
    {
        $rules = ['title' => 'required'];
        $messages = ['title.required' => '必须填写标题{title}'];
        $this->validate($params, $rules, $messages, 'form');

        $repo = new BaseDBRepo($this->dbForm);
        $repo = new FieldsToJson($repo);
        $repo = \DIBuilder::make('Api\Apis\Form\Decorators\DefaultTime', ['repo' => $repo]);
        $repo = $this->factory->make($repo, $params, $this->dbForm);

        $params = array_only($params, ['title', 'description', 'fields', 'begin_at', 'expired_at']);

        $form = $repo->create($params);

        $this->fireEvent('custom_form.created', [$form]);

        return $form;
    }

    /**
     * @param array $params
     * @option id rquired
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function get(array $params)
    {
        $rules = ['id' => 'required'];
        $messages = ['id.required' => '必须提供表单id'];
        $this->validate($params, $rules, $messages, 'form');

        $repo = new BaseDBRepo($this->dbForm);
        $repo = \DIBuilder::make('Api\Repositories\Decorators\HashidDecorator', ['repo' => $repo]);
        $repo = $this->factory->make($repo, $params, $this->dbForm);

        return $repo->find($params['id']);
    }

    /**
     * @param array $params
     * @option integer page 页码
     * @option integer limit 每页限制
     * @return mixed
     */
    public function listByCond(array $params)
    {
        $repo = new BaseDBRepo($this->dbForm);
        $repo->pushCriteria(new OrderBy('created_at', 'desc'));

        $repo = $this->factory->make($repo, $params, $this->dbForm);

        $page = OpenApi::param($params, 'page', 1);
        $limit = OpenApi::param($params, 'limit', 20);

        $params = array_except($params, ['page', 'limit']);

        return $repo->paginate($page, $limit, $params);
    }

    /**
     * @param array $params
     * @option id required
     * @option string title required 表单标题
     * @option string description 表单描述
     * @option string fields 表单报名信息
     * @option datetime begin_at 表单开始时间
     * @option datetime expired_at 表单结束时间
     */
    public function update(array $params)
    {
        $rules = ['id' => 'required|hashid_exists:forms,id'];
        $messages = ['id.required' => '必须提供表单id', 'hashid_exists.exists' => '表单不存在'];
        $this->validate($params, $rules, $messages, 'form');

        $repo = new BaseDBRepo($this->dbForm);
        $repo = new FieldsToJson($repo);
        $repo = $this->factory->make($repo, $params, $this->dbForm);
        $repo = \DIBuilder::make('Api\Repositories\Decorators\HashidDecorator', ['repo' => $repo]);

        $id = $params['id'];
        $params = array_only($params, ['title', 'description', 'fields', 'begin_at', 'expired_at']);

        $ret = $repo->update($params, $id);
        $this->fireEvent('custom_form.updated', [['id' => $id]]);

        return $ret;
    }

    /**
     * @param array $params
     * @option id required
     */
    public function delete(array $params)
    {
        $rules = ['id' => 'required|exists:forms,id'];
        $messages = ['id.required' => '必须提供表单id', 'id.exists' => '表单不存在'];
        $this->validate($params, $rules, $messages, 'form');

        $id = $params['id'];
        $this->fireEvent('custom_form.deleted', [['id' => $id]]);
    }

}