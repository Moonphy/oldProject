package com.qipeipu.crm.service.impl.auth;

import java.util.*;

import com.google.common.collect.Lists;
import com.qipeipu.crm.constant.ErrorConst;
import com.qipeipu.crm.dao.AuthRoleHoldResourceDAO;
import com.qipeipu.crm.dao.AuthUserPlayRoleDAO;
import com.qipeipu.crm.dao.ResourceDAO;
import com.qipeipu.crm.dao.RoleDAO;
import com.qipeipu.crm.dao.bean.ResourceRecord;
import com.qipeipu.crm.dao.bean.RoleRecord;
import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.VoModel;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import com.qipeipu.crm.dtos.auth.AuthDTO;
import com.qipeipu.crm.service.auth.AuthService;

@Service
public class AuthServiceImpl implements AuthService {
	@Autowired
	private ResourceDAO resourceDAO ;
	@Autowired
	private RoleDAO roleDAO ;
	@Autowired
	private AuthUserPlayRoleDAO authUserPlayRoleDAO;
	@Autowired
	private AuthRoleHoldResourceDAO authRoleHoldResourceDAO ;

	//获取所有权限
	@Override
	public List<AuthDTO> getAllAuth() {
//		List<AuthDTO> list = dutyHoldDao.getAll();
		List<AuthDTO> list = authRoleHoldResourceDAO.findAllRelationRoleHoldResource();
		if (CollectionUtils.isEmpty(list)) return Collections.emptyList();


		//get srcid & uri
//		Set<Integer> srcid = Sets.newHashSet();
//		for (AuthDTO auth : list) {
//			srcid.add(auth.getSourceid());
//		}
//		List<AuthDTO> srclist = authSrcDao.getBySrcIds(srcid.toArray());
		List<Long> resourceIds = new ArrayList<>() ;
		for(AuthDTO i : list) resourceIds.add(i.getSourceid().longValue()) ;
		List<ResourceRecord> res = resourceDAO.findIdsWithResourceInfosByIds(resourceIds) ;

		//映射
		Map<Long , ResourceRecord> id2ResourceReMap = new HashMap<>() ;
		for(ResourceRecord i : res) id2ResourceReMap.put(i.getResourceId() , i) ;

		//compare & build
//		for (AuthDTO auth : list) {
//			for (AuthDTO src : srclist) {
//				if (auth.getSourceid().equals(src.getSourceid())) {
//					auth.setUri(src.getUri());
//				}
//			}
//		}
		for(AuthDTO i : list) {
			ResourceRecord tmp = id2ResourceReMap.get(i.getSourceid().longValue()) ;
			if (null == tmp) continue ;
			i.setUri(tmp.getResourceURL());
			i.setMethodType(tmp.getResourceMethodType());
			i.setSystemId(tmp.getSystemId());
		}

		return list;
	}

	//获取单个权限
	@Override
	public List<AuthDTO> getAuth(int dutyId) {
		if (dutyId <= 0) return Collections.emptyList();

//		List<AuthDTO> list = dutyHoldDao.getAll();
		List<AuthDTO> list = new ArrayList<>() ;

		//get srcid & uri
//		Set<Integer> srcid = Sets.newHashSet();
//		for (AuthDTO auth : list) {
//			srcid.add(auth.getSourceid());
//		}
//		List<AuthDTO> srclist = authSrcDao.getBySrcIds(srcid.toArray());
//		if (CollectionUtils.isEmpty(list)) {
//			return Collections.emptyList();
//		}
		List<Long> resourceIds = authRoleHoldResourceDAO.findResourceIdsByRoleIds(Lists.newArrayList(dutyId)) ;
		List<ResourceRecord> res = resourceDAO.findIdsWithResourceInfosByIds(resourceIds) ;

		//compare & build
//		for (AuthDTO auth : list) {
//			for (AuthDTO src : srclist) {
//				if(auth.getSourceid().equals(src.getSourceid())){
//					auth.setUri(src.getUri());
//				}
//			}
//		}
		for(ResourceRecord i : res) {
			AuthDTO tmp = new AuthDTO() ;
			tmp.setDutyid(dutyId);
			tmp.setSourceid((int) i.getResourceId());
			tmp.setUri(i.getResourceURL());
			tmp.setMethodType(i.getResourceMethodType());
			tmp.setSystemId(i.getSystemId());
			list.add(tmp) ;
		}

		return list;
	}

	//通过id获取角色记录
	@Override
	public ResultDTO<RoleRecord> findRoleRecordByRoleId(int roleId) {
		if (roleId <= 0) return ResultDTO.failResult(ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex() , "角色id非法") ;

		List<RoleRecord> tmpRes = roleDAO.findByIds(Lists.newArrayList(roleId)) ;

		if (tmpRes.isEmpty())
			return ResultDTO.failResult(ErrorConst.ErrorType.RESULT_IS_EMPTY.getIndex(), "找不到对应角色") ;
		else if (tmpRes.size() == 1)
			return ResultDTO.successResult(tmpRes.get(0)) ;
		return ResultDTO.failResult(ErrorConst.ErrorType.UNKOWN_ERROR.getIndex() , "系统出错") ;
	}

	//获取用户充当的角色
	@Override
	public int findRoleIdsByUserId(long userId, List<Integer> roleIds) {
		if (userId <= 0) return 1 ;
		List<Integer> tmpRe = authUserPlayRoleDAO.findRoleIdsByUserId(userId) ;
		for(Integer i : tmpRe) roleIds.add(i) ;
		return 0 ;
	}

	//获取有权访问的资源id列表
	@Override
	public int findResourceIdsByRoleIds(List<Integer> roleIds, List<Long> resourceIds) {
		if (roleIds.isEmpty()) return 1 ;
		List<Long> tmpRe = authRoleHoldResourceDAO.findResourceIdsByRoleIds(roleIds) ;
		for(Long i : tmpRe) resourceIds.add(i) ;
		return 0 ;
	}

	//获取所有需要访问控制的资源信息
	@Override
	public int findAllCanUsedResourceInfo(List<ResourceRecord> res) {
		List<ResourceRecord> tmpRes = resourceDAO.findIdsWithResourceInfoByState(0) ;
		for (ResourceRecord i : tmpRes) res.add(i) ;
		return 0;
	}

	//通过名字获取资源记录（分页）
	@Override
	public int findResourceRecordsByResourceNameInPage(String name, VoModel vo) {
		List<ResourceRecord> res = resourceDAO.findByNameInPage(name , vo.getCurrent() * vo.getSize() , vo.getSize()) ;
		long size = resourceDAO.getCountByName(name) ;
		vo.setTotal((int) size) ;
		vo.setModel(res) ;
		return 0 ;
	}

	//获取资源树信息
	@Override
	public int findAllResourceIdsWithResourceNameAndParentIdAndState(List<ResourceRecord> re) {
		List<ResourceRecord> tmpRes = resourceDAO.findAllRoleIdsWithRoleNameAndParentIdAndState() ;
		for(ResourceRecord i : tmpRes) re.add(i) ;
		return 0;
	}

	//添加资源
	@Override
	public int insertResource(ResourceRecord rec) {
		if (null == rec.getResourceCode()) return ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex() ;
		if (null == rec.getResourceName()) return ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex() ;
		if (null == rec.getResourceURL()) return ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex() ;
		if (null == rec.getResourceMethodType()) rec.setResourceMethodType(1);
		if (null == rec.getSystemId()) rec.setSystemId(1);
		if (null == rec.getState()) rec.setState(0);
		if (null == rec.getParentId()) rec.setParentId((long) 0) ;
		if (null == rec.getResourceMemo()) rec.setResourceMemo("");

		int err = resourceDAO.insertResource(rec) ;
		if (err == 0) return ErrorConst.ErrorType.RESULT_IS_EMPTY.getIndex() ;	//影响0行，是插入冲突，资源已存在，插入失败
		if (err == 1) return ErrorConst.ErrorType.NO_ERROR.getIndex() ;			//影响1行，是插入成功
		return ErrorConst.ErrorType.UNKOWN_ERROR.getIndex() ;					//未知错误
	}

	//删除资源
	@Override
	public int deleteResourceByResourceId(long resourceId) {
		if (resourceId <= 0) return ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex() ;

		//删除角色拥有该资源的关系
		authRoleHoldResourceDAO.deleteByResourceId(resourceId) ;

		int err = resourceDAO.deleteById(resourceId) ;
		if (err == 0) return ErrorConst.ErrorType.RESULT_IS_EMPTY.getIndex() ;	//影响0行，资源不存在
		if (err == 1) return ErrorConst.ErrorType.NO_ERROR.getIndex() ;			//影响1行，是删除成功
		//if (err > 1) return ErrorConst.ErrorType.SYSTEM_ERROR.getIndex() ;  	//影响多行，是系统错误
		return ErrorConst.ErrorType.UNKOWN_ERROR.getIndex() ;					//未知错误
	}

	//更新资源
	@Override
	public int updateResource(ResourceRecord rec) {
		//if (rec.getResourceId() <= 0) return insertResource(rec) ;
		if (rec.getResourceId() <= 0) return ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex() ;
		if (null == rec.getResourceCode()) return ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex() ;
		if (null == rec.getResourceName()) return ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex() ;
		if (null == rec.getResourceURL()) return ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex() ;
		if (null == rec.getResourceMethodType()) rec.setResourceMethodType(1);
		if (null == rec.getSystemId()) rec.setSystemId(1);
		if (null == rec.getState()) rec.setState(0);
		if (null == rec.getParentId()) rec.setParentId((long) 0) ;
		if (null == rec.getResourceMemo()) rec.setResourceMemo("");

		int err ;
		try {
			err = resourceDAO.updateResource(rec) ;
		} catch (DuplicateKeyException e) {
			return ErrorConst.ErrorType.RESULT_IS_EMPTY.getIndex() ;	//更新出现冲突
		}

		if (err == 0) return ErrorConst.ErrorType.RESULT_IS_EMPTY.getIndex() ;	//影响0行，更新记录不存在
		if (err == 1) return ErrorConst.ErrorType.NO_ERROR.getIndex() ;			//影响1行，是更新成功
		//if (err > 1) return ErrorConst.ErrorType.SYSTEM_ERROR.getIndex() ; 	//影响2行，是系统错误
		return ErrorConst.ErrorType.UNKOWN_ERROR.getIndex() ;					//未知错误
	}

	//更新用户所充当的角色
	@Override
	public int updateRelationUserPlayRoleByUserId(long userId, List<Integer> roleIds) {
		if (userId <= 0) return ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex() ;
		for(Integer i : roleIds) if (i <= 0) return ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex() ;

		//可用信息获取
		List<Integer> states = new ArrayList<>() ;
		findRoleIdsWithStateByRoleIds(roleIds , states) ;

		//获取现有充当角色
		List<Integer> currentRoleIds = new ArrayList<>() ;
		findRoleIdsByUserId(userId , currentRoleIds) ;

		//判断插入还是删除
		Set<Integer> addSet = new HashSet<>() ;
		Set<Integer> delSet = new HashSet<>() ;
		for(int i = 0 ; i < roleIds.size() ; i ++)
			if (0 == states.get(i)) addSet.add(roleIds.get(i)) ;
		for(Integer i : currentRoleIds) {
			if (addSet.contains(i)) { addSet.remove(i) ; continue ; }
			delSet.add(i) ;
		}
		List<Integer> addIds = new ArrayList<>() ;
		List<Integer> delIds = new ArrayList<>() ;
		for(Integer i : addSet) addIds.add(i) ;
		for(Integer i : delSet) delIds.add(i) ;

		//删除
		if (! delIds.isEmpty()) {
			int delErr = authUserPlayRoleDAO.deleteUserPlayRoles(userId, delIds);
			//if (delErr < delIds.size()) return ErrorConst.ErrorType.SYSTEM_ERROR.getIndex() ;	//删除数量少于预期，可能是同步问题
			if (delErr > delIds.size()) return ErrorConst.ErrorType.SYSTEM_ERROR.getIndex() ;	//删除数量大于预期，为系统错误
		}

		//插入
		for(Integer i : addIds) {
			int addErr = authUserPlayRoleDAO.insertByUserId(userId , i) ;
			if (1 == addErr) continue ;	//插入成功
			if (2 == addErr) continue ; //插入有冲突，更新了更新时间
			return ErrorConst.ErrorType.UNKOWN_ERROR.getIndex() ;
		}

		return ErrorConst.ErrorType.NO_ERROR.getIndex() ;
	}

	//获取用户充当的角色id和名称
	@Override
	public int findRoleIdsWithRoleNameByUserId(long userId, List<RoleRecord> re) {
		if (userId <= 0) return 1 ;

		//分两次查询
		List<Integer> roleIds = new ArrayList<>() ;
		findRoleIdsByUserId(userId , roleIds) ;
		List<String> names = new ArrayList<>() ;
		//findRoleIdsWithRoleNameByRoleIds(roleIds , names) ;
		findCanUsedRoleIdsWithRoleNameByRoleIds(roleIds, names) ;

		//录入
		for(int i = 0 ; i < roleIds.size() ; i ++) {
			if (roleIds.get(i) <= 0) continue ;
			if (names.get(i).isEmpty()) continue ;
			re.add(RoleRecord.builder().roleId(roleIds.get(i)).roleName(names.get(i)).build()) ;
		}

		return 0;
	}

	//通过ids获取角色名称
	@Override
	public int findRoleIdsWithRoleNameByRoleIds(List<Integer> roleIds, List<String> roleNames) {
		if (roleIds.isEmpty()) return 1 ;
		List<RoleRecord> tmpRes = roleDAO.findIdsWithRoleNameByIds(roleIds) ;

		//映射
		Map<Integer , String> id2NameMap = new HashMap<>() ;
		for(RoleRecord i : tmpRes) id2NameMap.put(i.getRoleId() , i.getRoleName()) ;

		//录入
		for(Integer i : roleIds) {
			String tmp = id2NameMap.get(i) ;
			roleNames.add(null == tmp ? "" : tmp) ;
		}

		return 0;
	}

	//通过ids获取可用的角色名称
	@Override
	public int findCanUsedRoleIdsWithRoleNameByRoleIds(List<Integer> roleIds, List<String> roleNames) {
		if (roleIds.isEmpty()) return 1 ;
		List<RoleRecord> tmpRes = roleDAO.findIdsWithRoleNameByIdsAndState(roleIds , 0) ;

		//映射
		Map<Integer , String> id2NameMap = new HashMap<>() ;
		for(RoleRecord i : tmpRes) id2NameMap.put(i.getRoleId() , i.getRoleName()) ;

		//录入
		List<Integer> tmpRoleIds = new ArrayList<>() ;
		for(Integer i : roleIds) tmpRoleIds.add(i) ;
		roleIds.clear();
		for(Integer i : tmpRoleIds) {
			String tmp = id2NameMap.get(i) ;
			if (null == tmp) continue ;
			roleIds.add(i) ;
			roleNames.add(tmp) ;
		}

		return 0;
	}

	//通过ids获取可用信息
	@Override
	public int findRoleIdsWithStateByRoleIds(List<Integer> roleIds, List<Integer> states) {
		if (roleIds.isEmpty()) return 1 ;
		List<RoleRecord> tmpRes = roleDAO.findIdsWithStateByIds(roleIds) ;

		//映射
		Map<Integer , Integer> id2StateMap = new HashMap<>() ;
		for(RoleRecord i : tmpRes) id2StateMap.put(i.getRoleId() , i.getState()) ;

		//录入
		for(Integer i : roleIds) {
			Integer tmp = id2StateMap.get(i) ;
			states.add(null == tmp ? 1 : tmp) ;
		}

		return 0;
	}

	//通过名字获取角色记录(分页)
	@Override
	public int findRoleRecordsByRoleNameInPage(String name, VoModel vo) {
		List<RoleRecord> res = roleDAO.findByNameInPage(name , vo.getCurrent() * vo.getSize() , vo.getSize()) ;
		int size = roleDAO.getRoleCountByRoleName(name) ;
		vo.setTotal(size) ;
		vo.setModel(res) ;
		return 0 ;
	}

	//获取角色树信息
	@Override
	public int findAllRoleIdsWithRoleNameAndParentIdAndState(List<RoleRecord> re) {
		List<RoleRecord> tmpRes = roleDAO.findAllRoleIdsWithRoleNameAndParentIdAndState() ;
		for(RoleRecord i : tmpRes) re.add(i) ;
		return 0;
	}

	//获取所有角色id和名称
	@Override
	public int findAllRoleIdsWithRoleName(List<RoleRecord> re) {
		List<RoleRecord> tmpRes = roleDAO.findAllRoleIdsWithRoleName() ;
		for(RoleRecord i : tmpRes) re.add(i) ;
		return 0;
	}

	//添加角色
	@Override
	public int insertRole(RoleRecord re) {
		if (null == re.getRoleCode()) return ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex() ;
		if (null == re.getRoleName()) return ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex() ;
		if (null == re.getState()) re.setState(0) ;		//默认可用
		if (null == re.getParentId()) re.setParentId(0) ;		//默认无父角色

		int err = roleDAO.insertRole(re) ;
		if (err == 0) return ErrorConst.ErrorType.RESULT_IS_EMPTY.getIndex() ;	//影响0行，是插入冲突，角色已存在，插入失败
		if (err == 1) return ErrorConst.ErrorType.NO_ERROR.getIndex() ;			//影响1行，是插入成功
		return ErrorConst.ErrorType.UNKOWN_ERROR.getIndex() ;					//未知错误
	}

	//通过角色id删除角色
	@Override
	public int deleteRoleByRoleId(int roleId) {
		if (roleId <= 0) return ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex() ;

		//删除该角色拥有的资源关系
		authRoleHoldResourceDAO.deleteByRoleId(roleId) ;
		//删除用户充当的该角色关系
		authUserPlayRoleDAO.deleteByRoleId(roleId) ;

		int err = roleDAO.deleteById(roleId) ;
		if (err == 0) return ErrorConst.ErrorType.RESULT_IS_EMPTY.getIndex() ;	//影响0行，角色不存在
		if (err == 1) return ErrorConst.ErrorType.NO_ERROR.getIndex() ;			//影响1行，是删除成功
		//if (err > 1) return ErrorConst.ErrorType.SYSTEM_ERROR.getIndex() ;  	//影响多行，是系统错误
		return ErrorConst.ErrorType.UNKOWN_ERROR.getIndex() ;					//未知错误
	}

	//通过角色id更新角色信息
	@Override
	public int updateRole(RoleRecord re) {
		//if (re.getRoleId() <= 0) return insertRole(re) ;
		if (re.getRoleId() <= 0) return ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex() ;
		if (null == re.getRoleCode()) return ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex() ;
		if (null == re.getRoleName()) return ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex() ;
		if (null == re.getState()) re.setState(0) ;
		if (null == re.getParentId()) re.setParentId(0) ;

		int err ;
		try {
			err = roleDAO.updateRole(re) ;
		} catch (DuplicateKeyException e) {
			return ErrorConst.ErrorType.RESULT_IS_EMPTY.getIndex() ;	//更新出现冲突
		}

		if (err == 0) return ErrorConst.ErrorType.RESULT_IS_EMPTY.getIndex() ;	//影响0行，更新记录不存在
		if (err == 1) return ErrorConst.ErrorType.NO_ERROR.getIndex() ;			//影响1行，是更新成功
		//if (err > 1) return ErrorConst.ErrorType.SYSTEM_ERROR.getIndex() ; 	//影响2行，是系统错误
		return ErrorConst.ErrorType.UNKOWN_ERROR.getIndex() ;					//未知错误
	}

	//通过资源ids获取资源记录
	@Override
	public int findResourceRecordByResourceIds(List<Long> resIds, List<ResourceRecord> res) {
		if (resIds.isEmpty()) return 1 ;

		List<ResourceRecord> tmpRes = resourceDAO.findByIds(resIds) ;

		for(ResourceRecord i : tmpRes) res.add(i) ;

		return 0;
	}

	//通过ids获取可用的资源记录
	@Override
	public int findCanUsedResourceRecordByResourceIds(List<Long> resIds, List<ResourceRecord> res) {
		if (resIds.isEmpty()) return 1 ;

		List<ResourceRecord> tmpRes = resourceDAO.findByIdsAndState(resIds, 0) ;

		for(ResourceRecord i : tmpRes) res.add(i) ;

		return 0;
	}

	//通过ids获取资源名称
	@Override
	public int findResourceIdsWithResourceNameByResourceIds(List<Long> resIds, List<String> resNames) {
		if (resIds.isEmpty()) return 1 ;
		List<ResourceRecord> tmpRes = resourceDAO.findIdsWithResourceNameByIds(resIds) ;

		//映射
		Map<Long , String> id2NameMap = new HashMap<>() ;
		for(ResourceRecord i : tmpRes) id2NameMap.put(i.getResourceId() , i.getResourceName()) ;

		//录入
		for(Long i : resIds) {
			String tmp = id2NameMap.get(i) ;
			resNames.add(null == tmp ? "" : tmp) ;
		}

		return 0;
	}

	//通过ids获取资源可用信息
	@Override
	public int findResourceIdsWithStateByResourceIds(List<Long> resIds, List<Integer> states) {
		if (resIds.isEmpty()) return 1 ;
		List<ResourceRecord> tmpRes = resourceDAO.findIdsWithStateByIds(resIds) ;

		//映射
		Map<Long , Integer> id2StateMap = new HashMap<>() ;
		for(ResourceRecord i : tmpRes) id2StateMap.put(i.getResourceId() , i.getState()) ;

		//录入
		for(Long i : resIds) {
			Integer tmp = id2StateMap.get(i) ;
			states.add(null == tmp ? 1 : tmp) ;
		}

		return 0;
	}

	//添加用户所充当的角色
	@Override
	public int insertRelationUserPlayRole(long userId, int roleId) {
		if (userId <= 0) return -1 ;
		if (roleId <= 0) return -1 ;
		return authUserPlayRoleDAO.insertByUserId(userId , roleId);
	}

	//删除用户对应的充当角色关系
	@Override
	public int deleteRelationUserPlayRoleByUserId(long userId) {
		if (userId <= 0) return 1 ;
		return authUserPlayRoleDAO.deleteByUserId(userId);
	}

	//删除用户充当角色关系
	@Override
	public int deleteRelationUserPlayRole(long relationId) {
		if (relationId <= 0) return 1 ;
		return authUserPlayRoleDAO.deleteById(relationId);
	}

	//获取所有角色持有资源关系信息
	@Override
	public int findAllRelationRoleHoldResource(Map<Integer, Set<Long>> roleId2ResourceIdsMap) {
		//获取关系列表
		List<AuthDTO> list = authRoleHoldResourceDAO.findAllRelationRoleHoldResource();
		if (CollectionUtils.isEmpty(list)) return 1 ;

		//录入映射
		for(AuthDTO i : list) {
			if (null == i.getDutyid()) continue ;
			if (null == i.getSourceid()) continue ;

			Set<Long> tmp = roleId2ResourceIdsMap.get(i.getDutyid()) ;
			if (null == tmp) tmp = new HashSet<>() ;
			tmp.add(i.getSourceid().longValue()) ;
			roleId2ResourceIdsMap.put(i.getDutyid() , tmp) ;
		}

		return 0;
	}

	//获取角色有权访问的资源id和名称
	@Override
	public int findResourceIdsWithResourceNameByRoleId(int roleId, List<ResourceRecord> re) {
		if (roleId <= 0) return 1 ;

		//分两次查询
		List<Long> resourceIds = new ArrayList<>() ;
		findResourceIdsByRoleIds(Lists.newArrayList(roleId) , resourceIds) ;
		List<String> names = new ArrayList<>() ;
		findResourceIdsWithResourceNameByResourceIds(resourceIds, names) ;

		//录入
		for(int i = 0 ; i < resourceIds.size() ; i ++) {
			if (resourceIds.get(i) <= 0) continue ;
			if (names.get(i).isEmpty()) continue ;
			re.add(ResourceRecord.builder().resourceId(resourceIds.get(i)).resourceName(names.get(i)).build()) ;
		}

		return 0;
	}

	//更新角色持有的资源
	@Override
	public int updateRelationRoleHoldResourceByRoleId(int roleId, List<Long> resourceIds) {
		if (roleId <= 0) return ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex() ;
		for(Long i : resourceIds) if (i <= 0) return ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex() ;

		//可用信息获取
		List<Integer> states = new ArrayList<>() ;
		findResourceIdsWithStateByResourceIds(resourceIds, states) ;

		//获取现持有资源
		List<Long> currentResourceIds = new ArrayList<>() ;
		findResourceIdsByRoleIds(Lists.newArrayList(roleId), currentResourceIds) ;

		//判断插入还是删除
		Set<Long> addSet = new HashSet<>() ;
		Set<Long> delSet = new HashSet<>() ;
		for(int i = 0 ; i < resourceIds.size() ; i ++)
			if (0 == states.get(i)) addSet.add(resourceIds.get(i)) ;
		for(Long i : currentResourceIds) {
			if (addSet.contains(i)) { addSet.remove(i) ; continue ; }
			delSet.add(i) ;
		}
		List<Long> addIds = new ArrayList<>() ;
		List<Long> delIds = new ArrayList<>() ;
		for(Long i : addSet) addIds.add(i) ;
		for(Long i : delSet) delIds.add(i) ;

		//删除
		if (! delIds.isEmpty()) {
			int delErr = authRoleHoldResourceDAO.deleteByRoleIdAndResourceIds(roleId , delIds) ;
			//if (delErr < delIds.size()) return ErrorConst.ErrorType.SYSTEM_ERROR.getIndex() ;	//删除数量少于预期，可能是同步问题
			if (delErr > delIds.size()) return ErrorConst.ErrorType.SYSTEM_ERROR.getIndex() ;	//删除数量大于预期，为系统错误
		}

		//插入
		for(Long i : addIds) {
			int addErr = authRoleHoldResourceDAO.insertRelation(roleId , i) ;
			if (1 == addErr) continue ;	//插入成功
			if (2 == addErr) continue ; //插入有冲突，更新了更新时间
			return ErrorConst.ErrorType.UNKOWN_ERROR.getIndex() ;
		}

		return ErrorConst.ErrorType.NO_ERROR.getIndex() ;
	}

	//添加角色持有的资源
	@Override
	public int insertRelationRoleHoldResource(int roleId, long resourceId) {
		if (roleId <= 0) return -1 ;
		if (resourceId <= 0) return -1 ;
		return authRoleHoldResourceDAO.insertRelation(roleId, resourceId);
	}

	//删除角色持有资源关系
	@Override
	public int deleteRelationRoleHoldResource(long relationId) {
		if (relationId <= 0) return 1 ;
		return authRoleHoldResourceDAO.deleteById(relationId) ;
	}

	//通过资源信息查找资源id
	@Override
	public long findIdByResourceInfo(String resourceURL, int resourceMethodType, int systemId) {
		List<Long> ids = resourceDAO.findIdByResourceInfo(resourceURL , resourceMethodType , systemId) ;
		return (ids.isEmpty() ? 0L : ids.get(0)) ;
	}

	//通过资源信息查找可用资源id
	@Override
	public long findCanUsedIdByResourceInfo(String resourceURL, int resourceMethodType, int systemId) {
		List<Long> ids = resourceDAO.findIdByResourceInfoAndState(resourceURL, resourceMethodType, systemId , 0) ;
		return (ids.isEmpty() ? 0L : ids.get(0)) ;
	}
}
