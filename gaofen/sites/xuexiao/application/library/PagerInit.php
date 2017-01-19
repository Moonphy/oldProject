<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
//if (!defined('IS_INITPHP')) exit('Access Denied!');   
/*********************************************************************************
 * InitPHP 3.2.2 国产PHP开发框架  扩展类库-分页类
 *-------------------------------------------------------------------------------
 * 版权所有: CopyRight By initphp.com
 * 您可以自由使用该源码，但是在使用过程中，请保留作者信息。尊重他人劳动成果就是尊重自己
 *-------------------------------------------------------------------------------
 * $Author:zhuli
 * $Dtime:2012-11-27 
***********************************************************************************/ 
class PagerInit { 

	private $show_num = 9; //分页中显示多少个
	private $display_mode; //'default', //原生类的分页显示, 'gaofen' //高分网分页显示, 'mobi' //手机版分页显示
	private $conf = array(
		'first_last'=> 1, //首页-尾页 0-关闭 1-开启
		'back_next' => 1, //上一页-下一页 0-关闭 1-开启
		'total_num' => 1, //是否显示总页数 0-关闭 1-开启
		'page_num'  => 1, //翻页数 0-关闭 1-开启
		'select'    => 1  //下拉列表选择 0-关闭 1-开启
	);
	private $style_config = '<style type="text/css">
	.InitPHP_pages {font:12px/1.6em Helvetica, Arial, sans-serif;overflow:hidden; text-align:center; font-family:Verdana;margin-bottom:5px;  }
	.InitPHP_pages a, .pages{ margin:0 1px; padding:1px 6px; border:1px solid #E4E4E4; text-decoration:none!important; }
	.InitPHP_pages a:hover { border-color:#369; }
	.InitPHP_pages strong { margin:0 1px; padding:2px 6px; border-color:#369; background:#369; color:#FFF; text-decoration:none!important; }
	.InitPHP_pages .back { padding:4px 6px 1px 20px!important; padding:4px 6px 2 20px;  font-family:simsun; }
	.InitPHP_pages .next { padding:4px 20px 1px 6px!important; padding:4px 20px 2 6px; font-family:simsun; }
	.InitPHP_pages .first { padding:4px 6px 1px 4px!important; padding:4px 6px 2 4px;  font-family:simsun; }
	.InitPHP_pages .last { padding:4px 4px 1px 6px!important; padding:4px 4px 2 6px; font-family:simsun; }
	</style>';

	private $recordCount;
	private $pageSize;
	public $makeHtmlParams = array();
	
	/**
	 *	分页-分页入口
	 * 	@param int  $count   总共多少数据
	 * 	@param int  $prepage 每页显示多少条 
	 * 	@param int  $url     URL 
	 * 	@param string $display_mode 分页显示模式 ['gaofen', 'mobi']
	 *  @return string
	 */
	public function pager($count, $prepage, $url, $display_mode = 'gaofen') {
		$this->recordCount = $count    = (int) $count;
		$this->pageSize = $prepage  = (int) $prepage; 
		$page_num = ceil($count / $prepage); //总共多少页
		//$page     = V('G:page', 1);
		$page	  = $this->getCurrentPage();
		$page     = ($page > $page_num) ? $page_num : ($page = ($page < 1) ? 1 : $page);
		$url      = (strpos($url, '?') === false) ? $url . '?' : $url;
		$this->setDisplayMode($display_mode);
		return $this->pager_html($page_num, $url, $page);
	}
	
	/**
	 *	分页-获取分页HTML显示
	 * 	@param int    $page_num 页数
	 * 	@param string $url      URL 
	 * 	@param int    $page     当前页
	 * 	@param string $display_mode 显示样式模式['default', //原生类的分页显示
	 * 	                           				'gaofen', //高分网分页显示
	 * 	                           				'mobi', //手机版分页显示
	 * 	                           			 	]
	 *  @return string
	 */
	private function pager_html($page_num, $url, $page) {
		if ($page_num < 2) {
			return false;
		}
		//list($start, $end) = $this->get_satrt_and_end($page, $page_num);
		list($back, $next) = $this->get_pager_next_back_html($url, $page, $page_num);
		//list($first, $last) = $this->get_first_last_html($page_num, $url);
		switch($this->getDisplayMode()) {
			case 'default':
				$html = $this->style_config . "<div class='page-wrap'>";
			break;

			case 'mobi':
				$html = '<div class="ui-pagination">';
			break;

			default:
				$html = '<div class="page_box">';
				$html .= '<div class="pagelist cls">';
				
			break;

		}

		//$html .= '<div class="status">'.$this->get_total_num_html($page, $page_num).'</div>';
		$html .= $back;
		$html .= $this->getShowPageList($page, $page_num);
		$html .= $next;

		/*
		$html .= '<ul class="page">';
		$html .= '<li class="prev">'.$first.'</li>';
		$html .= '<li class="prev">'.$back.'</li>';
		
		$html .= $this->get_pager_num_html($start, $end, $url, $page);
		$html .= '<li class="next">'.$next.'</li>';
		$html .= '<li class="next">'.$last.'</li>';
		
		//$html .= $this->get_total_num_html($page, $page_num);
		$html .= $this->get_select_html($page_num, $url, $page);
		$html .= '<ul>';
		 */
		$html .= '</div>';
		$html .= '</div>';
		return $html;
	}
		
	/**
	 *	分页-获取分页数字的列表
	 * 	@param int     $start  开始数
	 * 	@param int     $end    结束数
	 * 	@param string  $url    URL地址
	 * 	@param int    $page     当前页
	 *  @return string
	 */
	private function get_pager_num_html($start, $end, $url, $page) {
		//if ($this->conf['page_num'] == 0) return ''; //是否开启
		$html = '';
		for ($i=$start; $i<=$end; $i++) {
			if ($i == $page) {
				$html .= "<li class='active'><strong>{$i}</strong></li>";
			} else {
				$html .= "<li><a href='{$url}&page={$i}'>{$i}</a></li>";
			}
		}
		return $html;
	}
	
	/**
	 *	分页-分页总页数显示
	 * 	@param int  $page_num 页数
	 *  @return string
	 */
	private function get_total_num_html($page, $page_num) {
		// return ''; //是否开启
		$retString = '';
		switch($this->getDisplayMode()) {
			case 'default':
				if ($this->conf['total_num'] == 0){
					$retString = "&nbsp;&nbsp;共{$page_num}页";
				}

			break;

			case 'gaofen':
				$retString = sprintf('<span class="pltitle">' . '%s&#8211;%s 条， 共 %s' . '</span>',
					($page - 1) * $this->pageSize + 1 ,
					min($page * $this->pageSize, $this->recordCount),
					$this->recordCount
				);

			break;

			case 'mobi':
				$retString = sprintf('<span>' . '%s/%s' . '</span>', $page , $page_num);
			break;
		}
		
		return $retString;
	}
	
	/**
	 *	分页-分页首页和尾页显示
	 * 	@param int  $page_num 页数
	 * 	@param string  $url    URL地址
	 *  @return string
	 */
	private function get_first_last_html($page_num, $url) {
		//if ($this->conf['first_last'] == 0) return array('', ''); //是否开启
		$first = "<a href='{$url}&page=1' class='first'>首页</a>";
		$last  = "<a href='{$url}&page={$page_num}' class='last'>尾页</a>";
		return array($first, $last);
	}
	
	/**
	 *	分页-获取分页上一页-下一页HTML
	 * 	@param string  $url      URL地址
	 * 	@param int     $page     当前页
	 * 	@param int     $page_num 页数
	 *  @return string
	 */
	private function get_pager_next_back_html($url, $page, $page_num) {
		
		$back = '';
		$next = '';

		$display_mode = $this->getDisplayMode();
		if($page) {
			switch($display_mode){
				case 'mobi':
					if(1<$page){
						$back = '<a class="ui-pagination-prev" href="' . $this->makeLinkPage($page - 1) . '">上一页</a>';
					}else{
						$back = '<span class="disabled">上一页</span>';
					}
					
				break;

				default:
					if ( 1 < $page ) {
						//$link = $url.'&page='.($page - 1);
						$back = '<a class="prev page-numbers" href="' . $this->makeLinkPage($page - 1) . '">上一页</a>';
					}
				break;		
			}			
				
			switch($display_mode){
				case 'mobi':
					if ($page < $page_num || -1 == $page_num) {
						$next = '<a class="ui-pagination-next" href="' . $this->makeLinkPage($page+1) . '">下一页</a>';
					}else{
						$next = '<span class="disabled">下一页</span>';
					}					
				break;

				default:
					if ($page < $page_num || -1 == $page_num) {
						//$link = $url.'&page='.($page + 1);
						$next = '<a class="next page-numbers" href="' . $this->makeLinkPage($page+1) . '">下一页</a>';
					}
				break;
			}
		}		
		
		/*
		if ($this->conf['back_next'] == 0) return array('', ''); //是否开启
		$next_page = $page + 1;
		$next = "<a href='{$url}&page={$next_page}' class='next'>下一页</a>";
		if ($page == $page_num) $next = "<a href='{$url}&page={$page}' class='next'>下一页</a>";
		$back_page = $page - 1;
		$back = "<a href='{$url}&page={$back_page}' class='back'>上一页</a>";
		if ($page == 1) $back = "<a href='{$url}&page=1' class='back'>上一页</a>";
		 */
		return array($back, $next);
	}
	
	/**
	 *	分页-Select选择器
	 * 	@param int     $page_num 页数
	 * 	@param string  $url      URL地址
	 * 	@param int     $page     当前页
	 *  @return string
	 */
	private function get_select_html($page_num, $url, $page) {
		//if ($this->conf['select'] == 0) return '';
		return '';
		$html = '&nbsp;&nbsp;<select name="select" onchange="javascript:window.location.href=this.options[this.selectedIndex].value">';
		for ($i=1; $i<=$page_num; $i++){
            if ($page == $i) {
				$selected = ' selected';
			} else {
				$selected = '';
			}
            $html.="<option value='{$url}&page={$i}' {$selected}>{$i}</option>";
        }
		$html .= '</select>';
		return $html;
	}
	
	/**
	 *	分页-获取分页显示数字
	 * 	@param int  $page     当前页
	 * 	@param int  $page_num 页数
	 *  @return array(start, end)
	 */
	private function get_satrt_and_end($page, $page_num) {
		$temp = floor($this->show_num / 2);
		if ($page_num < $this->show_num) return array(1, $page_num);
		if ($page <= $temp) {
			$start = 1;
			$end = $this->show_num;
		} elseif (($page_num - $temp) < $page) {
			$start = $page_num - $this->show_num + 1;
			$end  = $page_num;
		} else {
			$start = $page - $temp;
			$end   = $page - $temp + $this->show_num - 1;
		}
		return array($start, $end);
	}

	/**
	 * 获取当前页码数
	 *
	 * @return int
	 */
	private function getCurrentPage()
	{
		$getRequest = Yaf_Dispatcher::getInstance()->getRequest();
		$params = $getRequest->getParams();
		if (isset($params['page'])) {
			$page = $params['page'];
		} else {
			$page = V('G:page', 1);
		}
		return $page;
	}

	/**
	 * 分页列表
	 *
	 * @param int $page 当前页码数
	 * @param int $page_num 页码总数
	 * @param int $end_size
	 * @param int $mid_size
	 *
	 * @return string
	 */
	private function getShowPageList($page, $page_num, $end_size = 1, $mid_size = 2)
	{
		$retString = '';
		switch($this->getDisplayMode()) {
			case 'default':
			case 'gaofen':
				$retString = $this->get_total_num_html($page, $page_num);
				$page_links = array();
				for ( $n = 1; $n <= $page_num; $n++ ) {
					$n_display = $n;
					if ( $n == $page ) {
						$page_links[] = "<span class='page-numbers current'>$n_display</span>";
						$dots = true;
					} else {
						if ($n <= $end_size || ( $page && $n >= $page - $mid_size && $n <= $page + $mid_size ) || $n > $page_num - $end_size ) {
							$page_links[] = "<a class='page-numbers' href='" . $this->makeLinkPage($n) . "'>$n_display</a>";
							$dots = true;
						} elseif ($dots) {
							$page_links[] = '<span class="page-numbers dots">...</span>';
							$dots = false;
						}
					}
				}
				$retString .= implode("\n", $page_links);
			break;
			case 'mobi':
				$retString = $this->get_total_num_html($page, $page_num);
			break;
		}

		return $retString;
	}

	/** 
	 * 构建分页link
	 *
	 * @param int $page 页码数
	 *
	 * @return string
	 */
	private function makeLinkPage($page)
	{
		$url = '';
		$getRequest = Yaf_Dispatcher::getInstance()->getRequest();
		$moduleName = $getRequest->getModuleName();
		$moduleName = $moduleName!=='Index'?$moduleName.'/':'';
		$controllerName = $getRequest->getControllerName();
		$controllerName = $controllerName.'/';
		$actionName = $getRequest->getActionName();
		$params = $getRequest->getParams();
		$queries = $getRequest->getQuery();
		$queries['page'] = $page;
				
		return F::URL($moduleName.$controllerName.$actionName, $queries, $params);
	}

	private function getDisplayMode(){
		return $this->display_mode;
	}

	private function setDisplayMode($mode){
		$this->display_mode = $mode;
	}
}
