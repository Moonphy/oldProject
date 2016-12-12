package com.qipeipu.crm.transformer;

import com.qipeipu.crm.dao.bean.ResourceRecord;
import com.qipeipu.crm.dao.bean.RoleRecord;
import com.qipeipu.crm.dtos.auth.ResourceDTO;
import com.qipeipu.crm.dtos.auth.RoleDTO;
import com.qipeipu.crm.dtos.global.BeanTree;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.beanutils.ConvertUtils;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.beanutils.converters.SqlDateConverter;

import java.util.*;

/**
 * Created by Administrator:LiuJunyong on 2015/8/18.
 *
 */
public class AuthTransformer {
    //资源列表转换为资源树
    public static BeanTree<ResourceRecord> transformResourceList2ResourceTree(List<ResourceRecord> resourceRecords) {
        BeanTree<ResourceRecord> root = new BeanTree<>() ;
        root.setModel(new ResourceRecord());
        root.setSubTrees(new ArrayList<BeanTree<ResourceRecord>>());

        //建立映射
        Map<Long , BeanTree<ResourceRecord>> id2TreeMap = new HashMap<>() ;
        for(ResourceRecord i : resourceRecords) {
            if (i.getResourceId() <= 0) continue
                    ;
            BeanTree<ResourceRecord> tmp = new BeanTree<>() ;
            tmp.setModel(i);
            tmp.setSubTrees(new ArrayList<BeanTree<ResourceRecord>>());

            id2TreeMap.put(i.getResourceId() , tmp) ;
        }

        //构建树的父子关系
        for(ResourceRecord i : resourceRecords) {
            if (i.getResourceId() <= 0) continue ;
            BeanTree<ResourceRecord> node = id2TreeMap.get(i.getResourceId()) ;
            if (null == node) continue ;

            Long parentId = i.getParentId() ;
            BeanTree<ResourceRecord> parentNode = (null == parentId || parentId <= 0 ? root : id2TreeMap.get(parentId)) ;
            if (null == parentNode) parentNode = root ;

            parentNode.getSubTrees().add(node) ;
        }

        return root ;
    }

    //角色列表转换为角色树
    public static BeanTree<RoleRecord> transformRoleList2RoleTree(List<RoleRecord> roleRecords) {
        BeanTree<RoleRecord> root = new BeanTree<>() ;
        root.setModel(new RoleRecord());
        root.setSubTrees(new ArrayList<BeanTree<RoleRecord>>());

        //建立映射
        Map<Integer , BeanTree<RoleRecord>> id2TreeMap = new HashMap<>() ;
        for(RoleRecord i : roleRecords) {
            if (i.getRoleId() <= 0) continue ;

            BeanTree<RoleRecord> tmp = new BeanTree<>() ;
            tmp.setModel(i);
            tmp.setSubTrees(new ArrayList<BeanTree<RoleRecord>>());

            id2TreeMap.put(i.getRoleId() , tmp) ;
        }

        //构建树的父子关系
        for(RoleRecord i : roleRecords) {
            if (i.getRoleId() <= 0) continue ;
            BeanTree<RoleRecord> node = id2TreeMap.get(i.getRoleId());
            if (null == node) continue ;

            Integer parentId = i.getParentId() ;
            BeanTree<RoleRecord> parentNode = (null == parentId || parentId <= 0 ? root : id2TreeMap.get(parentId)) ;
            if (null == parentNode) parentNode = root ;

            parentNode.getSubTrees().add(node) ;
        }

        return root ;
    }

    //资源列表转换为资源DTO树
    public static ResourceDTO transformResourceRecord2ResourceDTO(List<ResourceRecord> resourceRecords ,
                                                                  List<Long> checkedResourceIds) throws Exception {
        ResourceDTO root = new ResourceDTO() ;
        root.setSubDTO(new ArrayList<ResourceDTO>());

        //建立isChecked信息
        Set<Long> checkedIdSet = new HashSet<>() ;
        for(Long i : checkedResourceIds) checkedIdSet.add(i) ;

        //建立映射和子节点
        Map<Long , ResourceDTO> id2DTOMap = new HashMap<>() ;
        for(ResourceRecord i : resourceRecords) {
            if (i.getResourceId() <= 0) continue ;

            ResourceDTO tmp = new ResourceDTO() ;
            PropertyUtils.copyProperties(tmp , i);
            tmp.setSubDTO(new ArrayList<ResourceDTO>());
            tmp.setIsChecked(checkedIdSet.contains(i.getResourceId()));

            id2DTOMap.put(i.getResourceId() , tmp) ;
        }

        //构建树的父子关系
        for(ResourceRecord i : resourceRecords) {
            if (i.getResourceId() <= 0) continue ;
            ResourceDTO node = id2DTOMap.get(i.getResourceId()) ;
            if (null == node) continue ;

            Long parentId = i.getParentId() ;
            ResourceDTO parentNode = (null == parentId || parentId <= 0 ? root : id2DTOMap.get(parentId)) ;
            if (null == parentNode) parentNode = root ;

            parentNode.getSubDTO().add(node) ;
        }

        return root ;
    }

    //角色列表转换为角色DTO树
    public static RoleDTO transformRoleRecord2RoleDTO(List<RoleRecord> roleRecords ,
                                                      List<Integer> checkedRoleIds) throws Exception  {
        RoleDTO root = new RoleDTO() ;
        root.setSubDTO(new ArrayList<RoleDTO>());

        //建立isChecked信息
        Set<Integer> checkedIdSet = new HashSet<>() ;
        for(Integer i : checkedRoleIds) checkedIdSet.add(i) ;

        //建立映射和子节点
        Map<Integer , RoleDTO> id2DTOMap = new HashMap<>() ;
        for(RoleRecord i : roleRecords) {
            if (i.getRoleId() <= 0) continue ;

            RoleDTO tmp = new RoleDTO() ;
            PropertyUtils.copyProperties(tmp , i);
            tmp.setSubDTO(new ArrayList<RoleDTO>());
            tmp.setIsChecked(checkedIdSet.contains(i.getRoleId()));

            id2DTOMap.put(i.getRoleId() , tmp) ;
        }

        //构建树的父子关系
        for(RoleRecord i : roleRecords) {
            if (i.getRoleId() <= 0) continue ;
            RoleDTO node = id2DTOMap.get(i.getRoleId());
            if (null == node) continue ;

            Integer parentId = i.getParentId() ;
            RoleDTO parentNode = (null == i.getParentId() || i.getParentId() <= 0 ? root : id2DTOMap.get(parentId)) ;
            if (null == parentNode) parentNode = root ;

            parentNode.getSubDTO().add(node) ;
        }

        return root ;
    }
}
