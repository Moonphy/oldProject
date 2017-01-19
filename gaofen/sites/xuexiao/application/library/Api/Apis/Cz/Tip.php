<?php
namespace Api\Apis\CZ;

use Api\Base\Cz\Tip as TipBase;

class Tip
{
    protected $_base;

    public function __construct(TipBase $base)
    {
        $this->_base = $base;
    }

    public function getBatch(array $params)
    {
        $tips = $this->_base->getBatch($params);

        return ['list' => $tips, 'total' => count($tips), 'params' => $params];
    }

    public function create(array $params)
    {
        return $this->_base->create($params);
    }

    public function update(array $params)
    {
        return $this->_base->update($params);
    }

    public function delete(array $params)
    {
        return $this->_base->delete($params);
    }
}