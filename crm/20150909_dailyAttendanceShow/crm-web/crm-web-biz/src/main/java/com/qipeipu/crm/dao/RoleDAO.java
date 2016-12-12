package com.qipeipu.crm.dao;

import com.qipeipu.crm.dao.bean.RoleRecord;
import com.qipeipu.crm.dtos.user.DutyEntity;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/9.
 */
public interface RoleDAO {
    //获取所有角色信息
    @Results(value = {
            @Result(column = "roleId", property = "dutyID"),
            @Result(column = "roleName", property = "dutyName"),
            @Result(column = "createTime", property = "createTime"),
            @Result(column = "updateTime", property = "updateTime")
    })
    @Select("SELECT r.roleId , r.roleName , r.createTime , r.updateTime FROM btl_role r WHERE r.state = 0")
    public List<DutyEntity> getDutyList();


    //通过ids获取角色记录
    @Select({"<script>" ,
                " SELECT * ",
                " FROM btl_role r ",
                " WHERE r.roleId IN ",
                    "<foreach item='id' index='index' collection='ids' open='(' separator=',' close=')'>",
                        "#{id}",
                    "</foreach>",
            "</script>"})
    public List<RoleRecord> findByIds(@Param("ids") List<Integer> ids);


    //通过ids获取角色名称
    @Select({"<script>" ,
                " SELECT r.roleId , r.roleName ",
                " FROM btl_role r ",
                " WHERE r.roleId IN ",
                    "<foreach item='id' index='index' collection='ids' open='(' separator=',' close=')'>",
                        "#{id}",
                    "</foreach>",
            "</script>"})
    public List<RoleRecord> findIdsWithRoleNameByIds(@Param("ids") List<Integer> ids);

    //通过ids获取可用的角色名称
    @Select({"<script>" ,
                " SELECT r.roleId , r.roleName " ,
                " FROM btl_role r " ,
                " WHERE r.state = #{state} " ,
                    " AND r.roleId IN " ,
                        "<foreach item='id' index='index' collection='ids' open='(' separator=',' close=')'>" ,
                            "#{id}" ,
                        "</foreach>" ,
            "</script>"})
    public List<RoleRecord> findIdsWithRoleNameByIdsAndState(@Param("ids") List<Integer> ids , @Param("state") int state);

    //通过ids获取可用信息
    @Select({"<script>" ,
                " SELECT r.roleId , r.state ",
                " FROM btl_role r ",
                " WHERE r.roleId IN ",
                    "<foreach item='id' index='index' collection='ids' open='(' separator=',' close=')'>",
                        "#{id}",
                    "</foreach>",
            "</script>"})
    public List<RoleRecord> findIdsWithStateByIds(@Param("ids") List<Integer> ids);

    //通过名字获取角色记录(分页)
    @Select(" SELECT * " +
            " FROM btl_role r " +
            " WHERE r.roleName LIKE CONCAT('%' , #{name} , '%') " +
            " LIMIT ${skip},${size} ")
    public List<RoleRecord> findByNameInPage(@Param("name") String name,
                                             @Param("skip") int skip,
                                             @Param("size") int size);
    //通过名字获取角色数
    @Select(" SELECT count(1) " +
            " FROM btl_role r " +
            " WHERE r.roleName LIKE CONCAT('%' , #{name} , '%') ")
    public int getRoleCountByRoleName(@Param("name") String name);

    //获取所有角色id和名称
    @Select(" SELECT r.roleId , r.roleName FROM btl_role r ")
    public List<RoleRecord> findAllRoleIdsWithRoleName() ;

    //获取角色树信息
    @Select("SELECT r.roleId , r.roleName , r.parentId , r.state FROM btl_role r")
    public List<RoleRecord> findAllRoleIdsWithRoleNameAndParentIdAndState() ;

    @Insert(" INSERT IGNORE INTO btl_role(createTime , roleCode , roleName , state , parentId) " +
            " VALUES(now() , #{re.roleCode} , #{re.roleName} , #{re.state} , #{re.parentId}) ")
    public int insertRole(@Param("re") RoleRecord re);

    //通过id删除角色
    @Delete("DELETE FROM btl_role WHERE roleId=#{roleId}")
    public int deleteById(@Param("roleId") int roleId);

    //更新角色信息
    @Update(" UPDATE btl_role SET " +
                " roleName = #{re.roleName} , " +
                " roleCode = #{re.roleCode} , " +
                " state = #{re.state} , " +
                " parentId = #{re.parentId} " +
            " WHERE roleId = #{re.roleId}")
    public int updateRole(@Param("re") RoleRecord re);

}
