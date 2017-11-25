package com.qipeipu.crm.dao;

import com.qipeipu.crm.dao.bean.ResourceRecord;
import com.qipeipu.crm.dao.bean.RoleRecord;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * Created by Administrator:LiuJunyong on 2015/8/5.
 *
 */
public interface ResourceDAO {
    //通过资源信息获取id
    @Select(" SELECT r.resourceId " +
            " FROM btl_resource r " +
            " WHERE r.resourceURL = #{resourceURL} " +
                " AND r.resourceMethodType = #{resourceMethodType} " +
                " AND r.systemId = #{systemId} ")
    public List<Long> findIdByResourceInfo(@Param("resourceURL") String resourceURL,
                                           @Param("resourceMethodType") int resourceMethodType,
                                           @Param("systemId") int systemId) ;

    //通过资源信息和可用性获取可用id
    @Select(" SELECT r.resourceId " +
            " FROM btl_resource r " +
            " WHERE r.resourceURL = #{resourceURL} " +
            " AND r.resourceMethodType = #{resourceMethodType} " +
            " AND r.systemId = #{systemId} " +
            " AND r.state = #{state} ")
    public List<Long> findIdByResourceInfoAndState(@Param("resourceURL") String resourceURL,
                                                   @Param("resourceMethodType") int resourceMethodType,
                                                   @Param("systemId") int systemId,
                                                   @Param("state") int state) ;

    //通过ids获取资源记录
    @Select({"<script>" ,
                " SELECT * ",
                " FROM btl_resource r ",
                " WHERE r.resourceId IN ",
                    "<foreach item='id' index='index' collection='ids' open='(' separator=',' close=')'>",
                        "#{id}",
                    "</foreach>",
            "</script>"})
    public List<ResourceRecord> findByIds(@Param("ids") List<Long> ids) ;

    //通过ids获取可用的资源记录
    @Select({"<script>" ,
                " SELECT * ",
                " FROM btl_resource r ",
                " WHERE r.state = #{state} ",
                    " AND r.resourceId IN ",
                        "<foreach item='id' index='index' collection='ids' open='(' separator=',' close=')'>",
                            "#{id}",
                        "</foreach>",
            "</script>"})
    public List<ResourceRecord> findByIdsAndState(@Param("ids") List<Long> ids , @Param("state") int state) ;

    //通过ids获取资源信息
    @Select({"<script>" ,
                " SELECT r.resourceId , r.resourceURL , r.resourceMethodType , r.systemId ",
                " FROM btl_resource r ",
                " WHERE r.resourceId IN ",
                    "<foreach item='id' index='index' collection='ids' open='(' separator=',' close=')'>",
                        "#{id}",
                    "</foreach>",
            "</script>"})
    public List<ResourceRecord> findIdsWithResourceInfosByIds(@Param("ids") List<Long> ids) ;

    //通过ids获取资源名称
    @Select({"<script>" ,
                " SELECT r.resourceId , r.resourceName ",
                " FROM btl_resource r ",
                " WHERE r.resourceId IN ",
                    "<foreach item='id' index='index' collection='ids' open='(' separator=',' close=')'>",
                        "#{id}",
                    "</foreach>",
            "</script>"})
    public List<ResourceRecord> findIdsWithResourceNameByIds(@Param("ids") List<Long> ids) ;

    //通过ids获取资源可用信息
    @Select({"<script>" ,
                " SELECT r.resourceId , r.state ",
                " FROM btl_resource r ",
                " WHERE r.resourceId IN ",
                    "<foreach item='id' index='index' collection='ids' open='(' separator=',' close=')'>",
                        "#{id}",
                    "</foreach>",
            "</script>"})
    public List<ResourceRecord> findIdsWithStateByIds(@Param("ids") List<Long> ids) ;


    //获取所有处于某种状态下的资源信息
    @Select(" SELECT r.resourceId , r.resourceURL , r.resourceMethodType , r.systemId " +
            " FROM btl_resource r " +
            " WHERE r.state = #{state} ")
    public List<ResourceRecord> findIdsWithResourceInfoByState(@Param("state") int state) ;

    //通过名字获取资源记录（分页）
    @Select(" SELECT * " +
            " FROM btl_resource r " +
            " WHERE r.resourceName LIKE CONCAT('%' , #{name} , '%') " +
            " LIMIT ${skip},${size} ")
    public List<ResourceRecord> findByNameInPage(@Param("name") String name,
                                                 @Param("skip") int skip,
                                                 @Param("size") int size);
    //通过名字获取资源数
    @Select(" SELECT count(1) " +
            " FROM btl_resource r " +
            " WHERE r.resourceName LIKE CONCAT('%' , #{name} , '%') ")
    long getCountByName(@Param("name") String name);


    //获取资源树信息
    @Select("SELECT r.resourceId , r.resourceName , r.parentId , r.state FROM btl_resource r")
    public List<ResourceRecord> findAllRoleIdsWithRoleNameAndParentIdAndState() ;

    //添加资源
    @Insert(" INSERT IGNORE INTO btl_resource(createTime , resourceCode , resourceName , resourceURL , resourceMethodType , systemId , state , parentId , resourceMemo) " +
            " VALUES(now() , #{re.resourceCode} , #{re.resourceName} , #{re.resourceURL} , #{re.resourceMethodType} , #{re.systemId} , #{re.state} , #{re.parentId} , #{re.resourceMemo}) ")
    public int insertResource(@Param("re") ResourceRecord re);

    //删除资源
    @Delete("DELETE FROM btl_resource WHERE resourceId=#{resourceId}")
    public int deleteById(@Param("resourceId") long resourceId);

    //更新资源
    @Update("UPDATE btl_resource SET " +
                " resourceCode = #{re.resourceCode} , " +
                " resourceName = #{re.resourceName} , " +
                " resourceURL = #{re.resourceURL} , " +
                " resourceMethodType = #{re.resourceMethodType} , " +
                " systemId = #{re.systemId} , " +
                " state = #{re.state} , " +
                " parentId = #{re.parentId} , " +
                " resourceMemo = #{re.resourceMemo} " +
            " WHERE resourceId = #{re.resourceId}")
    public int updateResource(@Param("re") ResourceRecord re);

}
