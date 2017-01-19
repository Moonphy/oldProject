<?php

if (!defined('IN_ANWSION')) {
    exit();
}

class main extends AWS_CONTROLLER {
    public function get_access_rule() {
        $rule_action['rule_type'] = 'white';
        $rule_action['actions'] = array(
                'question',
                'article',
                );
        return $rule_action;
    }

    public function index_action() {
        echo 'success';
    }

    public function article_action() {
        if (empty($_POST['__sign'])) {
            exit('403');
        }
        if (file_exists(AWS_PATH . '/config/sjs_article.php')) {
            require AWS_PATH . '/config/sjs_article.php';
        }
        if (isset($config['sjs_article'])) {
            $sjs_config = $config['sjs_article'];
        }
        else {
            $sjs_config = array(
                    'article_title' => 'title',
                    'article_content' => 'content',
                    'article_author' => 'author',
                    'article_time' => 'publish_time',
                    'article_topics' => 'topics',
                    'article_categories' => 'categories',
                    'article_author_config' => 1,
                    'article_author_user' => '',
                    'article_category_config' => 1,
                    'article_category' => '',
                    );
        }
        $title = $_POST[$sjs_config['article_title']];
        $content = $_POST[$sjs_config['article_content']];
        if (empty($title) || empty($content)) {
            exit('Cannot find title or content, please check config');
        }
        if ($sjs_config['article_author_config'] == 1) {
            $author = $_POST[$sjs_config['article_author']];
        }
        else if ($sjs_config['article_author_config'] == 2) {
            $author = $sjs_config['article_author_user'];
        }
        if (empty($author)) {
            exit('No author to use, please check config');
        }
        $user = $this->model('account')->get_user_info_by_username($author);
        if (!empty($user)) {
            $user_id = $user['uid'];
        }
        else {
            $user_id = $this->model('account')->insert_user($author, '123456');
        }
        if (empty($user_id)) {
            exit('Empty user_id');
        }
        $category_id = 1;
        if ($sjs_config['article_category_config'] == 1) {
            $categories = $_POST[$sjs_config['article_categories']];
            $categories = json_decode($categories, true);
            $category_id = 1;//默认分类
            $cate_parent_id = 0;
            $count = count($categories);
            $i = 0;
            for ($i = 0;$i <$count; $i++) {
                $category_title = $categories[$i];
                $cate = $this->model('category')->fetch_row('category', "title='{$category_title}' and parent_id={$cate_parent_id}");
                if (!empty($cate)) {
                    $category_id = $cate['id'];
                    $cate_parent_id = $cate['id'];
                }
                else {
                    break;
                }
            }
            for (; $i < $count; $i++) {
                $category_title = $categories[$i];
                $category_id = $this->model('category')->add_category('question', $category_title, $cate_parent_id);
                if (empty($category_id)) break;
                $cate_parent_id = $category_id;
            }
        }
        else if($sjs_config['article_category_config'] == 2) {
            if (is_int($sjs_config['article_category'])) {
                $category_info = $this->model('system')->get_category_info($sjs_config['article_category']);
            }
            else {
                $category_info = $this->model('system')->get_category_info_by_url_token($sjs_config['article_category']);
            }
            if (!empty($category_info['id'])) {
                $category_id = $category_info['id'];
            }
        }
        $topics = $_POST[$sjs_config['article_topics']];
        $topics = json_decode($topics, true);
        foreach ($topics as $key => $topic) {
            if ($topic == '站长之家首页') {
                $topics[$key] = '微学院';
            }
        }
        $article_id = $this->model('publish')->publish_article($this->parse_html($title), $this->parse_html($content), $user_id, $topics, $category_id);
        if (empty($article_id)) {
            exit('Failed to publish article');
        }
        $publish_time = $_POST[$sjs_config['article_time']];
        if (!empty($publish_time)) {
        		if(is_numeric($publish_time)){
        			$add_time = intval($publish_time);
        		}else{
            	$add_time = strtotime($publish_time);
            	$add_time = intval($add_time);
            }
            if (!empty($add_time)) {
                $this->model('article')->update('article', array('add_time'=>$add_time), "id={$article_id}");
            }
        }
        echo "true";
    }

    public function question_action() {
        if (empty($_POST['__sign'])) {
            exit('403');
        }
        if (file_exists(AWS_PATH . '/config/sjs_question.php')) {
            require AWS_PATH . '/config/sjs_question.php';
        }
        if (isset($config['sjs_question'])) {
            $sjs_config = $config['sjs_question'];
        }
        else {
            $sjs_config = array(
                    'question' => 'question',
                    'question_author' => 'question_author',
                    'question_detail' => 'question_detail',
                    'question_avatar' => 'question_avatar',
                    'question_time' => 'question_time',
                    'question_categories' => 'question_categories',
                    'topics' => 'topics',
                    'answers' => 'answers',
                    'content' => 'content',
                    'author' => 'author',
                    'avatar' => 'avatar',
                    'comments' => 'comments',
                    'agree_count' => 'agree_count',
                    'publish_time' => 'publish_time',
                    'use_authors' => false,
                    'use_topics' => false,
                    'use_pubtime' => true,
				            'use_avatar' => false,
				            'use_comments' => false,
				            'custome_category_config' => 1,
            				'custome_category' => '',
				            'bind_task_id' => 0,
                    );
        }
        $question = $_POST[$sjs_config['question']];
        if (empty($question)) {
            exit('Cannot find question, please check config');
        }
        $question_author = $_POST[$sjs_config['question_author']];
        $question_detail = $_POST[$sjs_config['question_detail']];
        $question_avatar = $_POST[$sjs_config['question_avatar']];
        $question_time = $_POST[$sjs_config['question_time']];
        
        $topics = $_POST[$sjs_config['topics']];
        $topics = json_decode($topics);
        $answers = $_POST[$sjs_config['answers']];
        $answers = preg_replace("/[\r\n\t]/", '', $answers);
        $answers = json_decode($answers, true);
        $content_key = $sjs_config['content'];
        $author_key = $sjs_config['author'];
        $avatar_key = $sjs_config['avatar'];
        $comments_key = $sjs_config['comments'];
        
        $publish_time_key = $sjs_config['publish_time'];
        $agree_count_key = $sjs_config['agree_count'];
        $user_id = 0; $anonymous = 1;
        
        if ($sjs_config['use_authors'] && !empty($question_author)) {
            $user = $this->model('account')->get_user_info_by_username($question_author);
            if (!empty($user)) {
                $user_id = $user['uid'];
                $anonymous = 0;
            }
            else {
                $user_id = $this->model('account')->insert_user($question_author, '123456');
                if (!empty($user_id)) {
                    $anonymous = 0;
                }
                
            }
            if($sjs_config['use_avatars'] && !empty($question_avatar) && $anonymous == 0){
            	$this->get_user_avatar($user_id,$question_avatar);
           	}
        }
        //insert question
        
        $question_id = $this->model('question')->save_question($this->parse_html($question), $this->parse_html($question_detail), $user_id, $anonymous);
        if (empty($question_id)) {
            exit("Failed to save question");
        }
        $category_id = intval($sjs_config["custome_category"]);
        if($sjs_config["custome_category_config"] == 2 && $category_id){
					$this->model('question')->update('question', array(
						'category_id' => intval($category_id)
					), 'question_id = ' . intval($question_id));
        }
        
        
        
        //insert topics
        if ($sjs_config['use_topics']) {
            foreach ($topics as $topic) {
                $topic_id = $this->model('topic')->save_topic($topic);
                if (!empty($topic_id)) {
                    $this->model('topic')->save_topic_relation(0, $topic_id, $question_id, 'question');
                }
            }
        }
        //insert answers
        $last_answer = 0;
        $count = count($answers);
        $table = $this->model('question')->get_table('question');
        $first_answer_time = 0;
        
        for ($i = 0; $i < $count; $i++) {
            $answer = $answers[$i];
            $user_id = 0; $anonymous = 1;
            if ($sjs_config['use_authors']) {
                $author = $answer[$author_key];
                $avatar = $answer[$avatar_key];
                
                if (strstr($author, "知乎") === false &&
                        strstr($author, "匿名") === false) {
                    $user = $this->model('account')->get_user_info_by_username($author);
                    if (!empty($user)) {
                        $user_id = $user['uid'];
                        $anonymous = 0;
                    }else {
                        $user_id = $this->model('account')->insert_user($author, '123456');
                        if (!empty($user_id)) {
                            $anonymous = 0;
                        }
                    }
                    
                    if($sjs_config['use_avatars'] && !empty($avatar) && $anonymous == 0){
                    	$this->get_user_avatar($user_id,$avatar);
				           	}
                }
            }
            
            $answer_id = $this->model('answer')->save_answer($question_id, $this->parse_html($answer[$content_key]), $user_id, $anonymous);
            if (!empty($answer_id)) {
            	
                $agree_count = intval($answer[$agree_count_key]);
                $publish_time = intval($answer[$publish_time_key]);
                $update_args = array('agree_count'=>$agree_count);
                
                if($sjs_config['use_pubtime'] && !empty($publish_time)){
                	$update_args['add_time'] = $publish_time;
                	if($first_answer_time==0 || $first_answer_time > $publish_time){
                		$first_answer_time = $publish_time;
                	}
								}
								$this->model('answer')->update_answer_by_id($answer_id, $update_args);
                $last_answer = $answer_id;
                
                if($sjs_config['use_comments']){
		            	$comments = $answer[$comments_key];
		            	$comments_count = count($comments);
		            	for ($j = 0; $j < $comments_count; $j++) {
		            		$comment = $comments[$j];
		            		$cuser_id = 0; $canonymous = TRUE;
		            		if ($sjs_config['use_authors']) {
			                $cauthor = $comment[$author_key];
			                $cavatar = $comment[$avatar_key];
			                
			                if (strstr($cauthor, "知乎") === false &&
			                        strstr($cauthor, "匿名") === false) {
		                    $cuser = $this->model('account')->get_user_info_by_username($cauthor);
		                    if (!empty($cuser)) {
		                        $cuser_id = $cuser['uid'];
		                        $canonymous = FALSE;
		                    }
		                    else {
		                        $cuser_id = $this->model('account')->insert_user($cauthor, '123456');
		                        if (!empty($cuser_id)) {
		                            $canonymous = FALSE;
		                        }
		                    }
		                    if($sjs_config['use_avatars'] && !empty($cavatar) && !$canonymous){
		                    	$this->get_user_avatar($cuser_id,$cavatar);
						           	}
			                }
				            }
				            
				            //TODO 匿名用户评论的用户名生成机制
				            if(!$canonymous){
					            $comment_id = $this->model('answer')->insert_answer_comment($answer_id,$cuser_id,$this->parse_html($comment[$content_key]));
					            if(!empty($comment_id)){
						            $cpublish_time = intval($comment[$publish_time_key]);
						            if($sjs_config['use_pubtime'] && !empty($cpublish_time)){
						            	$this->model('answer')->shutdown_update('answer_comments', array(
														'time' => intval($cpublish_time)
													), "id = " . intval($comment_id));
						            }
						          }
				            }
		            	}
		            }
            }
            
            $this->model('question')->shutdown_query(
                    "UPDATE {$table} SET view_count=view_count+1 WHERE question_id={$question_id}");
        		
        }
        
        if($first_answer_time > 0 && (empty($question_time) || $question_time > $first_answer_time)){
        	//修复答案时间早于问题时间
        	$question_time = $first_answer_time - 60;//60秒前
        }
        
        if($sjs_config['use_pubtime'] && !empty($question_time)){
        	$this->model('question')->update('question', 
        																	array('add_time' => intval($question_time), 'update_time' => intval($question_time)), 
        																	'question_id = ' . intval($question_id));
				}
        
        $this->model('question')->save_last_answer($question_id, $last_answer);
        $this->model('posts')->set_posts_index($question_id, 'question');
        echo "true";
    }

    private function parse_html($text) {
        $recursive_tags = array(
                //'#\s*?<div(( .*?)?)>(.*?)</div>\s*?#si' => '\\3',
                //'#<span(( .*?)?)>(.*?)</span>#si' => '\\3',
                '#<ul(( .*?)?)>(.*?)</ul>#si' => '[list]\\3[/list]',
                '#<ol(( .*?)?)>(.*?)</ol>#si' => '[list=1]\\3[/list]',
                //'#<font(.*?)>(.*?)</font>#si' => '\\2',
                );
        $tags = array(
                '#\s*?<strong>(.*?)</strong>\s*?#si' => '[b]\\1[/b]',
                '#<b(( .*?)?)>(.*?)</b>#si' => '[b]\\3[/b]',
                '#<em(( .*?)?)>(.*?)</em>#si' => '[i]\\3[/i]',
                '#<i(( .*?)?)>(.*?)</i>#si' => '[i]\\3[/i]',
                '#<u(( .*?)?)>(.*?)</u>#si' => '[u]\\3[/u]',
                '#<s(( .*?)?)>(.*?)</s>#si' => '[s]\\3[/s]',
                //'#<small(.*?)>(.*?)</small>#si' => '\\2',
                //'#<big(.*?)>(.*?)</big>#si' => '\\2',
                '#<img (.*?)src="(.*?)"(.*?)>#si' => "[img]\\2[/img]\n",
                '#<a (.*?)href="(.*?)"(.*?)>(.*?)</a>#si' => '[url=\\2]\\4[/url]',
                '#<a href="mailto:"(.*?)" title="Email (.*?)">(.*?)</a>#si' => '[email]\\1[/email]',
                '#<code(( .*?)?)>(.*?)</code>#si' => '[code]\\3[/code]',
                '#<iframe style="(.*?)" id="ytplayer" type="text/html" width="534" height="401" src="(.*?)/embed/(.*?)" frameborder="0"/></iframe>#si' => '[youtube]\\3[/youtube]',
                '#\s*?<br(.*?)>\s*?#si' => "\n",
                '#<h2(( .*?)?)>(.*?)</h2>#si' => '[h1]\\3[/h1]',
                '#<h3(( .*?)?)>(.*?)</h3>#si' => '[h2]\\3[/h2]',
                '#<h4(( .*?)?)>(.*?)</h4>#si' => '[h3]\\3[/h3]',
                '#<li(( .*?)?)>(.*?)</li>#si' => '[*]\\3[/*]',
                '#<center(( .*?)?)>(.*?)</center>#si' => '[center]\\3[/center]',
                //'#<p(( .*?)?)>(.*?)</p>#si' => '\\3',
                '#<blockquote(( .*?)?)>(.*?)</blockquote>#si' => '[quote]\\3[/quote]',
                //'#<pre>(.*?)</pre>#si' => '\\1',
                '#<noscript(( .*?)?)>(.*?)</noscript>#si' => '\\3',
                '#<object(.*?)>.*?<param .*?name="movie"[^<]*?value="(.*?)".*?(></param>|/>|>).*?</object>#si' => '[video]\\2[/video]',
                '#<object(.*?)>.*?<param .*?value="(.*?)"[^<]*?name="movie".*?(></param>|/>|>).*?</object>#si' => '[video]\\2[/video]',
                '#<embed (.*?)src="([^<]*?)"[^<]*?flashvars="([^<]*?)"([^<]*?)(></embed>|/>|>)#si' => '[video]\\2?\\3[/video]',
                '#<embed (.*?)src="([^<]*?)"([^<]*?)(></embed>|/>|>)#si' => '[video]\\2[/video]',
                );
        foreach ($recursive_tags as $search => $replace) {
            $text2 = $text;
            do {
                $text = $text2;
                $text2 = preg_replace($search, $replace, $text);
            } while($text2 != $text);
        }
        foreach ($tags as $search => $replace) {
            $text = preg_replace($search, $replace, $text);
        }
        
        $html = $this->decode_html($text);
        return strip_tags($html);
    }
    private function decode_html($text){
    	$text2 = $text;
      do {
          $text = $text2;
          $text2 = html_entity_decode($text,ENT_COMPAT,"UTF-8");
      } while($text2 != $text);
			 return $text;
    }
    
    function get_user_avatar($user_id, $avatar){
    	$result = $this->curl_headers($avatar);
    	if($result !== False && strpos($result,"302 Moved Temporarily")){
    		$headers = preg_split("/\r\n+/",$result);
    		if(is_array($headers)){
    			$imgloc = null;
    			foreach($headers as $header){
    				$header = trim($header);
    				$locpos = stripos($header,"location");
    				if($locpos === 0){
    						$pp = strpos($header,":");
    						$imgloc = trim(substr($header,$pp+1));
    				}
    			}
    			if(!empty($imgloc) && stripos($imgloc,"http") === 0){
   	 				$ret = $this->model('account')->associate_remote_avatar($user_id, $imgloc);
   	 			}
   	 			
   	 		}
   	 	}
    }
    
    function curl_headers($url){
		  // 初始化Curl
		  $ch = curl_init();
		  // 开启header显示
		  curl_setopt($ch, CURLOPT_HEADER, true);
		  // 不输出网页内容
		  curl_setopt($ch, CURLOPT_NOBODY, true);
		  // 禁止自动输出内容
		  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		  // 自动跳转
		  curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
		  // 跳转时自动设置来源地址
		  curl_setopt($ch, CURLOPT_AUTOREFERER, true);
		  // 超时时间
		  curl_setopt($ch, CURLOPT_TIMEOUT, 60);
		  // 设置URL
		  curl_setopt($ch, CURLOPT_URL, $url);
		  // 关闭SSL证书验证
		  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		  // 返回结果
		  return curl_exec($ch);
		}
}
