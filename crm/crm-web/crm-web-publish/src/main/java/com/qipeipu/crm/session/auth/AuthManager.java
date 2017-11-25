package com.qipeipu.crm.session.auth;

import java.util.*;

import com.qipeipu.crm.constant.ErrorConst;
import com.qipeipu.crm.dao.bean.ResourceRecord;
import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.session.UserSessionInfo;
import com.qipeipu.crm.session.bean.CrmSessionUser;
import com.qipeipu.crm.utils.bean.tools.GUtils;
import lombok.extern.slf4j.Slf4j;

import org.apache.commons.collections.CollectionUtils;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.Multimap;
import com.qipeipu.crm.dtos.auth.AuthDTO;
import com.qipeipu.crm.service.auth.AuthService;
import com.utils.web.SpringContextUtils;

@Slf4j
public class AuthManager {
	private static AuthManager ini;
	private static Set<ResourceRecord> resourceSet ;
	private static Map<Long , ResourceRecord> id2ResourceRecordMap ;

	/**
	 * 验证用户是否有权限访问资源
	 * @param user 用户信息
	 * @param uri url
	 * @param methodType 请求方法
	 * @param systemId 系统id
	 * @return 是否有权限
	 */
	public boolean check(CrmSessionUser user, String uri , int methodType , int systemId) {
		//测试HashSet的contain方法(有可能辨识不了=-=)
//		for(ResourceRecord i : resourceSet) {
//			if (! i.equals(tmpRe)) continue ;
//			String tmp1 = i.toString() ;
//			String tmp2 = tmpRe.toString() ;
//			int tmp3 = i.hashCode() ;
//			int tmp4 = tmpRe.hashCode() ;
//			i = i ;
//		}
		if (GUtils.isEmptyOrNull(uri)) return true ;

		//判断该资源是否受权限控制
		ResourceRecord tmpRe = ResourceRecord.builder()
				.resourceURL(uri)
				.resourceMethodType(methodType)
				.systemId(systemId)
				.build() ;
		long resourceId = 0 ;
		if (! resourceSet.contains(tmpRe)) {
			resourceId = findResourceByResourceInfo(tmpRe) ;	//判断资源是否为新增的资源
			if (resourceId <= 0) return true ; //不在访问控制范围内
			resourceSet.add(tmpRe) ;
			id2ResourceRecordMap.put(resourceId, ResourceRecord.builder()
					.resourceId(resourceId)
					.resourceURL(uri)
					.resourceMethodType(methodType)
					.systemId(systemId)
					.build());
		}

		//获取可持有的资源id集合
		List<ResourceRecord> resources = user.getResources() ;

		//判断是否有匹配的可访问资源
		for(ResourceRecord i : resources) {
			ResourceRecord tmp = id2ResourceRecordMap.get(i.getResourceId()) ;

			if (null == tmp) continue ;
			if (! uri.equals(tmp.getResourceURL())) continue ;
			if (! (methodType == tmp.getResourceMethodType())) continue ;
			if (! (systemId == tmp.getSystemId())) continue ;

			return true ;
		}

		//判断资源是否为过时的资源
		if (resourceId <= 0) {
			resourceId = findResourceByResourceInfo(tmpRe) ;
			if (resourceId <= 0) { //过时则重新初始化
				restart() ;
				return true ;
			}
		}

		return false;
	}

	/***************************** 单例，初始化 ************************************/
	public static AuthManager getInstance() {
		if (ini == null) {
			synchronized (AuthManager.class) {
				if (ini == null) {
					ini = new AuthManager();
				}
			}
		}
		return ini;
	}

	public int restart() {
		log.info("AuthManager restart");
		initial();
		log.info("AuthManager restart---------resourceSet num:" + resourceSet.size());
		log.info("AuthManager restart---------id2ResourceRecordMap num:" + id2ResourceRecordMap.size());
		return 0 ;
	}

	private AuthManager() {
		log.info("AuthManager ini");
		initial();
		//log.info("AuthManager ini---------auth num:" + map.size());
		log.info("AuthManager ini---------resourceSet num:" + resourceSet.size());
		log.info("AuthManager ini---------id2ResourceRecordMap num:" + id2ResourceRecordMap.size());
	}

	//初始化资源管理器
	private void initial() {
//		map = HashMultimap.create();
//		serivce = (AuthService) SpringContextUtils.getBean("authServiceImpl");
//
//		List<AuthDTO> list = serivce.getAllAuth();
//		if (CollectionUtils.isEmpty(list)) {
//			return;
//		} else {
//			for (AuthDTO auth : list) {
//				map.put(auth.getDutyid(), auth.getUri());
//			}
//		}
		//初始化
		AuthService authService = (AuthService) SpringContextUtils.getBean("authServiceImpl");
		resourceSet = new HashSet<>() ;
		id2ResourceRecordMap = new HashMap<>() ;

		//资源信息获取
		List<ResourceRecord> ResourceRecords = new ArrayList<>() ;
		authService.findAllCanUsedResourceInfo(ResourceRecords) ;

		//录入
		for(ResourceRecord i : ResourceRecords) {
			id2ResourceRecordMap.put(i.getResourceId() , i) ;
			resourceSet.add(ResourceRecord.builder()
					.resourceURL(i.getResourceURL())
					.resourceMethodType(i.getResourceMethodType())
					.systemId(i.getSystemId())
					.build()) ;
		}

		//角色信息获取(暂时不需要)

		//角色持有资源权限关系获取(暂时不需要)
		//Map<Integer, Set<Long>> roleId2ResourceIdsMap = new HashMap<>();
		//authService.findAllRelationRoleHoldResource(roleId2ResourceIdsMap) ;
	}

	//进入数据库查找该资源是否需要访问控制
	private long findResourceByResourceInfo(ResourceRecord re) {
		if (null == re.getResourceURL()) return 0 ;
		if (null == re.getResourceMethodType()) return 0 ;
		if (null == re.getSystemId()) return 0 ;

		AuthService authService = (AuthService) SpringContextUtils.getBean("authServiceImpl");
		return authService.findCanUsedIdByResourceInfo(
				re.getResourceURL() ,
				re.getResourceMethodType() ,
				re.getSystemId()) ;
	}
}
