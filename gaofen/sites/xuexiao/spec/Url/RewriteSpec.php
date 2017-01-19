<?php

namespace spec\Url;

use Url\Rules\CpUrl;
use Url\Rules\CzUrl;
use Url\Rules\Czweixin;
use PhpSpec\ObjectBehavior;
use Prophecy\Argument;
use Url\Rules\MobileUrl;

class RewriteSpec extends ObjectBehavior
{
    public function it_is_initializable()
    {
        $this->shouldHaveType('Url\Rewrite');
    }

    public function it_should_return_correct_middle_school_rewrite_url()
    {
        $rules = [
            // 首页
            '/Cz/School/index' => '/chuzhong/list.html',
            // 详细页
            '/Cz/School/view?id=310' => '/chuzhong/310.html',
            // 搜索
            '/cz/school/index?q=test' => '/chuzhong/list/keyword-test.html',
            // 筛选
            '/cz/school/index?district=3045&property=0&attype=0' => '/chuzhong/list-q3045p0a0.html',
            '/cz/school/index?district=30&property=3&attype=4' => '/chuzhong/list-q30p3a4.html',
            '/cz/school/index?property=2&attype=3&district=1' => '/chuzhong/list-q1p2a3.html',
            //学校实力
            '/Cz/School/view?id=310&type=1' => '/chuzhong/shili_310.html',
            //学生生活
            '/Cz/School/view?id=310&type=3' => '/chuzhong/shenghuo_310.html',
            //学校要闻
            '/Cz/School/view?id=310&type=4' => '/chuzhong/zixun_310.html',
            //资料推荐
            '/Cz/School/view?type=5&id=310' => '/chuzhong/ziliao_310.html',
            //招生信息
            '/Cz/School/view?id=310&type=2' => '/chuzhong/310.html',
            '/Cz/School/view?id=310&type=9' => '/chuzhong/310.html',
            '/Cz/School/view?id=310&type=10' => '/chuzhong/310.html',
            // 对比页
            '/cz/school/cmp?ids=1,2,3,4,5,6,7' => '/chuzhong/duibi_1_2_3_4_5_6_7.html',
            // 民校推荐
            '/cz/school/guide?type=1&step=1' => '/chuzhong/shengxue/?type=1&step=1',
            // 特长生招生
            '/cz/school/guide?type=2&step=1' => '/chuzhong/shengxue/?type=2&step=1',
        ];

        foreach ($rules as $from => $expected) {
            $urlRules = new CzUrl($from);

            $this->getURL($urlRules)->shouldEqual($expected);
        }
    }

    public function it_should_return_correct_middle_school_weixin_rewrite_url()
    {
        $rules = [
            '/czweixin/school/view?id=310' => '/xuexiao/chuzhong-310.html',
        ];

        foreach ($rules as $from => $expected) {
            $urlRules = new Czweixin($from);

            $this->getURL($urlRules)->shouldEqual($expected);
        }
    }

    /**
     * 在product环境下返回/chuzhong前缀的uri
     */
    public function it_should_return_chuzhong_prefix_on_production_env()
    {
        \F::setEnv('product');
        $urlRules = \DIBuilder::singleton('Url\RewriteRulesFactory')->make('/czadmin/school/edit?id=1');

        $this->getURL($urlRules)->shouldReturn('/chuzhong/czadmin/school/edit?id=1');

        $urlRules = \DIBuilder::singleton('Url\RewriteRulesFactory')->make('/gzadmin/school/edit?id=1');
        $this->getURL($urlRules)->shouldReturn('/chuzhong/gzadmin/school/edit?id=1');
    }

    public function it_should_return_correct_cp_rewrite_url()
    {

        $rules = [
            '/cp/mobile/index?school_type=1' => '/list/gaokao',
            '/cp/mobile/index?school_type=2' => '/list/zhongkao',
            '/cp/mobile/index?school_type=3' => '/list/xsc',
            '/cp/mobile/index?school_type=gaokao' => '/list/gaokao',
            '/cp/mobile/index?school_type=zhongkao' => '/list/zhongkao',
            '/cp/mobile/index?school_type=xsc' => '/list/xsc',

            '/cp/mobile/list?school_type=1' => '/list/listgaokao',
            '/cp/mobile/list?school_type=2' => '/list/listzhongkao',
            '/cp/mobile/list?school_type=3' => '/list/listxsc',
            '/cp/mobile/list?school_type=gaokao&page=2' => '/list/listgaokao2',
            '/cp/mobile/list?school_type=zhongkao&page=3' => '/list/listzhongkao3',
            '/cp/mobile/list?school_type=xsc&page=5' => '/list/listxsc5',

            '/cp/mobile/view?id=1421' => '/article/1421.htm',
            '/cp/mobile/view?id=1421&page=1' => '/article/1421-1.htm',
            '/cp/mobile/view?id=1421&page=2' => '/article/1421-2.htm',
        ];

        foreach ($rules as $from => $expected) {
            $urlRules = new CpUrl($from, schoolType());

            $this->getURL($urlRules)->shouldEqual($expected);
        }

    }

    public function it_should_return_mobile_index_url()
    {
        $rules = [
            '/mobile/index' => '/',
            '/mobile/index?school_type=1' => '/',
            '/mobile/index?school_type=2' => '/',
            '/mobile/index?school_type=3' => '/',
        ];

        foreach ($rules as $from => $expected) {
            $urlRules = new MobileUrl($from);

            $this->getURL($urlRules)->shouldEqual($expected);
        }

    }
}
