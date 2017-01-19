<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/25
 * Time: 下午2:46
 */

date_default_timezone_set('Asia/Chongqing');

$constants = CFG::constant('const');
foreach ($constants as $consName => $consValue) {

    $consValue = replace_holder_to_value($consValue);
    define($consName, $consValue);
}

function replace_holder_to_value($consValue)
{
    preg_match_all("/{([^{|}]*)}/", $consValue, $match);

    if ($match[1]) {

        foreach ($match[1] as $place_holder) {

            if (defined($place_holder)) {

                $consValue = str_replace('{' . $place_holder . '}', constant($place_holder), $consValue);
            }
        }

    }

    return $consValue;
}


