package com.qipeipu.crm.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.google.common.collect.Lists;
import com.qipeipu.crm.constant.ErrorConst;
import com.qipeipu.crm.constant.RequestMethodConst;
import com.qipeipu.crm.dao.bean.ResourceRecord;
import com.qipeipu.crm.dao.bean.RoleRecord;
import com.qipeipu.crm.dtos.auth.ResourceDTO;
import com.qipeipu.crm.dtos.auth.RoleDTO;
import com.qipeipu.crm.dtos.global.BeanTree;
import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.service.auth.AuthService;
import com.qipeipu.crm.session.UserSessionInfo;
import com.qipeipu.crm.session.auth.AuthManager;
import com.qipeipu.crm.session.bean.CrmSessionUser;
import com.qipeipu.crm.transformer.AuthTransformer;
import com.qipeipu.crm.utils.bean.tools.GUtils;
import com.qipeipu.crm.wx.util.ExceptionUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator:LiuJunyong on 2015/8/6.
 *
 */
@Slf4j
@Controller
@RequestMapping(value = "auth")
public class AuthController {
    @Autowired
    private AuthService authService ;

    //----------------------------------权限关系管理入口---------------------------------------------

    //获取用户充当的角色名称列表
    @RequestMapping(value = "find/userPlayRoleList", method = RequestMethod.GET)
    public void findRoleIdsWithNameByUserId(HttpServletResponse response , Long userId){
        try {
            if (null == userId) userId = (long) 0 ;
            List<RoleRecord> re = new ArrayList<>() ;

            authService.findRoleIdsWithRoleNameByUserId(userId, re) ;

            GUtils.responseJson(response, ResultDTO.successResult(re));
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }

    //更新用户所充当的角色(POST)
    @RequestMapping(value = "update/userPlayRole", method = RequestMethod.POST)
    public void updateUserPlayRole(HttpServletResponse response , Long userId , String rolesJson){
        try {
            //输入初始化
            if (null == userId) userId = 0L ;
            if (null == rolesJson) rolesJson = "[]" ;
            List<Integer> roleIds = Lists.newArrayList() ;
            JSONArray rolesJArr = JSON.parseArray(rolesJson);
            for (Object i : rolesJArr) {
                Integer tmp = (int) i;
                roleIds.add(tmp);
            }

            int err = authService.updateRelationUserPlayRoleByUserId(userId , roleIds) ;
            ResultDTO res ;
            if (err == ErrorConst.ErrorType.NO_ERROR.getIndex())
                res = ResultDTO.successResult("用户充当的角色修改成功") ;
            else if (err == ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex())
                res = ResultDTO.failResult(ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex(), "输入信息非法") ;
            else
                res = ResultDTO.failResult(ErrorConst.ErrorType.UNKOWN_ERROR.getIndex(), ErrorConst.ErrorType.UNKOWN_ERROR.getContext()) ;

            GUtils.responseJson(response, res);
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failed(ResultState.ERROR_CODE, "error"));
        }
    }

    //为用户添加角色(POST)
    @RequestMapping(value = "add/userPlayRole", method = RequestMethod.POST)
    public void addUserPlayRole(HttpServletResponse response , Long userId , Integer roleId){
        try {
            if (null == userId) userId = (long) 0 ;
            if (null == roleId) roleId = 0 ;
            authService.insertRelationUserPlayRole(userId, roleId) ;
            GUtils.responseJson(response, ResultDTO.successResult("添加成功"));
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }

    //为用户删除角色(POST)
    @RequestMapping(value = "del/userPlayRole", method = RequestMethod.POST)
    public void delUserPlayRole(HttpServletResponse response , Long relationId){
        try {
            if (null == relationId) relationId = (long) 0 ;
            authService.deleteRelationUserPlayRole(relationId);
            GUtils.responseJson(response, ResultDTO.successResult("删除成功"));
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }

    //获取角色有权访问的资源名称列表
    @RequestMapping(value = "find/roleHoldResourceList", method = RequestMethod.GET)
    public void findResourceIdsWithResourceNameByRoleId(HttpServletResponse response , Integer roleId){
        try {
            if (null == roleId) roleId = 0 ;
            List<ResourceRecord> re = new ArrayList<>() ;

            authService.findResourceIdsWithResourceNameByRoleId(roleId, re) ;

            GUtils.responseJson(response, ResultDTO.successResult(re));
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }

    //更新角色持有的资源(POST)
    @RequestMapping(value = "update/roleHoldResource", method = RequestMethod.POST)
    public void updateRoleHoldResource(HttpServletResponse response , Integer roleId , String resourcesJson){
        try {
            //输入初始化
            if (null == roleId) roleId = 0 ;
            if (null == resourcesJson) resourcesJson = "[]" ;
            List<Long> resourceIds = Lists.newArrayList() ;
            JSONArray resourcesJArr = JSON.parseArray(resourcesJson);
            for (Object i : resourcesJArr) {
                Long tmp = (long) ((int) i) ;
                resourceIds.add(tmp);
            }

            int err = authService.updateRelationRoleHoldResourceByRoleId(roleId, resourceIds) ;
            ResultDTO res ;
            if (err == ErrorConst.ErrorType.NO_ERROR.getIndex())
                res = ResultDTO.successResult("角色有权访问的资源修改成功") ;
            else if (err == ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex())
                res = ResultDTO.failResult(ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex(), "输入信息非法") ;
            else
                res = ResultDTO.failResult(ErrorConst.ErrorType.UNKOWN_ERROR.getIndex(), ErrorConst.ErrorType.UNKOWN_ERROR.getContext()) ;

            GUtils.responseJson(response, res);
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failed(ResultState.ERROR_CODE, "error"));
        }
    }

    //为角色添加资源权限(POST)
    @RequestMapping(value = "add/roleHoldResource", method = RequestMethod.POST)
    public void addRoleHoldResource(HttpServletResponse response , Integer roleId , Long resourceId){
        try {
            if (null == roleId) roleId = 0 ;
            if (null == resourceId) resourceId = (long) 0 ;
            authService.insertRelationRoleHoldResource(roleId, resourceId) ;
            GUtils.responseJson(response, ResultDTO.successResult("添加成功"));
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }

    //为角色删除资源权限(POST)
    @RequestMapping(value = "del/roleHoldResource", method = RequestMethod.POST)
    public void delRoleHoldResource(HttpServletResponse response , Long relationId){
        try {
            if (null == relationId) relationId = (long) 0 ;
            authService.deleteRelationRoleHoldResource(relationId);
            GUtils.responseJson(response, ResultDTO.successResult("删除成功"));
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }

    //----------------------------------权限对象管理入口---------------------------------------------

    //通过名字获取权限角色列表（分页）
    @RequestMapping(value = "find/roleList", method = RequestMethod.GET)
    public void findRolesByRoleName(HttpServletResponse response , VoModel vo , String name){
        try {
            if (null == name) name = "" ;
            authService.findRoleRecordsByRoleNameInPage(name, vo) ;
            GUtils.responseJson(response, ResultDTO.successResult(vo));
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }

    //通过id获取角色信息
    @RequestMapping(value = "edit/role", method = RequestMethod.GET)
    public void findRoleByRoleId(HttpServletResponse response , Integer roleId){
        try {
            if (null == roleId) roleId = 0 ;
            ResultDTO<RoleRecord> res = authService.findRoleRecordByRoleId(roleId) ;
            GUtils.responseJson(response, res) ;
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }

    //获取所有角色id和名称信息
    @RequestMapping(value = "find/AllRoleNameList", method = RequestMethod.GET)
    public void findAllRoleNames(HttpServletResponse response){
        try {
            List<RoleRecord> res = new ArrayList<>();
            authService.findAllRoleIdsWithRoleName(res) ;
            GUtils.responseJson(response, ResultDTO.successResult(res)) ;
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }

    //获取角色树
    @RequestMapping(value = "find/roleTree", method = RequestMethod.GET)
    public void findRoleTree(HttpServletResponse response , Long userId){
        try {
            //所有角色信息
            List<RoleRecord> re = new ArrayList<>() ;
            authService.findAllRoleIdsWithRoleNameAndParentIdAndState(re) ;

            //用户充当角色信息
            List<Integer> checkedRoleIds = new ArrayList<>() ;
            if (null != userId) authService.findRoleIdsByUserId(userId, checkedRoleIds) ;

            //建DTO树
            ResultDTO<RoleDTO> dto = ResultDTO.successResult(AuthTransformer.transformRoleRecord2RoleDTO(re , checkedRoleIds)) ;

            GUtils.responseAjaxWithResultDTO(response, dto);
        } catch (Exception e) {
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }

    //添加角色(POST)
    @RequestMapping(value = "add/role", method = RequestMethod.POST)
    public void addRole(HttpServletResponse response , RoleRecord rec){
        try {
            if (null == rec) rec = new RoleRecord() ;

            int err = authService.insertRole(rec) ;
            ResultDTO res ;
            if (err == ErrorConst.ErrorType.NO_ERROR.getIndex())
                res = ResultDTO.successResult("角色添加成功") ;
            else if (err == ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex())
                res = ResultDTO.failResult(ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex(), "角色信息非法") ;
            else if (err == ErrorConst.ErrorType.RESULT_IS_EMPTY.getIndex())
                res = ResultDTO.failResult(ErrorConst.ErrorType.RESULT_IS_EMPTY.getIndex(), "角色已存在") ;
            else
                res = ResultDTO.failResult(ErrorConst.ErrorType.UNKOWN_ERROR.getIndex(), ErrorConst.ErrorType.UNKOWN_ERROR.getContext()) ;

            GUtils.responseJson(response, res);
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error at 添加角色"));
        }
    }

    //删除角色(POST)
    @RequestMapping(value = "del/role", method = RequestMethod.POST)
    public void delRole(HttpServletResponse response , Integer roleId){
        try {
            if (null == roleId) roleId = 0 ;

            int err = authService.deleteRoleByRoleId(roleId) ;
            ResultDTO res ;
            if (err == ErrorConst.ErrorType.NO_ERROR.getIndex())
                res = ResultDTO.successResult("角色删除成功") ;
            else if (err == ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex())
                res = ResultDTO.failResult(ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex(), "角色id非法") ;
            else if (err == ErrorConst.ErrorType.RESULT_IS_EMPTY.getIndex())
                res = ResultDTO.failResult(ErrorConst.ErrorType.RESULT_IS_EMPTY.getIndex(), "角色不存在") ;
            else
                res = ResultDTO.failResult(ErrorConst.ErrorType.UNKOWN_ERROR.getIndex(), ErrorConst.ErrorType.UNKOWN_ERROR.getContext()) ;

            GUtils.responseJson(response, res);
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }

    //更新角色(POST)
    @RequestMapping(value = "update/role", method = RequestMethod.POST)
    public void updateRole(HttpServletResponse response , RoleRecord re){
        try {
            if (null == re) re = new RoleRecord() ;

            int err = authService.updateRole(re);
            ResultDTO res ;
            if (err == ErrorConst.ErrorType.NO_ERROR.getIndex())
                res = ResultDTO.successResult("角色更新成功") ;
            else if (err == ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex())
                res = ResultDTO.failResult(ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex(), "角色信息非法") ;
            else if (err == ErrorConst.ErrorType.RESULT_IS_EMPTY.getIndex())
                res = ResultDTO.failResult(ErrorConst.ErrorType.RESULT_IS_EMPTY.getIndex(), "找不到id对应的角色或更新有冲突") ;
            else
                res = ResultDTO.failResult(ErrorConst.ErrorType.UNKOWN_ERROR.getIndex(), ErrorConst.ErrorType.UNKOWN_ERROR.getContext()) ;

            GUtils.responseJson(response, res);
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }

    //通过名字获取资源列表（分页）
    @RequestMapping(value = "find/resourceList", method = RequestMethod.GET)
    public void findResourcesByResourceName(HttpServletResponse response , VoModel vo , String name){
        try {
            if (null == name) name = "" ;
            authService.findResourceRecordsByResourceNameInPage(name, vo) ;
            GUtils.responseJson(response, ResultDTO.successResult(vo));
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }

    //通过id获取资源信息
    @RequestMapping(value = "edit/resource", method = RequestMethod.GET)
    public void findResourceByResoucreId(HttpServletResponse response , Long resourceId){
        try {
            if (null == resourceId) resourceId = (long) 0 ;

            List<ResourceRecord> res = new ArrayList<>() ;
            authService.findResourceRecordByResourceIds(Lists.newArrayList(resourceId), res);
            GUtils.responseJson(response, ResultDTO.successResult(res));
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }

    //获取资源树
    @RequestMapping(value = "find/resourceTree", method = RequestMethod.GET)
    public void findResourceTree(HttpServletResponse response , Integer roleId){
        try {
            //所有资源信息
            List<ResourceRecord> re = new ArrayList<>() ;
            authService.findAllResourceIdsWithResourceNameAndParentIdAndState(re) ;

            //用户充当角色信息
            List<Long> checkedResourceIds = new ArrayList<>() ;
            if (null != roleId) authService.findResourceIdsByRoleIds(Lists.newArrayList(roleId) , checkedResourceIds) ;

            //建DTO树
            ResultDTO<ResourceDTO> dto = ResultDTO.successResult(AuthTransformer.transformResourceRecord2ResourceDTO(re , checkedResourceIds)) ;
            GUtils.responseAjaxWithResultDTO(response, dto);

        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }

    //添加资源(POST)
    @RequestMapping(value = "add/resource", method = RequestMethod.POST)
    public void addResource(HttpServletResponse response , ResourceRecord rec){
        try {
            if (null == rec) rec = new ResourceRecord() ;

            int err = authService.insertResource(rec) ;
            ResultDTO res ;
            if (err == ErrorConst.ErrorType.NO_ERROR.getIndex())
                res = ResultDTO.successResult("资源添加成功") ;
            else if (err == ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex())
                res = ResultDTO.failResult(ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex(), "资源信息非法") ;
            else if (err == ErrorConst.ErrorType.RESULT_IS_EMPTY.getIndex())
                res = ResultDTO.failResult(ErrorConst.ErrorType.RESULT_IS_EMPTY.getIndex(), "资源已存在") ;
            else
                res = ResultDTO.failResult(ErrorConst.ErrorType.UNKOWN_ERROR.getIndex(), ErrorConst.ErrorType.UNKOWN_ERROR.getContext()) ;

            GUtils.responseJson(response, res);
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }

    //删除资源(POST)
    @RequestMapping(value = "del/resource", method = RequestMethod.POST)
    public void delResource(HttpServletResponse response , Long resourceId){
        try {
            if (null == resourceId) resourceId = (long) 0 ;

            int err = authService.deleteResourceByResourceId(resourceId) ;
            ResultDTO res ;
            if (err == ErrorConst.ErrorType.NO_ERROR.getIndex())
                res = ResultDTO.successResult("资源删除成功") ;
            else if (err == ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex())
                res = ResultDTO.failResult(ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex(), "资源id非法") ;
            else if (err == ErrorConst.ErrorType.RESULT_IS_EMPTY.getIndex())
                res = ResultDTO.failResult(ErrorConst.ErrorType.RESULT_IS_EMPTY.getIndex(), "资源不存在") ;
            else
                res = ResultDTO.failResult(ErrorConst.ErrorType.UNKOWN_ERROR.getIndex(), ErrorConst.ErrorType.UNKOWN_ERROR.getContext()) ;

            GUtils.responseJson(response, res);
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }

    //更新资源(POST)
    @RequestMapping(value = "update/resource", method = RequestMethod.POST)
    public void updateResource(HttpServletResponse response , ResourceRecord rec){
        try {
            if (null == rec) rec = new ResourceRecord() ;

            int err = authService.updateResource(rec);
            ResultDTO res ;
            if (err == ErrorConst.ErrorType.NO_ERROR.getIndex())
                res = ResultDTO.successResult("资源更新成功") ;
            else if (err == ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex())
                res = ResultDTO.failResult(ErrorConst.ErrorType.ILLEGAL_ARGS.getIndex(), "资源信息非法") ;
            else if (err == ErrorConst.ErrorType.RESULT_IS_EMPTY.getIndex())
                res = ResultDTO.failResult(ErrorConst.ErrorType.RESULT_IS_EMPTY.getIndex(), "找不到id对应的资源或更新有冲突") ;
            else
                res = ResultDTO.failResult(ErrorConst.ErrorType.UNKOWN_ERROR.getIndex(), ErrorConst.ErrorType.UNKOWN_ERROR.getContext()) ;

            GUtils.responseJson(response, res);
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }

}
