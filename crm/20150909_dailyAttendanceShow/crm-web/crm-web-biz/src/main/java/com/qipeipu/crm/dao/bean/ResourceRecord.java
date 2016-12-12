package com.qipeipu.crm.dao.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

import java.io.Serializable;
import java.util.Date;

/**
 * Created by Administrator:LiuJunyong on 2015/8/5.
 *
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceRecord implements Serializable {
    private static final long serialVersionUID = 5908198346665781489L;
    //资源id(自增长主键)
    private long resourceId = 0 ;

    //更新时间(自更新)
    private Date updateTime ;

    //创建时间
    private Date createTime ;

    //资源编码
    private String resourceCode ;

    //资源名称
    private String resourceName ;

    //资源请求URL
    private String resourceURL ;

    //资源请求的方法(0:未知,1:HTTP_GET,2:HTTP_POST)
    private Integer resourceMethodType ;

    //所属系统id(0:无所属系统id,1:CRM系统)
    private Integer systemId ;

    //资源状态(0:可用,1:不可用)
    private Integer state ;

    //父资源id(0:无父资源id)
    private Long parentId ;

    //资源描述
    private String resourceMemo ;

    protected boolean canEqual(Object other) {
        return other instanceof ResourceRecord;
    }

    //完整的equal写法
//    @Override
//    public boolean equals(Object o) {
//        if (o == this) return true;
//        if (!(o instanceof ResourceRecord)) return false;
//        ResourceRecord other = (ResourceRecord) o;
//        if (!other.canEqual(this)) return false;
//
//        if (this.getResourceId() != other.getResourceId()) return false;
//        if (this.getUpdateTime() == null ? other.getUpdateTime() != null : !this.getUpdateTime().equals(other.getUpdateTime())) return false;
//        if (this.getCreateTime() == null ? other.getCreateTime() != null : !this.getCreateTime().equals(other.getCreateTime())) return false;
//        if (this.getResourceCode() == null ? other.getResourceCode() != null : !this.getResourceCode().equals(other.getResourceCode())) return false;
//        if (this.getResourceName() == null ? other.getResourceName() != null : !this.getResourceName().equals(other.getResourceName())) return false;
//        if (this.getResourceURL() == null ? other.getResourceURL() != null : !this.getResourceURL().equals(other.getResourceURL())) return false;
//        if (this.getResourceMethodType() == null ? other.getResourceMethodType() != null : !this.getResourceMethodType().equals(other.getResourceMethodType())) return false;
//        if (this.getSystemId() == null ? other.getSystemId() != null : !this.getSystemId().equals(other.getSystemId())) return false;
//        if (this.getState() == null ? other.getState() != null : !this.getState().equals(other.getState())) return false;
//        if (this.getParentId() == null ? other.getParentId() != null : !this.getParentId().equals(other.getParentId())) return false;
//        if (this.getResourceMemo() == null ? other.getResourceMemo() != null : !this.getResourceMemo().equals(other.getResourceMemo())) return false;
//
//        return true;
//    }
}
