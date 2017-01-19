<?php
namespace Api\Base;

use Api\OpenApi;
use Cache\Api as CacheApi;
use Cache\Traits\CacheCall;
use Illuminate\Validation\Validator;

/**
 * 项目名称:  高分CMS
 * 建立日期:  2013年03月04日
 *
 * api应用基础Model
 *
 * @作者 heli <heli@gaofen.com>
 * @版本 $Id:
 **/
abstract class Base
{
    use CacheCall;

    /**
     * $this->getBase('Tblock');
     *
     * @param mixed $basename
     */
    protected function getBase($basename)
    {
        return OpenApi::apiBase($basename);
    }

    /**
     * 验证错误信息
     * 错误则抛异常
     * @param  array $data_need_valids 待验证的数据
     * @param  array $rules            验证规则
     * @param  array $custom_message   自定义错误信息
     * @param  string $connectionName  连接的名称
     */
    protected function _validation(
        array $data_need_valids,
        array $rules,
        array $custom_message = [],
        $connectionName = 'default'
    ) {
        $validator = \Validation::make($data_need_valids, $rules, $custom_message, $connectionName);


        if ($validator->fails()) {
            $message = $validator->messages()->first();

            OpenApi::throwException(10000, $message);
        }
    }


    /**
     * 参数值验证
     *
     * @param mixed $fields  array(字段=>值域) 例:array('id'=>'int|require', 'name'=>'string'); 如果值域包含require侧为必埴
     *                       否则抛异常
     * @param mixed $values  字段值, array('id'=>25, 'name'=>'gaofen', 'value'=>NULL); 值为NULL时表示不更新该值
     * @param mixed $oldData
     */
    protected function paramsValid($fields, $values, $oldData = array())
    {
        $result = array();

        if (empty($fields) || !is_array($fields)) {
            return $result;
        }

        foreach ($fields as $field => $cond) {
            $value = isset($values[$field]) ? $values[$field] : null;
            if ($value === null) {
                continue;
            }
            if ($this->_condValid($value, $cond)) {
                if (is_array($value)) {
                    //字段值是json只更新修改过的值
                    if (!empty($oldData[$field]) && is_array($oldData[$field])) {
                        $_saveKey = array();
                        foreach($value as $_k=>$_item) {
                            $_saveKey[] = $_k;
                        }

                        if(count($_saveKey)>1) {
                            foreach($oldData[$field] as $_k=>$_tmp) { //处理删除的计录
                                if(is_numeric($_k) && !in_array($_k, $_saveKey) ){
                                    unset($oldData[$field][$_k]);
                                }
                            }
                        }

                        //在修改数据库json值时自动合并处理现有值
                        //计出交集，得出需要更新数据
                        //$value为要更新数据
                        $mbArr = array_intersect_key($oldData[$field], $value);//计出交集

                        if(empty($value)){
                            //不做任何处理
                        }elseif ( $mbArr!=$value ) {
                            foreach($oldData[$field] as $_k=>$_item){
                                if(is_numeric($_k)) {                        
                                    foreach($value as $_i=>$_val){
                                        if(is_array($_item)) {
                                            if($_item==$_val && $_k!=$_i){
                                                unset($oldData[$field][$_k]); //删除相同数组数据
                                            }
                                        }else{
                                            if($_item===$_val && $_k!=$_i){
                                                unset($oldData[$field][$_k]); //删除相同单值数据
                                            }
                                        }
                                    }                                    
                                }
                            }
                            $value = $value + $oldData[$field];
                        } else {
                            //var_dump($value);
                            //如果$value是多条数据可判为是修改或删除当前json记录
                            if($mbArr==$value){ //没有任修改
                                $value = $oldData[$field];
                            } else{
                                $value = $value + $mbArr;//
                            }
                        }
                    }
                    ksort($value);
                    $value = json_encode($value);
                }
                $result[$field] = $value;
            } else {
                OpenApi::throwException('200001', $field . '参数值不正确！值:' . $value, $field . '参数值不符合要求');
            }
        }

        /* if(!empty($oldData)) {
             foreach($fields as $field=>$cond) {
                 if(!isset($result[$field]) && isset($oldData[$field])) {
                     $result[$field] = is_array($oldData[$field])?json_encode($oldData[$field]):$oldData[$field];
                 }
             }
         }*/

        return $result;
    }

    /**
     * 参数值验证
     *
     * @param mixed $val
     * @param $cond [require|int|string|float|number|bool|array]一个或多个组合用","分隔
     */
    private function _condValid($val, $cond)
    {
        //if(empty($val) || empty($cond) || !is_string($val) || !is_string($cond)) return false;
        $cond = explode(',', $cond);
        $final = false;
        for ($c = count($cond), $i = 0; $i < $c; $i++) {
            switch (trim($cond[$i])) {
                case 'require':
                    if (is_null($val)) {
                        return false;
                    }
                    break;

                case 'float':
                case 'double':
                case 'int':
                case 'number':
                    if ($val && !is_numeric($val) && !is_int($val) && !is_float($val) && !is_double($val)) {
                        return false;
                    }
                    break;

                case 'string':
                    if ($val && !is_string($val)) {
                        return false;
                    }
                    break;


                case 'bool':
                    if ($val && !is_bool($val)) {
                        return false;
                    }
                    break;

                case 'array':
                    if ($val && !is_array($val)) {
                        return false;
                    }
                    break;

            }
        }

        return true;
    }

    protected function getModel($modelName)
    {
        $model = 'Api_' . $modelName . 'Model';

        return new $model();
    }

    protected function cacheObj()
    {
        //return NY('Cache\Api');
        return $this->_getApiCache($this->getCfgName());
    }

    static public function getCfgName() {
        $className = explode('\\', get_called_class());
        $cfgName = isset($className[2])?$className[2]:'';
        return strtolower($cfgName);
    }

    /**
     * 更新缓存
     *
     * @param mixed $opt update|add|delete
     * @param mixed $id
     * @param mixed $oldData
     */
    protected function _setCache($opt, $id, $oldData = array(), $useAllList=false)
    {
        $opt = strtolower($opt);
        if (!in_array($opt, array('update', 'insert', 'delete'))) {
            openApi::throwException(1, '缓存更新失败', '没相关操作标识');
        }

        $listCacheKey = is_array(static::$_LIST_BY_TYPE_CACHE_KEY) ? 
           static::$_LIST_BY_TYPE_CACHE_KEY: array('created_at'=>static::$_LIST_BY_TYPE_CACHE_KEY);

        foreach($listCacheKey as $field=>$perKey) {
            //更新时，先删除旧数据
            if ($opt == 'update' && $oldData) {
                $cacheOpt = $this->_getCacheOpt($perKey, $oldData, $useAllList);
                foreach ($cacheOpt as $o) {
                    //echo '1:'.$o['kname'].$o['kvar'].':'.$id.PHP_EOL;
                    if (!$this->cacheObj()->exists($o['kname'], $o['kvar'])) {
                        continue;
                    }//list缓存不存在,就不需要往下更新缓存
                    //echo '2:'.$o['kname'].$o['kvar'].':'.$id.PHP_EOL;
                    $this->cacheObj()->zSetDel($o['kname'], $o['kvar'], $id);
                }
            }
        }

        if($opt === 'delete') {
            $data = $this->get($id);
            $this->get($id, true); //强制更新缓存
        } else {
            $data = $this->get($id, true);
        }

        foreach($listCacheKey as $field=>$perKey) {        
            $cacheOpt = $this->_getCacheOpt($perKey, $data, $useAllList);
            //缓存更新
            foreach ($cacheOpt as $o) {
                if (!$this->cacheObj()->exists($o['kname'], $o['kvar'])) {
                    continue;
                }//list缓存不存在,就不需要往下更新缓存

                if ($opt == 'delete') {
                    $this->cacheObj()->zSetDel($o['kname'], $o['kvar'], $id);
                    continue;
                }

                if ($opt == 'insert' || $opt == 'update') {
                    $zScore = (!is_numeric($data[$field]) && strtotime($data[$field])) ? strtotime($data[$field]):$data[$field];
                    $val = array('zMember' => $id, 'zScore' => $zScore);
                    $this->cacheObj()->zSetPush($o['kname'], $o['kvar'], $val);
                    continue;
                }
            }
        }

        return true;
    }

    /**
     * 生成cache配置
     *
     * 注意：生成的cache醒置 ,cond 不能为空，否则不会反回结果
     *
     * @param mixed $kname
     * @param mixed $data
     */
    protected function _getCacheOpt($kname, $data, $useAllList=false)
    {
        $cond = $this->_getTableCondition();

        //联合条件
        $unionFlag = ['key'=>'', 'cond'=>[]];
        if(!empty($cond['union'])) {
            foreach($cond['union'] as $field=>$type){
                $key = isset($data[$field]) ? ($field.':'.$data[$field]) : '';

                $unionFlag['key'] = $unionFlag['key'] ? implode(':', [$unionFlag['key'], $key]):$key;
                $unionFlag['cond'][$field] = isset($data[$field])?$data[$field]:'';
            }
        }

        //子联合条件
        $subUnionFlag = [];
        if(!empty($cond['sub_union'])) {

            $subUnionFields   = array_keys($cond['sub_union']);
            $subUnionFlag[0]['key'] = implode('::', $subUnionFields).':';
            $subUnionFlag[0]['cond'] = [];

            //subUnionFlag[0]与subUnionFlag[1] 是初始配置，所以增个偏移量生成动态配置
            $offset = 2;            
            foreach($cond['sub_union'] as $field=>$type) {
                $val = isset($data[$field]) ? $data[$field]:NULL;
                if(!isset($subUnionFlag[1])) {
                    $subUnionFlag[1] = ['key'=>'', 'cond'=>[]];
                }

                $key = $field.':'.$val;
                $subUnionFlag[1]['key'] = $subUnionFlag[1]['key'] ? implode(':', [$subUnionFlag[1]['key'], $key]):$key;
                if(!is_null($val)) {
                    $subUnionFlag[1]['cond'][$field] = $val;
                }

                foreach($subUnionFields as $index=>$_f) {
                    $index = $index+$offset;

                    if(!isset($subUnionFlag[$index])) {
                        $subUnionFlag[$index] = ['key'=>'', 'cond'=>[]];
                    }

                    $key = $field==$_f ? $field.':'.$val:$field.':';
                    $subUnionFlag[$index]['key'] = $subUnionFlag[$index]['key'] ? implode(':', [$subUnionFlag[$index]['key'], $key]):$key;
                    if(!is_null($val) && $field==$_f) {
                        $subUnionFlag[$index]['cond'][$field] = $val;
                    }
                }
            }

            //删除重复的缓存配置
            $detect = [];
            foreach($subUnionFlag as $key=>$item) {
                if(!isset($detect[$item['key']])){
                    $detect[$item['key']] = 1;
                }else{
                    unset($subUnionFlag[$key]);
                }
            }
        }

        $setOptCfg = function($field, $type, $kname, $kvar, $cond, $isList=true)use($subUnionFlag, $unionFlag) { 
            $cfg = [];

            //创建含子联合条件的配置
            if($subUnionFlag) {
                foreach($subUnionFlag as $sub) {
                    if(!empty($unionFlag['key'])) {
                        $sub['key'] = implode(':', [$unionFlag['key'], $sub['key']]);
                        $sub['cond'] = array_merge($unionFlag['cond'], $sub['cond']);
                    }

                    $cfg[] = array(
                            'field' => 'sub_union',
                            'type' => 'val',
                            'kname' => $kname,
                            'kvar' => $sub['key'],
                            'cond' => $sub['cond'],
                            'isList' => true,
                        );

                    $sub_kvar = $kvar ? implode(':', [$sub['key'], $kvar]):$sub['key'];
                    $sub_c_and_u = array_merge($sub['cond'], $cond);                    

                    $cfg[] = array(
                        'field' => $field,
                        'type' => $type,
                        'kname' => $kname,
                        'kvar' => $sub_kvar,
                        'cond' => $sub_c_and_u,
                        'isList' => $isList,
                    );
                }
            } else {
                static $haveOnlyUnionCfg = false;
                //创建只含有主联合条件的配置
                if(!empty($unionFlag['key'])) {
                    if(!$haveOnlyUnionCfg) {
                        $cfg[] = array(
                            'field' => 'union',
                            'type' => 'val',
                            'kname' => $kname,
                            'kvar' => $unionFlag['key'],
                            'cond' => $unionFlag['cond'],
                            'isList' => true,
                        );
                    }

                    $kvar = $kvar ? implode(':', [$unionFlag['key'], $kvar]):$unionFlag['key'];
                    $cond = array_merge($unionFlag['cond'], $cond);
                }

                $cfg[] = array(
                    'field' => $field,
                    'type' => $type,
                    'kname' => $kname,
                    'kvar' => $kvar,
                    'cond' => $cond,
                    'isList' => $isList,
                );
            }

            return $cfg;
        };

        $opt = [];
        //普通条件
        foreach ($cond['condition'] as $field => $type) {
            $_tmpOpt = [];

            switch ($type) {
                case 'list':
                    //按属性构建缓存KEY
                    $item = '';
                    if(isset($data[$field])) {
                        if (!is_array($data[$field])) {
                            $item = explode(',', (string)$data[$field]);
                        } else {
                            $item = $data[$field];
                        }
                    }

                    if (is_array($item)) {
                        foreach ($item as $val) {
                            $kvar = implode(':', [$field, $val]);
                            $_c = array($field => $val);
                            $_tmpOpt  = $setOptCfg($field, $type, $kname, $kvar, $_c);
                        }
                    } else {
                        $kvar = implode(':', [$field, $item]);
                        $_c = array($field => '');
                        $_tmpOpt  = $setOptCfg($field, $type, $kname, $kvar, $_c);
                    }
                    break;
                case 'val':
                    $kvar = isset($data[$field]) ? implode(':', [$field, $data[$field]]):'';
                    $_c = isset($data[$field]) ? array_merge(array($field => $data[$field])):[];
                    $_tmpOpt  = $setOptCfg($field, $type, $kname, $kvar, $_c);
                    break;
            }

            if($_tmpOpt) {
                $opt = array_merge($opt, $_tmpOpt);
            }
        }
//\F::log(var_export($cond, true));
        //过滤缓存重复或Cond为空的全表搜索配置
        $isExistOpt = [];
        foreach($opt as $key=>$item) {
            $detectKey = implode(':', [$item['kname'], $item['kvar']]);

            if(isset($isExistOpt[$detectKey]) || empty($item['cond'])) {
               unset($opt[$key]);
               continue;
            } else{
                $isExistOpt[$detectKey] = true;
            }

            //默认情况下，opt 会包含一个只含有union条件的配置，会返回所有数据，但可能数据量会超大，所做一个开关由开发人员确认是否可以开启
            if(!$useAllList) {
                if(!empty($cond['union']) && array_keys($cond['union'])==array_keys($item['cond'])){
                    unset($opt[$key]);
                }
            }
        }        
        return $opt;
    }
}
