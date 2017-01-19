<?php
namespace Modules\Huodong\Ny2016;

use Modules\Huodong\Bestvoice\Material as BaseMaterial;
use F;

class Material extends BaseMaterial
{
    protected static $materialData = [];
    private $_session_key = 'E_NY_SESS_MATERIAL';
    protected $_owner = null;

    public function __construct($type)
    {
        $this->_type = $type;

        $this->_session_start();
        if(empty(static::$materialData)) {
            if(!empty($this->getData(null))) {
                static::$materialData = $this->getData(null);
            }
        }
    }

    public function __destruct() {
        $this->setData(static::$materialData);
    }

    private function _session_start() {
        if(!isset($_SESSION)) {
            session_start();
        }

        return true;
    }

    public function getVoiceLink() {
        $link = '';
        if(F::inEnv('develop')) {
            $link = '/data/uploads'.static::$materialData['path'];
        } else {
            $link = GAOFEN_STATIC.static::$materialData['path'];
        }

        $UA = new \UserAgent();

        if($UA->is_mobile('android')) {
            $link = $link . '.amr';
        } else {
            $link = $link . '.mp3';
        }

        return $link;    
    }

    public function __get($key){
        if(!empty(static::$materialData) && isset(static::$materialData[$key])){
            return static::$materialData[$key];
        }
        $owner = $this->getOwner();
        if (isset($owner) && isset($owner->$key)) {
            if ($key == 'headimgurl' && empty(trim($owner->$key))) {
                return GAOFEN_STATIC.'/html/weixin/bainian/img/dummies/avatar_48x48.png';
            }
            return $owner->$key;
        }
        return NULL;
    }

    public function setData($data, $key = 'material') {
        if (!isset($_SESSION[$this->_session_key])) {
            $_SESSION[$this->_session_key] = array();
        }
        $_SESSION[$this->_session_key][$key] = $data;
        return true;
    }

    public function getData($key = '') {
        /*
        if($key) {
            return isset($_SESSION[$this->_session_key][$key])?$_SESSION[$this->_session_key][$key]:NULL;
        }else {
            return isset($_SESSION[$this->_session_key])?$_SESSION[$this->_session_key]:NULL;
        }
        */

        if (!isset($_SESSION[$this->_session_key])) {
            return null;
        }
        if (empty($key)) {
            if (isset($_SESSION[$this->_session_key]['material'])) {
                return $_SESSION[$this->_session_key]['material'];
            }
            return null;
        }
        if (isset($_SESSION[$this->_session_key]['material'][$key])) {
            return $_SESSION[$this->_session_key]['material'][$key];
        }
        if (isset($_SESSION[$this->_session_key][$key])) {
            return $_SESSION[$this->_session_key][$key];
        }
        return null;
    }

    public function set($materialId)
    {
        $material = F::api('/Huodong/Bestvoice/Material/get', array('id' => $materialId));
        if ($material) {
            static::$materialData = $material->toArray();
            $this->setData(static::$materialData);
        }
    }

    public function reset()
    {
        static::$materialData = null;
        $this->_owner = null;
        $this->setData(null);
    }

    public function isUser($userId)
    {
        if (!$this->hasMaterial()) {
            return false;
        }
        return $this->uid == $userId;
    }

    public function hasMaterial($userId = null)
    {
        if (!static::$materialData) {
            if ($userId) {
                $material = F::api('/Huodong/Bestvoice/Material/listByCond', array('uid' => $userId, 'type' => $this->_type));

                if (0 < sizeof($material['list'])) {
                    $this->set($material['list'][0]->id);
                    return true;
                }
            }
            return false;
        }
        return true;
    }

    public function getOwner()
    {
        if (null == $this->_owner && isset(static::$materialData['uid'])) {
            $this->_owner = F::api('/Huodong/Bestvoice/User/get', array('id' => $this->uid));
        }
        return $this->_owner;
    }
}
