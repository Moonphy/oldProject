package com.qipeipu.crm.service.user;

import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.user.MemorandumEntity;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/9.
 */
public interface WxMemorandumService {

    /**
     * 分页获取备忘录列表
     * @param userID
     * @param searchKey
     * @param vo
     * @return
     */
    public void getMemorandumListByUserID(Integer userID, String searchKey, VoModel<?, ?> vo);

    /**
     * 删除备忘录
     * @param noteID
     * @return
     */
    public int delMemorandum(Integer noteID);

    /**
     * 查询备忘录详情
     * @param noteID
     * @return
     */
    public List<MemorandumEntity> getMemorandumDetail(Integer noteID);

    /**
     * 添加备忘录
     * @param memorandumEntity
     * @return
     */
    public int createMemorandum(MemorandumEntity memorandumEntity);


}
