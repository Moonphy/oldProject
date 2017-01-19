<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/4/15
 * Time: 上午11:46
 */

namespace ORM\CP;


use Illuminate\Database\Eloquent\Collection;
use ORM\Base;

/**
 * Class Post
 * @package ORM\CP
 */
class Post extends Base
{
    /**
     * @param $content
     */
    public function setPostContent($content)
    {
        $content = str_replace("\n<!--nextpage-->\n", '<!--nextpage-->', $content);
        $content = str_replace("\n<!--nextpage-->", '<!--nextpage-->', $content);
        $content = str_replace("<!--nextpage-->\n", '<!--nextpage-->', $content);

        $this->attributes['content'] = $content;
    }

    /**
     *
     * @return Collection
     */
    public function getRelatePostAttribute()
    {
        if (isset($this->attributes['relate_post']) && is_array($this->attributes['relate_post'])) {

            return new Collection($this->attributes['relate_post']);
        }

        return $this->attributes['relate_post'];
    }

    /**
     * @return bool|string
     */
    public function getPostDateAttribute()
    {
        $postDate = $this->attributes['post_date'];
        if (is_integer($postDate)) {

            return date('Y-m-d H:s:i', $postDate);
        }

        return $postDate;
    }

    /**
     * @return bool|string
     */
    public function getPostDayAttribute()
    {
        $postDate = $this->attributes['post_date'];
        if (is_integer($postDate)) {

            return date('Y-m-d', $postDate);
        }

        return $postDate;
    }

    /**
     * @param $value
     */
    public function setCategorysAttribute($value)
    {
        $this->attributes['categorys'] = new Collection($value);
    }

    /**
     * @return int
     */
    public function getSchoolTypeAttribute()
    {
        $url = $this->attributes['url'];

        if (str_contains($url, 'gaokao')) {

            return 1;
        }

        if (str_contains($url, 'zhongkao')) {

            return 2;
        }

        if (str_contains($url, 'xsc')) {

            return 3;
        }

        return 3;
    }


    /**
     * @return mixed
     */
    public function getIdAttribute()
    {
        return $this->attributes['ID'];
    }

    /**
     * @return bool
     */
    public function getIsHotNewsAttribute()
    {
        $flag = $this->attributes['flag'];

        return in_array(6, parse_flag($flag));
    }

}