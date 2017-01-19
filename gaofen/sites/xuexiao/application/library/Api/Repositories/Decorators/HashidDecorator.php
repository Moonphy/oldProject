<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/6/1
 * Time: 上午10:18
 */

namespace Api\Repositories\Decorators;

use Adapters\Encrypt\EncryptInterface;
use Repositories\Contracts\Repository;
use Repositories\Decorators\BaseDecorator;

/**
 * 处理加密id的字段
 * Class HashidDecorator
 * @package Api\Repositories\Decorators
 */
class HashidDecorator extends BaseDecorator
{
    /**
     * @var EncryptInterface
     */
    protected $crypter;
    /**
     * @var bool
     */
    protected $isBatch;

    public function __construct(EncryptInterface $crypter, Repository $repo, $isBatch = false)
    {
        parent::__construct($repo);
        $this->crypter = $crypter;
        $this->isBatch = $isBatch;
    }

    public function hashidToid($hasid)
    {
        $id = $this->crypter->decode($hasid);

        if ($id) {

            return $this->isBatch ? $id : $id[0];
        }

        return null;
    }

    public function update(array $data, $uuid, $attribute = 'id')
    {
        return parent::update($data, $this->hashidToid($uuid), $attribute);
    }

    public function create(array $data)
    {
        return parent::create($data);
    }

    public function find($uuid, array $columns = ['*'])
    {
        return parent::find($this->hashidToid($uuid), $columns);
    }

    public function delete($uuid)
    {
        return parent::delete($this->hashidToid($uuid));
    }

}