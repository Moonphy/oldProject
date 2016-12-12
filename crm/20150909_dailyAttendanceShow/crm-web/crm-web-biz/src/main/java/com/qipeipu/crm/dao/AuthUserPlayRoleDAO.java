package com.qipeipu.crm.dao;

import com.qipeipu.crm.dao.bean.RoleRecord;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * Created by Administrator:LiuJunyong on 2015/8/5.
 *
 */
public interface AuthUserPlayRoleDAO {
    //获取用户充当的角色的ids
    @Select(" SELECT aupr.roleId FROM btl_auth_user_play_role aupr WHERE aupr.userId=#{userId}")
    List<Integer> findRoleIdsByUserId(@Param("userId") long userId);

    //更新用户所充当的角色
    @Update("UPDATE btl_auth_user_play_role SET roleId = #{roleId} , updateTime = now() WHERE userId = #{userId}")
    public int updateByUserId(@Param("userId") long userId, @Param("roleId") int roleId);

    //添加用户所充当的角色
    @Insert("INSERT INTO btl_auth_user_play_role(`createTime` , `userId` , `roleId`)" +
            "VALUES (now() , #{userId} , #{roleId})" +
            "ON DUPLICATE KEY UPDATE updateTime = now()")
    public int insertByUserId(@Param("userId") long userId, @Param("roleId") int roleId) ;

    //删除用户对应的充当角色关系
    @Delete("DELETE FROM btl_auth_user_play_role WHERE userId=#{userId}")
    public int deleteByUserId(@Param("userId") long userId) ;

    //删除对应id的关系
    @Delete("DELETE FROM btl_auth_user_play_role WHERE relationId=#{relationId}")
    public int deleteById(@Param("relationId") long relationId) ;

    //删除用户充当指定角色的关系
    @Delete("DELETE FROM btl_auth_user_play_role WHERE roleId=#{roleId}")
    public int deleteByRoleId(@Param("roleId") int roleId) ;

    //删除指定用户的指定角色s
    @Delete({"<script>" ,
                " DELETE FROM btl_auth_user_play_role ",
                " WHERE userId = #{userId} " ,
                    " AND roleId IN ",
                        "<foreach item='roleId' index='index' collection='roleIds' open='(' separator=',' close=')'>",
                            "#{roleId}",
                        "</foreach>",
            "</script>"})
    public int deleteUserPlayRoles(@Param("userId") long userId, @Param("roleIds") List<Integer> roleIds);
}
