<?php

namespace Url;

/**
 * Class Rewrite
 * @package Url
 */
class Rewrite
{
    /**
     * @var
     */
    protected $_rule;

    /**
     * @param RewriteRules $rewriteRule
     * @param $withHost
     * @return string
     */
    public function getURL(RewriteRules $rewriteRule, $withHost = '')
    {
        $rules = $rewriteRule->getRules();
        $conditions = $rewriteRule->getConditions();
        $patterns = $rewriteRule->getPatterns();

        $url = $rewriteRule->url;
        $path = strtolower($rewriteRule->path);
        $fragment = $rewriteRule->fragment;
        $query = $rewriteRule->query;

        //rules处理
        if (empty($finalUri)) {
            $finalUri = $this->matchRules($rules, $path, $query,
                ($withHost === true ? $this->getHost($rewriteRule) : $withHost));
        }

        //condition
        if (empty($finalUri)) {
            $finalUri = $this->matchCondiction($conditions, $path,
                ($withHost === true ? $this->getHost($rewriteRule) : $withHost));
        }

        //url正则匹配
        if (empty($finalUri)) {
            $finalUri = $this->matchRegx($patterns, $path,
                ($withHost === true ? $this->getHost($rewriteRule) : $withHost));
        }

        return ($finalUri ? $finalUri : $url) . $fragment;
    }

    /**
     * @param array $rules
     * @param $path
     * @param $query
     * @param $host
     * @return string
     */
    public function matchRules(array $rules, $path, $query, $host)
    {
        $finalUri = '';
        if (isset($rules[$path]) && empty($query)) {
            $finalUri = $rules[$path]['to'];
        }

        return $finalUri ? $host . $finalUri : '';
    }

    /**
     * @param array $conditions
     * @param $path
     * @param $host
     * @return string
     */
    public function matchCondiction(array $conditions, $path, $host)
    {
        $finalUri = '';
        foreach ($conditions as $__p => $data) {
            if ($__p == substr($path, 0, strlen($__p))) {
                $data = $conditions[$__p];
                $_tmpParams = isset($data['params'])?$data['params']:[];
                preg_match_all('#{([a-z0-9_|\:]+)}#sim', $data['to'], $matches);
                if (isset($matches[1]) && is_array($matches[1]) && isset($data['params']) && is_array($data['params'])) {
                    foreach ($matches[1] as $_m) {
                        if (isset($data['params'][$_m])) {
                            $data['to'] = str_replace('{' . $_m . '}', $data['params'][$_m], $data['to']);
                            unset($_tmpParams[$_m]);
                        } else {
                            $_m_2 = explode('|', $_m);
                            if (count($_m_2) >= 2) {
                                $data['to'] = str_replace('{' . $_m . '}',
                                    !empty($data['params'][$_m_2[0]]) ? $data['params'][$_m_2[0]] : $_m_2[1],
                                    $data['to']);
                                unset($_tmpParams[$_m_2[0]]);
                            }
                        }
                    }
                }
                $finalUri = str_replace('{:params:}', http_build_query($_tmpParams), $data['to']);
                break;
            }
        }

        return $finalUri ? $host . $finalUri : '';
    }

    /**
     * @param array $patterns
     * @param $path
     * @param $host
     * @return string
     */
    public function matchRegx(array $patterns, $path, $host)
    {
        $finalUri = '';
        //url正则匹配
        foreach ($patterns as $__p => $data) {
            $_tmpParams = isset($data['params'])?$data['params']:[];
            if (($topath = preg_replace("#$__p#sim", $data['to'], $path)) != $path) {
                preg_match_all('#{([a-z0-9_|\:]+)}#sim', $topath, $matches);
                if (isset($matches[1]) && is_array($matches[1]) && isset($data['params']) && is_array($data['params'])) {
                    foreach ($matches[1] as $_m) {
                        if (isset($data['params'][$_m])) {
                            $topath = str_replace('{' . $_m . '}', $data['params'][$_m], $topath);
                            unset($_tmpParams[$_m]);
                        } else {
                            $_m_2 = explode('|', $_m);
                            if (count($_m_2) >= 2) {
                                $data['to'] = str_replace('{' . $_m . '}',
                                    !empty($data['params'][$_m_2[0]]) ? $data['params'][$_m_2[0]] : $_m_2[1],
                                    $data['to']);
                                unset($_tmpParams[$_m_2[0]]);
                            }
                        }
                    }
                }
                $topath = str_replace('{:params:}', http_build_query($_tmpParams), $topath);
                $finalUri = $topath;
                break;
            }
        }

        return $finalUri ? $host . $finalUri : '';
    }

    /**
     * 获取rewriteurl host
     * @param  RewriteRules $rewriteRule [description]
     * @return string [type]                    [description]
     */
    private function getHost(RewriteRules $rewriteRule)
    {
        $scheme = $rewriteRule->scheme;
        $host = $rewriteRule->host;

        return $scheme . '://' . $host;
    }
}