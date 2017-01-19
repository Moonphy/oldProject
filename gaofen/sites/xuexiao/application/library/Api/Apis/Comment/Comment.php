<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/4/22
 * Time: 下午5:01
 */

namespace Api\Apis\Comment;

use Api\DecoratorsFactory;
use Repositories\BaseDBRepo;
use Repositories\Contracts\RelationProvider;
use Repositories\Criteria\Batch;
use Repositories\Criteria\OrderBy;
use Traits\Validator;


class Comment implements RelationProvider
{
    use Validator;

    /**
     * @var \ORM\COMMENT\Comment
     */
    private $entry;
    private $repo;
    /**
     * @var DecoratorsFactory
     */
    private $factory;

    public function __construct(\ORM\COMMENT\Comment $entry, DecoratorsFactory $factory)
    {
        $this->entry = $entry;
        $this->repo = new BaseDBRepo($entry);
        $this->factory = $factory;
    }

    /**
     * 创建一条评论
     * @param array $params
     * @return bool|\Illuminate\Database\Eloquent\Model
     */
    public function create(array $params)
    {
        $rules = [
            'project_id' => 'required|exists:threads,project_id,is_open,1',
            'message' => 'required',
        ];

        $message = [
            'project_id.required' => '必须提供project_id',
            'project_id.exists' => '主题不存在',
            'message.required' => '缺少评论',

        ];

        $this->validate($params, $rules, $message, 'comment');

        $params = array_only($params,
            ['project_id', 'title', 'message', 'extension', 'author', 'author_id', 'is_pending']);

        return $this->repo->create($params);
    }

    /**
     * @param array $params
     * @return mixed
     */
    public function listByCond(array $params)
    {
        $page = isset($params['page']) ? $params['page'] : 1;
        $limit = isset($params['limit']) ? $params['limit'] : 20;

        $params = array_only($params, ['project_id', 'author', 'author_id']);

        $repo = $this->repo->pushCriteria(new OrderBy('created_at', 'desc'));

        $repo = $this->factory
            ->setDecoratorParamters('asterisk', ['replaceFields' => ['project_id']])
            ->make($repo, $params, $this->entry);

        return $entries = $repo->paginate($page, $limit, $params);
    }

    /**
     * @param $primaryKey
     * @param $foreignKey
     * @param array $parentIds
     * @param array $otherCondiction
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getRelationEntries($primaryKey, $foreignKey, array $parentIds, array $otherCondiction = [])
    {
        $repo = $this->repo;

        if (!isset($otherCondiction[$foreignKey])) {

            $criterion = new Batch($foreignKey, $parentIds);

            $repo->pushCriteria($criterion);
        }

        $page = isset($otherCondiction['page']) ? $otherCondiction['page'] : 1;
        $limit = isset($otherCondiction['limit']) ? $otherCondiction['limit'] : 20;

        $otherCondiction = array_except($otherCondiction, ['page', 'limit']);

        $repo = $this->factory->make($this->repo, $otherCondiction, $this->entry);

        return $entries = $repo->paginate($page, $limit, $otherCondiction);
    }
}