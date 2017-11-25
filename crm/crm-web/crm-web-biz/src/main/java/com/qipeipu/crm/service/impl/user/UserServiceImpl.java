package com.qipeipu.crm.service.impl.user;

import com.qipeipu.crm.dao.*;
import com.qipeipu.crm.dao.bean.ResourceRecord;
import com.qipeipu.crm.dtos.user.*;
import com.qipeipu.crm.service.auth.AuthService;
import com.qipeipu.crm.service.user.UserService;
import com.qipeipu.crm.transformer.AuthTransformer;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by johnkim on 15-2-5.
 */
@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserDao userDao;
	@Autowired
	private DepartDao departDao;
	@Autowired
	private UserDepartDao userDepartDao;
	@Autowired
	private UserAreaDao userAreaDao;


	@Autowired
	private AuthService authService ;

	@Override
	public List<UserMaintainEntity> findUserByKey(String key){
		List<UserMaintainEntity> userMaintainEntityList = new ArrayList<>();
 		if(key!=null&&!key.trim().equals("")){
			userMaintainEntityList = userDao.getAllUser(key);
			System.out.println(userMaintainEntityList.size());
		}
		return userMaintainEntityList;
	}


	@Override
	public UserDTO login(UserDTO user) {
		List<UserDTO> list = userDao.login(user);
		if (!CollectionUtils.isEmpty(list)) {
			//获取到用户在数据库的记录
			UserDTO tmp = list.get(0) ;

			//用户的area
			UserAreaEntity area = userAreaDao.findByUserId(tmp.getUserId());
			if (area != null) {
				tmp.setAreaId(area.getAreaId());
			} else {
				tmp.setAreaId(0);
			}

			//用户实际的职称（暂时不用放在session里面）
			//List<Integer> dutyIds = userDutyDao.findByUserId(tmp.getUserId());

			//用户充当的roleids和roleNames
			List<Integer> roleIds = new ArrayList<>() ;
			authService.findRoleIdsByUserId(tmp.getUserId(), roleIds) ;
			List<String> roleNames = new ArrayList<>();
			authService.findCanUsedRoleIdsWithRoleNameByRoleIds(roleIds, roleNames) ;
			tmp.setDutyIds(roleIds);
			tmp.setDutyNames(roleNames);

			//用户有权访问的resourceIds和信息
			List<Long> resIds = new ArrayList<>() ;
			authService.findResourceIdsByRoleIds(roleIds, resIds) ;
//			List<String> resNames = new ArrayList<>();
//			authService.findResourceIdsWithResourceNameByResourceIds(resIds , resNames) ;
			List<ResourceRecord> tmpRes = new ArrayList<>();
			authService.findCanUsedResourceRecordByResourceIds(resIds, tmpRes);
			List<ResourceRecord> res = new ArrayList<>();
			for(ResourceRecord i : tmpRes) {
				res.add(ResourceRecord.builder()
						.resourceId(i.getResourceId())
						.resourceName(i.getResourceName())
						.resourceURL(i.getResourceURL())
						.parentId(i.getParentId())
						.build());
			}
//			tmp.setResourceIds(resIds) ;
//			tmp.setResourceNames(resNames);
			tmp.setResources(res);
			tmp.setResourceTree(AuthTransformer.transformResourceList2ResourceTree(res));

			return tmp;
		}
		return null;
	}

	@Override
	public boolean resetPwd(UserDTO user) {
		int row = userDao.resetPwd(user);
		return row > 0;
	}

	@Override
	public List<UserDTO> findUser(UserDTO user) {
		return userDao.findUser(user);
	}

	@Override
	public UserDTO findUserDtl(Integer userId) {
		return userDao.findeUserDtl(userId);
	}

	@Override
	public UserDTO isExistOpenId(String openId) {
		return userDao.isExistOpenId(openId);
	}

	@Override
	public Integer bindWx(Integer userId, String openId) {
		return userDao.updateBindWx(userId, openId);
	}

	@Override
	public UserWxDTO findUserWx(Integer userId) {
		UserWxDTO wx = UserWxDTO.builder().build();

		UserDepartDTO userDepart = userDepartDao.getUserDepart(userId);
		if (userDepart != null) {
			DepartDTO depart = departDao.getDepartName(userDepart.getDeptId());
			if (depart != null) {
				wx.setDeptId(depart.getDeptId());
				wx.setDeptName(depart.getDeptName());
			}
		}

		return wx;
	}

	@Override
	public Integer editPwd(Integer userId, String oldPwd, String newPwd) {
		return userDao.editPwd(userId, oldPwd, newPwd);
	}

	@Override
	public Integer editInfo(Integer userId, UserWxDTO userInfo) {
		if (userInfo.getDeptId() > 0) {
			Integer result = userDepartDao.updateUserDepart(userId,
					userInfo.getDeptId());
			if (result == null || result <= 0) {
				userDepartDao.addUserDepart(userId, userInfo.getDeptId());
			}
		}
		return userDao.editInfo(userId, userInfo);
	}

	@Override
	public List<DepartDTO> getDepartList() {
		return userDao.getDepartList();
	}
}
