<?php
namespace Url;

class RewriteRulesFactory
{
    use UrlDataTrait;

    /**
     * 根据生成对应的规则
     * @param  string $url
     * @return Url/RewriteRules
     */
    public function make($url, $prj='')
    {
        $className = $this->_getRules($url, $prj);
        $className = $className ? $className : 'Url\Rules\DefaultUrl';

        $rewriteRules = \DIBuilder::make($className, ['url' => $url]);

        //正式环境下，后台的URL需特殊处理
        if (\F::inEnv('product')) {
            $rewriteRules = \DIBuilder::make('Url\Rules\ProductionEnv', ['parent' => $rewriteRules]);
        }

        return $rewriteRules;
    }

    /**
     *
     * @param  [type] $url [description]
     * @param   $prj 兼容用host别名获取配置文件
     * @return [type]      [description]
     */
    protected function _getRules($url, $prj)
    {   
        if(($rewriteCfg=\CFG::rewrite_rules('map', $prj))) {
            return $rewriteCfg;
        }

        $this->parseUrl($url);
        $path = ltrim($this->path, '/');
        $paths = explode('/', $path);

        if (isset($paths[0])) {
            return \CFG::rewrite_rules('map', $paths[0]);
        }
    }
}
