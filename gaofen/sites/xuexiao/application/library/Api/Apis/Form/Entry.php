<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/6/2
 * Time: 下午3:50
 */

namespace Api\Apis\Form;


use Api\DecoratorsFactory;
use Api\OpenApi;
use ORM\Form\MongoEntry;
use Repositories\BaseDBRepo;
use Repositories\Criteria\OrderBy;
use Traits\Validator;
use Api\Apis\Form\Decorators\FieldsToJson;

class Entry
{
    use Validator;

    /**
     * @var \ORM\Form\Entry
     */
    private $dbEntry;
    /**
     * @var MongoEntry
     */
    private $mongoEntry;
    /**
     * @var DecoratorsFactory
     */
    private $factory;

    /**
     * @param \ORM\Form\Entry $dbEntry
     * @param DecoratorsFactory $factory
     */
    public function __construct(\ORM\Form\Entry $dbEntry, DecoratorsFactory $factory)
    {
        $this->dbEntry = $dbEntry;
        $this->factory = $factory;
    }

    public function create(array $params)
    {
        $rules = ['form_id' => 'required|hashid_exists:forms,id'];
        $messages = [
            'form_id.required' => '请提供表单id',
            'form_id.hashid_exists' => '表单不存在'
        ];
        $this->validate($params, $rules, $messages, 'form');

        $repo = new BaseDBRepo($this->dbEntry);
        $repo = new FieldsToJson($repo);
        $repo = \DIBuilder::make('Api\Apis\Form\Decorators\HashidDecorator', ['repo' => $repo]);
        $repo = $this->factory->make($repo, $params, $this->dbEntry);

        $params = array_only($params, ['form_id', 'fields']);

        return $repo->create($params);

    }

    /**
     * @param array $params
     * @option page
     * @option limit
     * @return mixed
     */
    public function listByCond(array $params)
    {
        $repo = new BaseDBRepo($this->dbEntry);
        $repo->pushCriteria(new OrderBy('created_at', 'desc'));

        $repo = \DIBuilder::make('Api\Apis\Form\Decorators\HashidDecorator', ['repo' => $repo]);
        $repo = $this->factory->make($repo, $params, $this->dbEntry);

        $page = OpenApi::param($params, 'page', 1);
        $limit = OpenApi::param($params, 'limit', 20);

        $params = array_except($params, ['page', 'limit']);

        return $repo->paginate($page, $limit, $params);
    }

}