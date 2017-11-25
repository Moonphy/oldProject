package com.qipeipu.crm.session.bean;

import java.util.List;

import com.qipeipu.crm.dao.bean.ResourceRecord;
import com.qipeipu.crm.dtos.global.BeanTree;
import com.qmsk.session.bean.SessionUserBase;

public class CrmSessionUser extends SessionUserBase {
	private static final long serialVersionUID = 1L;
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
	 * 职责id
	 */
	private List<Integer> dutyIds;
	/**
	 * 职责名称
	 */
	private List<String> dutyNames;

	//用户有权访问的资源ids
	//private List<Long> resourceIds;

	/**
	 * 前端使用的菜单(用户有权访问的资源名称)
	 */
	//private List<String> resourceNames ;

	//用户有权访问的资源信息
	private List<ResourceRecord> resources ;

	//用户有权访问的资源树
	private BeanTree<ResourceRecord> resourceTree ;





	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getLoginName() {
		return loginName;
	}

	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}

	public String getLoginPwd() {
		return loginPwd;
	}

	public void setLoginPwd(String loginPwd) {
		this.loginPwd = loginPwd;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public Boolean getIsAdmin() {
		return isAdmin;
	}

	public void setIsAdmin(Boolean isAdmin) {
		this.isAdmin = isAdmin;
	}

	public String getWeCharNo() {
		return WeCharNo;
	}

	public void setWeCharNo(String weCharNo) {
		WeCharNo = weCharNo;
	}

	public Integer getSex() {
		return Sex;
	}

	public void setSex(Integer sex) {
		Sex = sex;
	}

	public String getMp() {
		return Mp;
	}

	public void setMp(String mp) {
		Mp = mp;
	}

	public String getEmail() {
		return Email;
	}

	public void setEmail(String email) {
		Email = email;
	}

	@Override
	public String getId() {
		if (userId != null) {
			return String.valueOf(userId);
		}
		return null;
	}

	@Override
	public String getName() {
		return userName;
	}



	public String getOpenId() { return openId; }
	public void setOpenId(String openId) {
		this.openId = openId;
	}

	public List<Integer> getDutyIds() { return dutyIds; }
	public void setDutyIds(List<Integer> dutyIds) { this.dutyIds = dutyIds; }

	public List<String> getDutyNames() { return dutyNames; }
	public void setDutyNames(List<String> dutyNames) { this.dutyNames = dutyNames; }

//	public List<Long> getResourceIds() { return resourceIds; }
//	public void setResourceIds(List<Long> resourceIds) { this.resourceIds = resourceIds; }

//	public List<String> getResourceNames() { return resourceNames; }
//	public void setResourceNames(List<String> resourceNames) { this.resourceNames = resourceNames; }

	public List<ResourceRecord> getResources() { return resources; }
	public void setResources(List<ResourceRecord> resources) { this.resources = resources; }

	public BeanTree<ResourceRecord> getResourceTree() { return resourceTree; }
	public void setResourceTree(BeanTree<ResourceRecord> resourceTree) { this.resourceTree = resourceTree; }
}
