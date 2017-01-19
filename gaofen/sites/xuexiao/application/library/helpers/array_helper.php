<?php

/**
 * 重新指定子的键, 如果子元素内没有key或值为空，该元素会被抛弃
 * @param  array $arr
 * @param  string $key
 * @return array
 *
 * 原数组 [0 => [ 'id' => 100, 'name' => a ],
 *        1 => [ 'id' => 200, 'name' => b ],
 *        2 => [ 'name' => c ],]
 *
 * array_reset_key($arr, 'id')
 *
 * 输出 [ 100 => [ 'id' => 100, 'name' => a ],
 *         200 => [ 'id' => 200, 'name' => b ], ]
 */
function array_reset_key(array $arr, $key)
{
    $newArr = array();
    foreach ($arr as $index => $child) {
        if (is_array($child) && isset($child[$key])) {
            $newArr[$child[$key]] = $child;
        }
    }

    return $newArr;
}

/**
 * 传入一个二维数组， 返回由该数组的子元素中指定key => value的新数组
 * @param  array $arr
 * @param  string $key
 * @param  string $value
 * @return array
 *
 * 原数组 [0 => [ 'id' => 100, 'name' => a ],
 *        1 => [ 'id' => 200, 'name' => b ],
 *        2 => [ 'name' => c ],]
 *
 * array_list($arr, 'name', 'id');
 * 输出: [a => 100, b => 200]
 */
function array_list(array $arr, $key, $value)
{
    $newArr = array();
    foreach ($arr as $index => $child) {
        if (is_array($child)
            && isset($child[$key])
            && !is_null($child[$key])
            && isset($child[$value])
            && !is_null($child[$value])
        ) {
            $newArr[$child[$key]] = $child[$value];
        }
    }

    return $newArr;
}

/**
 * 获取二维数组中特定key中的所有值
 * @param  array $arr
 * @param  string $key
 * @return
 */
function array_fetch_values(array $arr, $key)
{
    $values = array();

    foreach ($arr as $index => $child) {
        if (is_array($child)
            && isset($child[$key])
            && !is_null($child[$key])
        ) {
            $values[$index] = $child[$key];
        }
    }

    return $values;
}

/**
 * 获取二维数组中，某个key复合条件的值
 * @param  array $arr
 * @param  string $key 需要匹配的key
 * @param  值 $values   需要匹配的值
 * @return array         [description]
 */
function array_fetch_by_values(array $arr, $key, $values)
{
    $match = array();

    foreach ($arr as $index => $valueArr) {
        if (isset($valueArr[$key]) && $valueArr[$key] == $values) {
            $match[$index] = $valueArr;
        }
    }

    return $match;
}


/**
 * 根据相同的key, 把二维数组arr2合并到二维数组arr1中
 * @param  array $arr1
 * @param  array $arr2
 * @return array
 */
function array_merge_into(array $arr1, array $arr2, $nickname = 'child')
{
    foreach ($arr1 as $key => $value) {
        if (!isset($arr2[$key])) {
            continue;
        }
        $arr1[$key][$nickname] = (array)$arr2[$key];
    }

    return $arr1;
}

/**
 * 返回arr2中以arr1为key的值
 * @param  [type] $arr1 [description]
 * @param  [type] $arr2 [description]
 * @return array
 */
function array_exists_fetch($arr1, $arr2)
{
    $intersect = array_intersect($arr1, array_keys($arr2));

    $return = array();
    foreach ($intersect as $_key) {
        $return[$_key] = $arr2[$_key];
    }

    return $return;
}

/**
 * 把二维数组的子元素转换成指定ORM对象
 * @param  array $arr
 * @param  string $className ORM方法名
 * @return array
 */
function sub_array_to_orm(array $arr, $className)
{
    $newArr = array();
    foreach ($arr as $index => $subArray) {
        $newArr[$index] = new $className($subArray);
    }

    return $newArr;
}

//通过flag值获取flag数组
function parse_flag($flag)
{
    $flag = intval($flag);
    $flags = array();
    for ($i = 1; $i <= 20; $i++) {
        $k = pow(2, $i - 1);

        if ($flag & $k) {
            $flags[] = $i;
        }
    }

    return $flags;
}
