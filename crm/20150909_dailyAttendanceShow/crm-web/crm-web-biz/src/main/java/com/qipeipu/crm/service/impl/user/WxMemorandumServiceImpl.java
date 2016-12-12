package com.qipeipu.crm.service.impl.user;

import com.qipeipu.crm.dao.WxMemorandumDao;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.user.MemorandumEntity;
import com.qipeipu.crm.service.user.WxMemorandumService;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

/**
 * Created by Administrator on 2015/4/9.
 */
@Service
public class WxMemorandumServiceImpl implements WxMemorandumService {

    @Autowired
    private WxMemorandumDao wxMemorandumDao;

    @Override
    public void getMemorandumListByUserID(Integer userID, String searchKey, VoModel<?, ?> vo) {
        if(searchKey!=null&&!searchKey.trim().equals(""))
            searchKey = "'"+searchKey+"%'";
        List<MemorandumEntity> memorandumEntityList = wxMemorandumDao.getMemorandumListByUserID(userID,searchKey, vo);

        if (CollectionUtils.isEmpty(memorandumEntityList)) {
            memorandumEntityList = Collections.emptyList();
            vo.setTotal(0);
        } else {
            vo.setTotal(wxMemorandumDao.getMemorandumListCountByUserID(userID,searchKey));
        }
        vo.setModel(memorandumEntityList);
    }

    @Override
    public int delMemorandum(Integer noteID) {
        return wxMemorandumDao.delMemorandum(noteID);
    }

    @Override
    public List<MemorandumEntity> getMemorandumDetail(Integer noteID) {
        return wxMemorandumDao.getMemorandumDetail(noteID);
    }

    @Override
    public int createMemorandum(MemorandumEntity memorandumEntity) {
        return wxMemorandumDao.createMemorandum(memorandumEntity);
    }
}
