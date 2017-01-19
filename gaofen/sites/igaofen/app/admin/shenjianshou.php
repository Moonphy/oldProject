<?php

class shenjianshou extends AWS_ADMIN_CONTROLLER {
		private $sjs_server = "http://www.shenjianshou.cn";
		private $sjs_version = "1.2.5";
	
    private $question_config_file;
    private $article_config_file;
    private $account_config_file;
    
    private $question_config = array(
    				//对应
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
            'publish_time' => 'publish_time',
            'agree_count' => 'agree_count',
            //设置
            'use_authors' => false,
            'use_topics' => false,
            'use_pubtime' => true,
            'use_avatars' => false,
            'use_comments' => false,
            
            'custome_category_config' => 1,
            'custome_category' => '',
            
            
            'bind_task_id' => 0,
            );
    private $article_config = array(
    				//对应
            'article_title' => 'title',
            'article_content' => 'content',
            'article_author' => 'author',
            'article_time' => 'publish_time',
            'article_topics' => 'topics',
            'article_categories' => 'categories',
            //设置
            'article_author_config' => 1,
            'article_author_user' => '',
            'article_category_config' => 1,
            'article_category' => '',
            'bind_task_id' => 0,
            );
	
		private $account_config = array(
						'username' => '',
						'password' => '',
						);

    public function __construct() {
        parent::__construct();
        $this->question_config_file = AWS_PATH . '/config/sjs_question.php';
        $this->article_config_file = AWS_PATH . '/config/sjs_article.php';
        $this->account_config_file = AWS_PATH . '/config/sjs_account.php';
        if(defined("__SJS_DEBUG__")){
        	$this->sjs_server = "http://192.168.31.11";
    		}
    }

    public function index_action() {
        $this->question_action();
    }

    public function question_action() {
        if (file_exists($this->question_config_file)) {
            require $this->question_config_file;
        }
        
        $this->crumb(AWS_APP::lang()->_t('神箭手'), 'admin/shenjianshou/question/');
        TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(901));

        if (isset($config['sjs_question'])) {
            $sjs_config = $config['sjs_question'];
        }
        else {
            $sjs_config = $this->question_config;
        }
        
        if (file_exists($this->account_config_file)) {
          require $this->account_config_file;
          if (isset($config['sjs_account'])) {
        		$username = $config['sjs_account']['username'];
        		$password = $config['sjs_account']['password'];
            $json = file_get_contents($this->sjs_server."/index.php?r=api/tasks&u={$username}&p={$password}&cms=wecenter");
			      $ret = json_decode($json,true);
			      if($ret["result"] === 0){
			      	//成功
			      	TPL::assign('sjs_tasks', $ret["data"]);
			      }
      		}
        }
        TPL::assign('sjs_version', $this->sjs_version);
        TPL::assign('sjs_config', $sjs_config);
        //查询分类
				TPL::assign('categories',$this->model('category')->fetch_all("category"));
				
        TPL::output('admin/shenjianshou/question');
    }

    public function article_action() {
        if (file_exists($this->article_config_file)) {
            require $this->article_config_file;
        }
        $this->crumb(AWS_APP::lang()->_t('神箭手'), 'admin/shenjianshou/article/');
        TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(902));

        if (isset($config['sjs_article'])) {
            $sjs_config = $config['sjs_article'];
        }
        else {
            $sjs_config = $this->article_config;
        }
        
        if (file_exists($this->account_config_file)) {
          require $this->account_config_file;
          if (isset($config['sjs_account'])) {
        		$username = $config['sjs_account']['username'];
        		$password = $config['sjs_account']['password'];
            $json = file_get_contents($this->sjs_server."/index.php?r=api/tasks&u={$username}&p={$password}&cms=wecenter");
			      $ret = json_decode($json,true);
			      if($ret["result"] === 0){
			      	//成功
			      	TPL::assign('sjs_tasks', $ret["data"]);
			      }
      		}
        }
        TPL::assign('sjs_version', $this->sjs_version);
        TPL::assign('sjs_config', $sjs_config);
        
        //查询分类
				TPL::assign('categories',$this->model('category')->fetch_all("category"));
				
				
				
        TPL::output('admin/shenjianshou/article');
    }

		public function account_action(){
				if (file_exists($this->account_config_file)) {
            require $this->account_config_file;
        }
        $this->crumb(AWS_APP::lang()->_t('神箭手'), 'admin/shenjianshou/account/');
        TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(903));
        
        if (isset($config['sjs_account'])) {
            $sjs_config = $config['sjs_account'];
        }
        else {
            $sjs_config = $this->article_config;
        }
        TPL::assign('sjs_config', $sjs_config);
				TPL::assign('sjs_version', $this->sjs_version);
				
        TPL::output('admin/shenjianshou/account');
		}


    private function _value($value, $default) {
        if (empty($value)) return $default;
        return $value;
    }

    public function ajax_question_action() {
        $question = $this->_value($_POST['question'], $this->question_config['question']);
        $question_author = $this->_value($_POST['question_author'], $this->question_config['question_author']);
        $question_detail = $this->_value($_POST['question_detail'], $this->question_config['question_detail']);
        $question_avatar = $this->_value($_POST['question_avatar'], $this->question_config['question_avatar']);
        $question_time = $this->_value($_POST['question_time'], $this->question_config['question_time']);
        
        $topics = $this->_value($_POST['topics'], $this->question_config['topics']);
        $answers = $this->_value($_POST['answers'], $this->question_config['answers']);
        $content = $this->_value($_POST['content'], $this->question_config['content']);
        $author = $this->_value($_POST['author'], $this->question_config['author']);
        $avatar = $this->_value($_POST['avatar'], $this->question_config['avatar']);
        $comments = $this->_value($_POST['comments'], $this->question_config['comments']);
        $publish_time = $this->_value($_POST['publish_time'], $this->question_config['publish_time']);
        
        $agree_count = $this->_value($_POST['agree_count'], $this->question_config['agree_count']);
        $use_authors = empty($_POST['user_config']) ? "false" : "true";
        $use_topics = empty($_POST['topic_config']) ? "false" : "true";
        
        $use_pubtime = empty($_POST['pubtime_config']) ? "false" : "true";
        $use_avatars = empty($_POST['avatar_config']) ? "false" : "true";
        $use_comments = empty($_POST['comments_config']) ? "false" : "true";
        
        $custome_category_config = $this->_value($_POST['custome_category_config'], $this->question_config['custome_category_config']);
        $custome_category = $this->_value($_POST['custome_category'], $this->question_config['custome_category']);
        
        $bind_task_id = $this->_value($_POST['bind_task_id'], $this->question_config['bind_task_id']);
        
        
        
        if (isset($_POST['bind_task_id']) && file_exists($this->account_config_file)) {
          require $this->account_config_file;
          if (isset($config['sjs_account'])) {
        		$username = $config['sjs_account']['username'];
        		$password = $config['sjs_account']['password'];
            $url = $this->sjs_server."/index.php?r=api/bind&u={$username}&p={$password}&tid=".intval($_POST['bind_task_id']);
	        	$callback = base_url()."/".G_INDEX_SCRIPT."shenjianshou/question/";
	        	$url .= "&c=".urlencode($callback);
	        	
	        	$json = file_get_contents($url);
			      $ret = json_decode($json,true);
			      if($ret["result"] !== 0){
			      	//失败
			      	H::ajax_json_output(AWS_APP::RSM(null, -1, AWS_APP::lang()->_t("绑定任务失败：".$ret["data"])));
			      	exit();
			      }
      		}
        }
        
        
        $code = <<<config_code
<?php
/**
 * 神箭手问答配置文件
 */
\$config['sjs_question'] = array(
    'question' => '{$question}',
    'question_author' => '{$question_author}',
    'question_detail' => '{$question_detail}',
    'question_avatar' => '{$question_avatar}',
    'question_time' => '{$question_time}',
    'question_categories' => '{$question_categories}',
    
    'topics' => '{$topics}',
    'content' => '{$content}',
    'answers' => '{$answers}',
    'author' => '{$author}',
    'avatar' => '{$avatar}',
    'comments' => '{$comments}',
    'publish_time' => '{$publish_time}',
    'agree_count' => '{$agree_count}',
    'use_authors' => {$use_authors},
    'use_topics' => {$use_topics},
    'use_avatars' => {$use_avatars},
    'use_pubtime' => {$use_pubtime},
    'use_comments' => {$use_comments},
    
    'custome_category_config' => $custome_category_config,
    'custome_category' => '{$custome_category}',
    
    'bind_task_id' => '{$bind_task_id}',
);
config_code;
        
        file_put_contents($this->question_config_file, $code);
        H::ajax_json_output(AWS_APP::RSM(null, -1, AWS_APP::lang()->_t('保存设置成功')));
    }

    public function ajax_article_action() {
        $title = $this->_value($_POST['article_title'], $this->article_config['article_title']);
        $content = $this->_value($_POST['article_content'], $this->article_config['article_content']);
        $author = $this->_value($_POST['article_author'], $this->article_config['article_author']);
        $time = $this->_value($_POST['article_time'], $this->article_config['article_time']);
        $topics = $this->_value($_POST['article_topics'], $this->article_config['article_topics']);
        $categories = $this->_value($_POST['article_categories'], $this->article_config['article_categories']);
        $author_config = $this->_value($_POST['article_author_config'], $this->article_config['article_author_config']);
        $author_user = $this->_value($_POST['article_author_user'], $this->article_config['article_author_user']);
        $category_config = $this->_value($_POST['article_category_config'], $this->article_config['article_category_config']);
        $category = $this->_value($_POST['article_category'], $this->article_config['article_category']);
        $bind_task_id = $this->_value($_POST['bind_task_id'], $this->article_config['bind_task_id']);
        
        if (isset($_POST['bind_task_id']) && file_exists($this->account_config_file)) {
          require $this->account_config_file;
          if (isset($config['sjs_account'])) {
        		$username = $config['sjs_account']['username'];
        		$password = $config['sjs_account']['password'];
            $url = $this->sjs_server."/index.php?r=api/bind&u={$username}&p={$password}&tid=".intval($_POST['bind_task_id']);
	        	$callback = base_url()."/".G_INDEX_SCRIPT."shenjianshou/article/";
	        	$url .= "&c=".urlencode($callback);
	        	
	        	$json = file_get_contents($url);
			      $ret = json_decode($json,true);
			      if($ret["result"] !== 0){
			      	//失败
			      	H::ajax_json_output(AWS_APP::RSM(null, -1, AWS_APP::lang()->_t("绑定任务失败：".$ret["data"])));
			      	exit();
			      }
      		}
        }
        
        $code = <<<article_config_code
<?php
/**
 * 神箭手文章配置文件
 */
\$config['sjs_article'] = array(
    'article_title' => '{$title}',
    'article_content' => '{$content}',
    'article_author' => '{$author}',
    'article_time' => '{$time}',
    'article_topics' => '{$topics}',
    'article_categories' => '{$categories}',
    'article_author_config' => $author_config,
    'article_author_user' => '{$author_user}',
    'article_category_config' => $category_config,
    'article_category' => '{$category}',
    'bind_task_id' => '{$bind_task_id}',
);
article_config_code;
        
        file_put_contents($this->article_config_file, $code);
        H::ajax_json_output(AWS_APP::RSM(null, -1, AWS_APP::lang()->_t('保存设置成功')));
    }
    
    
    public function ajax_account_action() {
    	if(empty($_POST['username']) && empty($_POST['password'])){
    	//解除绑定

    	$code = <<<account_ubind_code
<?php
/**
 * 神箭手帐号配置文件
 */
\$config['sjs_account'] = array(
    'username' => '{$username}',
    'password' => '{$password}',
);
account_ubind_code;
				file_put_contents($this->account_config_file, $code);
    		H::ajax_json_output(
    				AWS_APP::RSM(null, -1, AWS_APP::lang()->_t('解除绑定账号成功')));
    		exit();
    	}
    	
    	
    	$username = $this->_value($_POST['username'], $this->article_config['username']);
      $password = $this->_value($_POST['password'], $this->article_config['password']);
      
      $url = $this->sjs_server."/index.php?r=api/verify&u={$username}&p={$password}";
      //请求接口
      $json = file_get_contents($url);
      

      $ret = json_decode($json,true);
      if($ret["result"] !== 0){
      	//失败
      	H::ajax_json_output(AWS_APP::RSM(null, -1, AWS_APP::lang()->_t("绑定账户失败：".$ret["data"])));
      	exit();
      }
	    
	      
      //成功
    	$code = <<<account_config_code
<?php
/**
 * 神箭手帐号配置文件
 */
\$config['sjs_account'] = array(
    'username' => '{$username}',
    'password' => '{$password}',
);
account_config_code;
        
        file_put_contents($this->account_config_file, $code);
    	H::ajax_json_output(AWS_APP::RSM(null, -1, AWS_APP::lang()->_t('绑定账号成功')));
    }
}
