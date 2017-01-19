<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 项目名称:  高分CMS
 * 建立日期:  2013年02月25日
 * 
 * 分页类
 * 
 * @作者 heli <heli@gaofen.com>
 * @版本 $Id:
 **/
 
class Pager {

	public function postpages($records,$currentpage,$pagesize,$pageshownum = 10) 
	{
		if($records<1)return '';
		if($pagesize<1) $pagesize=20;
		$maxpage=ceil($records/$pagesize);    //进一法取整得到最大页数。
		$pageshowcut=floor($pageshownum/2);  //分业省略号截取位置


		//判断上一页
		if($maxpage==1 || $maxpage==2 || $currentpage==1){
			$prepage = 1;
		}else{
			$prepage = $currentpage -1;
		}
		//判断下一页
		if($maxpage==1 || $currentpage==$maxpage){
			$nextpage = $maxpage;
		}else{
			$nextpage = $currentpage +1;
		}
		
		$pagestr = '';
		$pagestr .= '<span>共有'.$records.'条</span>';
		
	    //$action = SCRIPT_NAME;
		$action = $this->makeUrl();
		$action .= '?'.$_SERVER['QUERY_STRING'];    //得到地址栏中？后的内容
		if($action){  //将page=...的内容去掉
			$action=preg_replace("/&page\b[^\&]*/","",$action);
			$action=preg_replace("/\bpage\b[^\&]*\&*/","",$action);
		}
		if($action)$action.='&amp;';
		

			if($currentpage > 1) $pagestr .= "<a href=\"{$action}page={$prepage}\">&#8249;</a>";
			
	if($maxpage>$pageshownum) {
		
		if($currentpage>=$pageshowcut){
			$pageleft = $currentpage - 2;
			$pageright = $currentpage + 2;
			$pageright = ($pageright<$maxpage) ? $pageright : $maxpage;

			
			$pagestr .= "<a href=\"{$action}page=1\">1</a> ";

			$pagestr .= "<span>...</span>";
			for($i=$pageleft; $i<=$pageright; $i++){
				if($currentpage == $i){
						$pagestr .= "<a href=\"{$action}page={$i}\" class=\"focus\">{$i}</a>";
				}else{
						$pagestr .= "<a href=\"{$action}page={$i}\">{$i}</a> ";
				}
			}
			if($currentpage<$maxpage-2) $pagestr .= "<span>...</span>";
			if($currentpage<$maxpage-2 && $currentpage!=$maxpage) $pagestr .= "<a href='{$action}page={$maxpage}'>{$maxpage}</a>";
			
		}else{
			for($i=1; $i<=$pageshowcut; $i++){
				if($currentpage == $i){
					$pagestr .= "<a href=\"{$action}page={$i}\" class=\"focus\">{$i}</a>";
				}else{
					$pagestr .= "<a href=\"{$action}page={$i}\">{$i}</a> ";
				}
			}
			$pagestr .= "<span>...</span>";
			for($i=$maxpage-$pageshowcut+2; $i<=$maxpage; $i++){
				if($currentpage == $i){
					$pagestr .= "<a href=\"{$action}page={$i}\" class=\"focus\">{$i}</a>";
				}else{
					$pagestr .= "<a href=\"{$action}page={$i}\">{$i}</a> ";
				}
			}
		}

	}else{
		for($i=1; $i<=$maxpage; $i++){
			if($currentpage == $i){
				$pagestr .= "<a href=\"{$action}page={$i}\" class=\"focus\">{$i}</a>";
			}else{
				$pagestr .= "<a href=\"{$action}page={$i}\">{$i}</a> ";
			}
		}
	}

	if($currentpage < $maxpage){
		$pagestr .= "<a href='{$action}page=$nextpage'>&#8250;</a>";
	}
	//$pagestr.="<li class=\"num\"> 共{$records}条&nbsp;&nbsp;页次<span>{$currentpage}/{$maxpage}</span></li>";

		return $pagestr;
	}

	function paginate_links($args = array()) 
	{
		$defaults = array(
			'base' => '%_%', // http://example.com/all_posts.php%_% : %_% is replaced by format (below)
			'format' => '?page=%#%', // ?page=%#% : %#% is replaced by the page number
			'total' => 1,
			'current' => 0,
			'show_all' => false,
			'prev_next' => true,
			'prev_text' => '&laquo; Previous',
			'next_text' => 'Next &raquo;',
			'end_size' => 1,
			'mid_size' => 2,
			'type' => 'plain',
			'add_args' => false, // array of query args to add
			'add_fragment' => ''
		);

		$args = $this->wp_parse_args( $args, $defaults );
		extract($args, EXTR_SKIP);

		// Who knows what else people pass in $args
		$total = (int) $total;
		if ( $total < 2 ) return;
		$current  = (int) $current;
		$end_size = 0  < (int) $end_size ? (int) $end_size : 1; // Out of bounds?  Make it the default.
		$mid_size = 0 <= (int) $mid_size ? (int) $mid_size : 2;
		$add_args = is_array($add_args) ? $add_args : false;
		$r = '';
		$page_links = array();
		$n = 0;
		$dots = false;

		$page_links[] = '<div class="page_box">';
		$page_links[] = '<div class="pagelist cls">';
		$page_links_text = sprintf( '<span class="pltitle">' . '%s&#8211;%s 条， 共 %s' . '</span>%s',
			( $page - 1 ) * $count + 1 ,
			min( $page * $count, $listData['total_number'] ),
			$listData['total_number'],
			$page_html
		);
		if ( $prev_next && $current && 1 < $current ){
			/*
			$link = str_replace('%_%', 2 == $current ? '' : $format, $base);
			$link = str_replace('%#%', $current - 1, $link);
			if ( $add_args )
			$link = $this->add_query_arg( $add_args, $link );
			$link .= $add_fragment;
			 */
			$link = '';
			$page_links[] = '<a class="prev page-numbers" href="' . $link . '">' . $prev_text . '</a>';
		}
		for ( $n = 1; $n <= $total; $n++ ) {
			$n_display = $n;
			if ( $n == $current ) {
				$page_links[] = "<span class='page-numbers current'>$n_display</span>";
				$dots = true;
			} else {
				if ( $show_all || ( $n <= $end_size || ( $current && $n >= $current - $mid_size && $n <= $current + $mid_size ) || $n > $total - $end_size ) ) {
					/*
					$link = str_replace('%_%', 1 == $n ? '' : $format, $base);
					$link = str_replace('%#%', $n, $link);
					if ( $add_args ) $link = $this->add_query_arg( $add_args, $link );
					$link .= $add_fragment;
					 */
					$link = '';
					$page_links[] = "<a class='page-numbers' href='" . $link . "'>$n_display</a>";
					$dots = true;
				} elseif ($dots && !$show_all) {
					$page_links[] = '<span class="page-numbers dots">...</span>';
					$dots = false;
				}
			}
		}

		if ($prev_next && $current && ( $current < $total || -1 == $total )) {
			/*
			$link = str_replace('%_%', $format, $base);
			$link = str_replace('%#%', $current + 1, $link);
			if ( $add_args ) $link = $this->add_query_arg( $add_args, $link );
			$link .= $add_fragment;
			 */
			$link = '';
			$page_links[] = '<a class="next page-numbers" href="' . $link . '">' . $next_text . '</a>';
		}
		$page_links[] = '</div>';
		$page_links[] = '</div>';

		switch ( $type ){
				case 'array' :
					return $page_links;
				break;
				case 'list' :
					$r .= "<ul class='page-numbers'>\n\t<li>";
					$r .= join("</li>\n\t<li>", $page_links);
					$r .= "</li>\n</ul>\n";
				break;
				default :
					$r = join("\n", $page_links);
				break;
			}
		return $r;
	}

	function wp_parse_args( $args, $defaults = '' ) {
		if ( is_object( $args ) ){
			$r = get_object_vars( $args );
		}elseif ( is_array( $args ) ){
			$r =& $args;
		}else{
			$this->wp_parse_str( $args, $r );
		}
		if ( is_array( $defaults ) )    return array_merge( $defaults, $r );
		return $r;
	}

	function wp_parse_str( $string, &$array ) {
		parse_str( $string, $array );
		if ( get_magic_quotes_gpc() )   $array = $this->dstripslashes( $array );
	}

	function add_query_arg() {
		$ret = '';
		if ( is_array( func_get_arg(0) ) ) {
			if ( @func_num_args() < 2 || false === @func_get_arg( 1 ) ){
				$uri = $_SERVER['REQUEST_URI'];
			}else{
				$uri = @func_get_arg( 1 );
			}
		} else {
			if ( @func_num_args() < 3 || false === @func_get_arg( 2 ) ){
				$uri = $_SERVER['REQUEST_URI'];
			}else{
				$uri = @func_get_arg( 2 );
			}
		}

		if ( $frag = strstr( $uri, '#' ) ){
			$uri = substr( $uri, 0, -strlen( $frag ) );
		}else{
			$frag = '';
		}
		if ( preg_match( '|^https?://|i', $uri, $matches ) ) {
			$protocol = $matches[0];
			$uri = substr( $uri, strlen( $protocol ) );
		} else {
			$protocol = '';
		}

		if ( strpos( $uri, '?' ) !== false ) {
			$parts = explode( '?', $uri, 2 );
			if ( 1 == count( $parts ) ) {
				$base = '?';
				$query = $parts[0];
			} else {
				$base = $parts[0] . '?';
				$query = $parts[1];
			}
		} elseif ( !empty( $protocol ) || strpos( $uri, '=' ) === false ) {
			$base = $uri . '?';
			$query = '';
		} else {
			$base = '';
			$query = $uri;
		}

		$this->wp_parse_str( $query, $qs );
		$qs = $this->urlencode_deep( $qs ); // this re-URL-encodes things that were already in the query string
		if ( is_array( func_get_arg( 0 ) ) ) {
			$kayvees = func_get_arg( 0 );
			$qs = array_merge( $qs, $kayvees );
		} else {
			$qs[func_get_arg( 0 )] = func_get_arg( 1 );
		}

		foreach ( (array) $qs as $k => $v ) {
			if ( $v === false ) unset( $qs[$k] );
		}

		$ret = $this->build_query( $qs );
		$ret = trim( $ret, '?' );
		$ret = preg_replace( '#=(&|$)#', '$1', $ret );
		$ret = $protocol . $base . $ret . $frag;
		$ret = rtrim( $ret, '?' );
		return $ret;
	}

	function urlencode_deep($value) {
		$value = is_array($value) ? array_map('urlencode_deep', $value) : urlencode($value);
		return $value;
	}

	function build_query( $data ) {
		return _http_build_query( $data, null, '&', '', false );
	}

	// from php.net (modified by Mark Jaquith to behave like the native PHP5 function)
	function _http_build_query($data, $prefix=null, $sep=null, $key='', $urlencode=true) {
		$ret = array();

		foreach ( (array) $data as $k => $v ) {
			if ( $urlencode) $k = urlencode($k);
			if ( is_int($k) && $prefix != null ) $k = $prefix.$k;
			if ( !empty($key) ) $k = $key . '%5B' . $k . '%5D';
			
			if ( $v === NULL ){
				continue;
			}elseif ( $v === FALSE ){
				$v = '0';
			}

			if ( is_array($v) || is_object($v) ){
				array_push($ret,_http_build_query($v, '', $sep, $k, $urlencode));
			}elseif ( $urlencode ){
				array_push($ret, $k.'='.urlencode($v));
			}else{
				array_push($ret, $k.'='.$v);
			}
		}

		if ( NULL === $sep ) $sep = ini_get('arg_separator.output');
		return implode($sep, $ret);
	}
	
	public function makeUrl()
	{
		$url = '';
		$getRequest = Yaf_Dispatcher::getInstance()->getRequest();
		$moduleName = $getRequest->getModuleName();
		$controllerName = $getRequest->getControllerName();
		$actionName = $getRequest->getActionName();
		if ('Index' != $moduleName) {
			$url .= '/'.$moduleName;
		}
		if ('Index' != $controllerName) {
			$url .= '/'.$controllerName;
		}
		if ('Index' != $actionName) {
			$url .= '/'.$actionName;
		}
		return $url;
	}
	
}
?>
