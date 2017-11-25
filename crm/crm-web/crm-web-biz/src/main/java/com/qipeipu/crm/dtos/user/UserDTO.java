package com.qipeipu.crm.dtos.user;

import java.util.List;

import com.qipeipu.crm.dao.bean.ResourceRecord;
import com.qipeipu.crm.dtos.global.BeanTree;
import lombok.Data;

/**
 * Created by johnkim on 14-12-25.
 */
@Data
public class UserDTO {

	/**
	 * 用户ID
	 */
	private Integer userId;
	/**
	 * 用户名
	 */
	private String userName;
	/**
	 * 登录名
	 */
	private String loginName;
	/**
	 * 登录密码
	 */
	private String loginPwd;
	/**
	 * 新登录密码(修改密码用)
	 */
	private String newloginPwd;
	/**
	 * 重复新密码(修改密码用)
	 */
	private String repassword;
	/**
	 * 用户状态
	 */
	private int status;
	/**
	 * 是否为管理员
	 */
	private Boolean isAdmin;

	/**
	 * 微信号
	 */
	private String WeCharNo;
	/**
	 * 服务号与微信号对应唯一id
	 */
	private String openId;
	/**
	 * 性别：0-女，1-男
	 */
	private Integer Sex;
	/**
	 * 手机号
	 */
	private String Mp;
	/**
	 * 邮箱
	 */
	private String Email;
	/**
	 * 地区
	 */
	private Integer areaId;
	/**
	 * 用户职责ids
	 */
	private List<Integer> dutyIds;
	/**
	 * 用户职责名称
	 */
	private List<String> dutyNames;

	//用户有权访问的资源ids
	//private List<Long> resourceIds;

	//前端使用的菜单(用户有权访问的资源名称)
	//private List<String> resourceNames ;

	//用户有权访问的资源信息
	private List<ResourceRecord> resources ;

	//用户有权访问的资源树
	private BeanTree<ResourceRecord> resourceTree ;
}
