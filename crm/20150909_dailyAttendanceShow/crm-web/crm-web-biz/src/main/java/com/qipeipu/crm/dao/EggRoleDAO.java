package com.qipeipu.crm.dao;

import com.qipeipu.crm.dao.bean.EggRoleRecord;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * Created by Administrator:LiuJunyong on 2015/7/29.
 *
 */
public interface EggRoleDAO {
    //根据等级查规则记录
    @Select(" SELECT * FROM egg_role er WHERE er.`level` = #{level} ")
    public EggRoleRecord findByLevel(@Param("level") Integer level) ;

    //获取所有砸蛋等级信息
    @Select(" SELECT er.level,er.ruleName FROM egg_role er ")
    public List<EggRoleRecord> findAllEggRoleLevelAndEggRoleName() ;
}
