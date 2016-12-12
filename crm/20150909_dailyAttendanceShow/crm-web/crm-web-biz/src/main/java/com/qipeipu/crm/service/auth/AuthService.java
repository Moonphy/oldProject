package com.qipeipu.crm.service.auth;

import java.util.List;
import java.util.Map;
import java.util.Set;

import com.qipeipu.crm.dao.bean.ResourceRecord;
import com.qipeipu.crm.dao.bean.RoleRecord;
import com.qipeipu.crm.dtos.auth.AuthDTO;
import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.VoModel;

/**
 * 权限service
 */
public interface AuthService {
	/**
	 * 获取所有权限
	 *
	 * @return
	 */
	public List<AuthDTO> getAllAuth();

	/**
	 * 获取单个权限
	 * 
	 * @param dutyId
	 * @return
	 */
	public List<AuthDTO> getAuth(int dutyId);





	/**
	 * 通过id获取角色记录
	 * @param roleId 角色id
	 * @return 结果DTO
	 */
	public ResultDTO<RoleRecord> findRoleRecordByRoleId(int roleId);

	/**
	 * 通过ids获取角色名称
	 * @param roleIds 角色id列表
	 * @param roleNames 返回对应角色名称列表
	 * @return 错误信息
	 */
	public int findRoleIdsWithRoleNameByRoleIds(List<Integer> roleIds, List<String> roleNames);

	/**
	 * 通过ids获取可用的角色名称
	 * @param roleIds 角色id列表
	 * @param roleNames 返回对应角色名称列表
	 * @return 错误信息
	 */
	public int findCanUsedRoleIdsWithRoleNameByRoleIds(List<Integer> roleIds, List<String> roleNames);

	/**
	 * 通过ids获取可用信息
	 * @param roleIds 角色id列表
	 * @param states 返回对应的可用信息
	 * @return 错误信息
	 */
	public int findRoleIdsWithStateByRoleIds(List<Integer> roleIds, List<Integer> states);


	/**
	 * 通过名字获取角色记录(分页)
	 * @param name 角色名称
	 * @param vo 分页视图模型
	 * @return 错误信息
	 */
	int findRoleRecordsByRoleNameInPage(String name, VoModel vo);

	/**
	 * 获取角色树信息
	 * @param re 返回结果
	 * @return 错误信息
	 */
	int findAllRoleIdsWithRoleNameAndParentIdAndState(List<RoleRecord> re);

	/**
	 * 获取所有角色id和名称
	 * @param re 返回结果
	 * @return 错误信息
	 */
	int findAllRoleIdsWithRoleName(List<RoleRecord> re);

	/**
	 * 添加角色
	 * @param re 添加的角色记录
	 * @return 错误信息
	 */
	int insertRole(RoleRecord re);

	/**
	 * 通过角色id删除角色
	 * @param roleId 角色id
	 * @return 错误信息
	 */
	int deleteRoleByRoleId(int roleId);

	/**
	 * 更新角色信息
	 * @param re 更新的角色记录
	 * @return 错误信息
	 */
	int updateRole(RoleRecord re);




	/**
	 * 通过ids获取资源记录
	 * @param resIds 资源id列表
	 * @param res 返回对应资源名称列表
	 * @return 错误信息
	 */
	public int findResourceRecordByResourceIds(List<Long> resIds, List<ResourceRecord> res);

	/**
	 * 通过ids获取可用的资源记录
	 * @param resIds 资源id列表
	 * @param res 返回对应资源名称列表
	 * @return 错误信息
	 */
	public int findCanUsedResourceRecordByResourceIds(List<Long> resIds, List<ResourceRecord> res);

	/**
	 * 通过ids获取资源名称
	 * @param resIds 资源id列表
	 * @param resNames 返回对应资源名称列表
	 * @return 错误信息
	 */
	public int findResourceIdsWithResourceNameByResourceIds(List<Long> resIds, List<String> resNames);

	/**
	 * 通过ids获取资源可用信息
	 * @param resIds 资源ids
	 * @param states 返回对应资源可用信息列表
	 * @return 错误信息
	 */
	public int findResourceIdsWithStateByResourceIds(List<Long> resIds, List<Integer> states);

	/**
	 * 获取所有需要访问控制的资源信息
	 * @param res 返回资源信息列表
	 * @return 错误信息
	 */
	public int findAllCanUsedResourceInfo(List<ResourceRecord> res) ;

	/**
	 * 通过名字获取资源记录（分页）
	 * @param name 资源名称
	 * @param vo 分页视图模型
	 * @return 错误信息
	 */
	int findResourceRecordsByResourceNameInPage(String name, VoModel vo);

	/**
	 * 获取资源树信息
	 * @param re 返回资源记录
	 * @return 错误信息
	 */
	int findAllResourceIdsWithResourceNameAndParentIdAndState(List<ResourceRecord> re);

	/**
	 * 添加资源
	 * @param re 添加的资源记录
	 * @return 错误信息
	 */
	int insertResource(ResourceRecord re);

	/**
	 * 删除资源
	 * @param resourceId 资源id
	 * @return 错误信息
	 */
	int deleteResourceByResourceId(long resourceId);

	/**
	 * 更新资源
	 * @param re 更新的记录
	 * @return 错误信息
	 */
	int updateResource(ResourceRecord re);









	/**
	 * 获取用户充当的角色id
	 * @param userId 用户id
	 * @param roleIds 返回角色id列表
	 * @return 错误信息
	 */
	public int findRoleIdsByUserId(long userId , List<Integer> roleIds) ;


	/**
	 * 添加用户所充当的角色
	 * @param userId 用户id
	 * @param roleId 角色id
	 * @return 错误信息
	 */
	public int insertRelationUserPlayRole(long userId , int roleId) ;

	/**
	 * 更新用户所充当的角色
	 * @param userId 用户id
	 * @param roleIds 角色ids
	 * @return 错误信息
	 */
	public int updateRelationUserPlayRoleByUserId(long userId , List<Integer> roleIds) ;

	/**
	 * 获取用户充当的角色id和名称
	 * @param userId 用户id
	 * @param re 返回角色列表
	 * @return 错误信息
	 */
	public int findRoleIdsWithRoleNameByUserId(long userId, List<RoleRecord> re);

	/**
	 * 删除用户对应的充当角色关系
	 * @param userId 用户id
	 * @return 错误信息
	 */
	public int deleteRelationUserPlayRoleByUserId(long userId) ;

	/**
	 * 删除用户充当角色关系
	 * @param relationId 关系id
	 * @return 错误信息
	 */
	public int deleteRelationUserPlayRole(long relationId) ;







	/**
	 * 获取有权访问的资源id列表
	 * @param roleIds 角色id列表
	 * @param resourceIds 返回资源id列表
	 * @return 错误信息
	 */
	public int findResourceIdsByRoleIds(List<Integer> roleIds , List<Long> resourceIds) ;


	/**
	 * 获取所有角色持有资源关系信息
	 * @param roleId2ResourceIdsMap 返回角色持有资源关系映射
	 * @return 错误信息
	 */
	public int findAllRelationRoleHoldResource(Map<Integer, Set<Long>> roleId2ResourceIdsMap);

	/**
	 * 获取角色有权访问的资源id和名称
	 * @param roleId 角色id
	 * @param re 返回资源id列表
	 * @return 错误信息
	 */
	public int findResourceIdsWithResourceNameByRoleId(int roleId, List<ResourceRecord> re);

	/**
	 * 更新角色持有的资源
	 * @param roleId 角色id
	 * @param resourceIds 资源ids
	 * @return 错误信息
	 */
	public int updateRelationRoleHoldResourceByRoleId(int roleId, List<Long> resourceIds);

	/**
	 * 添加角色持有的资源
	 * @param roleId 角色id
	 * @param resourceId 资源id
	 * @return 错误信息
	 */
	public int insertRelationRoleHoldResource(int roleId, long resourceId);

	/**
	 * 删除角色持有资源关系
	 * @param relationId 关系id
	 * @return 错误信息
	 */
	public int deleteRelationRoleHoldResource(long relationId);

	/**
	 * 通过资源信息查找资源id
	 * @param resourceURL URL
	 * @param resourceMethodType 请求方法id
	 * @param systemId 系统id
	 * @return 资源id(0为找不到)
	 */
	public long findIdByResourceInfo(String resourceURL, int resourceMethodType, int systemId);

	/**
	 * 通过资源信息查找可用资源id
	 * @param resourceURL URL
	 * @param resourceMethodType 请求方法id
	 * @param systemId 系统id
	 * @return 资源id(0为找不到)
	 */
	public long findCanUsedIdByResourceInfo(String resourceURL, int resourceMethodType, int systemId);
}
