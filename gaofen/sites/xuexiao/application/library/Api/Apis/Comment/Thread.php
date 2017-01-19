<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/4/22
 * Time: 下午3:45
 */

namespace Api\Apis\Comment;

use Api\ApiParameterTrait;
use Api\DecoratorsFactory;
use Repositories\BaseDBRepo;
use Traits\Validator;

class Thread
{
    use Validator;
    use ApiParameterTrait;

    /**
     * @var \ORM\COMMENT\Thread
     */
    private $entry;
    private $repo;
    /**
     * @var DecoratorsFactory
     */
    private $factory;

    /**
     * @param \ORM\COMMENT\Thread $entry
     * @param DecoratorsFactory $factory
     */
    public function __construct(\ORM\COMMENT\Thread $entry, DecoratorsFactory $factory)
    {
        $this->entry = $entry;
        $this->repo = new BaseDBRepo($entry);
        $this->factory = $factory;
    }

    public function create(array $params)
    {
        $rules = [
            'project_id' => 'required',
            'title' => 'required',
        ];

        $message = [
            'project_id.required' => '必须提供唯一标示符{project_id}',
            'title.required' => '必须提供评论的主题参数{title}',

        ];

        $this->validate($params, $rules, $message, 'comment');

        $repo = $this->factory->make($this->repo, $params, $this->entry);

        $params = array_only($params, ['project_id', 'title', 'is_open']);

        return $repo->create($params);
    }

    /**
     * 获取一条评论主题,如果主题不存在,系统自动创建
     * @param array $params
     * @return \Illuminate\Database\Eloquent\Collection|null|static
     */
    public function get(array $params)
    {
        $rules = [
            'project_id' => 'required|asterisk_exists:threads,project_id'
        ];

        $message = [
            'project_id.required' => '必须提供唯一标示符{project_id}',
            'project_id.asterisk_exists' => '主题不存在',
        ];

        try {

            $this->validate($params, $rules, $message, 'comment');

        } catch (\InvalidArgumentException $e) {

            if ($e->getMessage() != $message['project_id.asterisk_exists']) {

                throw $e;
            }

            $this->create($params);
        }

        $repo = $this->factory
            ->setDecoratorParamters('asterisk', ['replaceFields' => ['project_id']])
            ->make($this->repo, $params, $this->entry);

        return $repo->find($params['project_id'], $this->getFieldParamters($params));

    }

}