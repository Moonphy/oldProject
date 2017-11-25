package com.qipeipu.crm.dao;

import com.qipeipu.crm.dtos.auth.AuthDTO;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * Created by Administrator:LiuJunyong on 2015/8/5.
 *
 */
public interface AuthRoleHoldResourceDAO {
    //通过角色ids获取能访问的资源ids
    @Select({"<script>" ,
                " SELECT arhr.resourceId ",
                " FROM btl_auth_role_hold_resource arhr ",
                " WHERE arhr.roleId IN ",
                    "<foreach item='roleId' index='index' collection='roleIds' open='(' separator=',' close=')'>",
                        "#{roleId}",
                    "</foreach>",
                " GROUP BY arhr.resourceId ",
            "</script>"})
    public List<Long> findResourceIdsByRoleIds(@Param("roleIds") List<Integer> roleIds) ;

    //获取所有角色访问资源关系
    @Select("SELECT arhr.roleId dutyid , arhr.resourceId sourceid FROM btl_auth_role_hold_resource arhr")
    public List<AuthDTO> findAllRelationRoleHoldResource();

    //添加角色持有的资源
    @Insert("INSERT INTO btl_auth_role_hold_resource(`createTime` , `roleId` , `resourceId`)" +
            "VALUES (now() , #{roleId} , #{resourceId})" +
            "ON DUPLICATE KEY UPDATE updateTime = now()")
    public int insertRelation(@Param("roleId") int roleId , @Param("resourceId") long resourceId) ;

    //删除对应id的关系
    @Delete("DELETE FROM btl_auth_role_hold_resource WHERE relationId=#{relationId}")
    public int deleteById(@Param("relationId") long relationId) ;

    //删除指定角色持有资源的关系
    @Delete("DELETE FROM btl_auth_role_hold_resource WHERE roleId=#{roleId}")
    public int deleteByRoleId(@Param("roleId") int roleId) ;

    //删除角色持有指定资源的关系
    @Delete("DELETE FROM btl_auth_role_hold_resource WHERE resourceId=#{resourceId}")
    public int deleteByResourceId(@Param("resourceId") long resourceId) ;

    //删除指定角色的指定资源s
    @Delete({"<script>" ,
                " DELETE FROM btl_auth_role_hold_resource ",
                " WHERE roleId = #{roleId} " ,
                    " AND resourceId IN ",
                        "<foreach item='resourceId' index='index' collection='resourceIds' open='(' separator=',' close=')'>",
                            "#{resourceId}",
                        "</foreach>",
            "</script>"})
    public int deleteByRoleIdAndResourceIds(@Param("roleId") int roleId, @Param("resourceIds") List<Long> resourceIds);
}
