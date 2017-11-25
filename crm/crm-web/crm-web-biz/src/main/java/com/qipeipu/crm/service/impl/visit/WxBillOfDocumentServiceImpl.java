package com.qipeipu.crm.service.impl.visit;

import com.baturu.carvin.dtos.CarTypeDTO;
import com.baturu.carvin.service.CarTypeService;
import com.google.common.collect.Lists;
import com.qipeipu.crm.dao.*;
import com.qipeipu.crm.dao.statistics.QpStockSnapshotDao;
import com.qipeipu.crm.dao.statistics.QpuUserDao;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.visit.*;
import com.qipeipu.crm.service.auth.AuthService;
import com.qipeipu.crm.service.visitAll.WxBillOfDocumentService;
import com.qipeipu.crm.utils.bean.data.MultipleDataSource;
import com.qipeipu.crm.utils.statistics.BaseJudgeUtil;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.util.*;

/**
 * Created by laiyiyu on 2015/4/2.
 */
@Service
public class WxBillOfDocumentServiceImpl implements WxBillOfDocumentService {
    @Autowired
    private WxBillOfDocumentDao wxBillOfDocumentDao;

    @Autowired
    private CarTypeService carTypeService;

    @Autowired
    private UserAreaDao userAreaDao;

    @Autowired
    private WxCustomerDao wxCustomerDao;
    @Autowired
    private QpuOrgDao qpuOrgDao;
    @Autowired
    private QpStockSnapshotDao qpStockSnapshotDao;
    @Autowired
    private UserDutyDao userDutyDao ;


    @Override
    public void getOrderFormListByDemanderID(Integer custID, QueryConditionEntity queryConditionEntity, VoModel<?, ?> vo,Integer userID, String queryTime ) {
        List<OrderFormEntity> orderFormEntityList;
        List<Integer> mfctyIDList = new ArrayList<Integer>();



        MultipleDataSource.setDataSourceKey("dataSource");
        if(custID!=null){
            Integer mfctyID = wxCustomerDao.getmfctyIDByCustID(custID);
            if(mfctyID==null){
                orderFormEntityList = Collections.emptyList();
                vo.setTotal(0);
                vo.setModel(orderFormEntityList);
                return;
            }
            mfctyIDList.add(mfctyID);
        }else{
            Integer authority = userDutyDao.getAuthorityByUserID(userID);
//            List<Integer> authorities = new ArrayList<>() ;
//            authService.findRoleIdsByUserId(userID , authorities) ;
//            Integer authority = (authorities.isEmpty() ? 0 : authorities.get(0));


            List<Integer> mfctyIDsBySelectConditon = new ArrayList<Integer>();
            List<Integer> mfctyIDsByAuthority = getMfctyIDsByAuthorityAndUserID(authority, userID);
            if(mfctyIDsByAuthority.size()==0){
                orderFormEntityList = Collections.emptyList();
                vo.setTotal(0);
                vo.setModel(orderFormEntityList);
                return;
            }

            if(queryConditionEntity.getMfctyID()!=null){
                mfctyIDsBySelectConditon.add(queryConditionEntity.getMfctyID());
                mfctyIDsByAuthority.retainAll(mfctyIDsBySelectConditon);
            }else{
                if(queryConditionEntity.getProvinceID()!=null||queryConditionEntity.getCityID()!=null||queryConditionEntity.getAreaID()!=null){
                    mfctyIDsBySelectConditon = wxBillOfDocumentDao.getMfctyIDsByQueryCondition(queryConditionEntity);
                    mfctyIDsByAuthority.retainAll(mfctyIDsBySelectConditon);
                }
            }
            if(mfctyIDsByAuthority.size()==0){
                orderFormEntityList = Collections.emptyList();
                vo.setTotal(0);
                vo.setModel(orderFormEntityList);
                return;
            }

            mfctyIDList.addAll(mfctyIDsByAuthority);

        }
        /*else if(custID==null&&!queryConditionEntity.isAuthority()){
            Integer cityID = wxBillOfDocumentDao.getCityIDByUserID(userID);
            mfctyIDList = wxBillOfDocumentDao.getMfctyIDSByCityID(cityID);
        }else if(custID==null&&queryConditionEntity.isAuthority()){
            if (queryConditionEntity.getCityID()!=null){
                mfctyIDList = wxBillOfDocumentDao.getMfctyIDSByCityID(queryConditionEntity.getCityID());
            }else if(queryConditionEntity.getCityID()==null&&queryConditionEntity.getProvinceID()!=null){
                mfctyIDList = wxBillOfDocumentDao.getMfctyIDSByProvinceID(queryConditionEntity.getProvinceID());
            }
        }*/


        if(mfctyIDList.size()==0||mfctyIDList==null){
            orderFormEntityList = Collections.emptyList();
            vo.setTotal(0);
            vo.setModel(orderFormEntityList);
            return;
        }

        queryConditionEntity.setMfctyIDList(mfctyIDList);
        MultipleDataSource.setDataSourceKey("mainDataSource");
        orderFormEntityList = wxBillOfDocumentDao.getOrderFormListByOrgID(queryConditionEntity, vo, queryTime);
        fillOrgDetail(orderFormEntityList);
        if (CollectionUtils.isEmpty(orderFormEntityList)) {
            orderFormEntityList = Collections.emptyList();
            vo.setTotal(0);
        } else {
            vo.setTotal(wxBillOfDocumentDao
                    .getOrderFormListByOrgIDCount(queryConditionEntity, vo, queryTime));
        }
        /*for(OrderFormEntity orderFormEntity : orderFormEntityList ){
            System.out.println("momey:"+orderFormEntity.getMoney()+"-"+orderFormEntity.getAllNum()+"-"+orderFormEntity.getOrderStatus());

        }
        System.out.println("===========");*/
        vo.setModel(orderFormEntityList);
        MultipleDataSource.setDataSourceKey("dataSource");
    }

    private void fillOrgDetail(List<OrderFormEntity> input){
        for(OrderFormEntity orderFormEntity : input){
            String orgID = orderFormEntity.getOrgID();

            List<String> orgNames = qpuOrgDao.getMfctyNameByMfctyID(orgID);
            if(!BaseJudgeUtil.isEmpty(orgNames)){
                orderFormEntity.setMfctyName(orgNames.get(0));
            }
            //System.out.println(orgID+"-hehe-"+orderFormEntity.getMfctyName()+"-"+orderFormEntity.getOrderMainID());
        }
    }

    @Override
    public OrderFormEntity getOrderFormAndDetailByOrderMainID(String orderMainID) {
        MultipleDataSource.setDataSourceKey("mainDataSource");
        DecimalFormat df = new DecimalFormat("######0.00");
        OrderFormEntity orderFormEntity = wxBillOfDocumentDao.getOrderFormAndDetailByOrderMainID(orderMainID);
        if(orderFormEntity==null)
            return null;
        List<PartDetailEntity> partDetailEntityList = wxBillOfDocumentDao.getOrderFormDetailListByOrderMainID(orderMainID);
        fillOrderDetail(partDetailEntityList);
        Double aggregateAmount = 0.00;
        Integer all = 0;
        for(PartDetailEntity partDetailEntity : partDetailEntityList){
            /*if(orderFormDetailEntity.getUnitPrice()!=null){
                aggregateAmount += orderFormDetailEntity.getUnitPrice();
            }*/
            if(partDetailEntity.getNum()!=null){
                all += partDetailEntity.getNum();
            }
        }//end for
        /*if(aggregateAmount!=null){
            aggregateAmount = Double.parseDouble(df.format(aggregateAmount));
        }*/
        //orderFormEntity.setAggregateAmount(aggregateAmount);
        orderFormEntity.setAllNum(all);
        orderFormEntity.setPartDetailEntityList(partDetailEntityList);
        System.out.println(orderFormEntity.getAllNum()+"-"+orderFormEntity.getMoney());
        MultipleDataSource.setDataSourceKey("dataSource");
        return orderFormEntity;
    }


    private void fillOrderDetail(List<PartDetailEntity> input){
        for(PartDetailEntity partDetailEntity : input){
            Integer stockSnapShotID = partDetailEntity.getStockSnapShotID();
            List<StockSnapShotEntity> stockSnapShotEntities = qpStockSnapshotDao.getStockSnapShotEntityBystockSnapShotID(stockSnapShotID);
            if(!BaseJudgeUtil.isEmpty(stockSnapShotEntities)){
                partDetailEntity.setUnitPrice(stockSnapShotEntities.get(0).getUnitPrice());
                partDetailEntity.setCarTypeID(stockSnapShotEntities.get(0).getCarTypeID());
                partDetailEntity.setPartsName(stockSnapShotEntities.get(0).getPartsName());
            }

        }

    }

    public List<Integer> getMfctyIDsByAuthorityAndUserID(Integer authority, Integer userID){
        MultipleDataSource.setDataSourceKey("dataSource");
        List<Integer> mfctyIDs = new ArrayList<Integer>();
        Integer cityID ;

        switch (authority){
            //总监
            case 1 : mfctyIDs = wxCustomerDao.getAllMfctyID();
                     break;
            //城市经理
            case 2 :
                cityID = userAreaDao.getCityIDByUserIDAno(userID);
                mfctyIDs = wxCustomerDao.getMfctyIDSByCityID(cityID);
                break;
            //市场经理
            case 3 :
                cityID = userAreaDao.getCityIDByUserIDAno(userID);
                mfctyIDs = wxCustomerDao.getMfctyIDSByCityID(cityID);
                break;
            //主管
            case 4 :
                cityID = userAreaDao.getCityIDByUserIDAno(userID);
                mfctyIDs = wxCustomerDao.getMfctyIDSByCityID(cityID);
                break;
            default : ;

        }
        List<Integer> removeMf = Lists.newArrayList(907, 341, 515, 1539, 554, 521, 211, 222, 201, 55, 156, 160, 578, 65, 67, 1461, 909, 235, 36, 10167, 28, 29, 32, 35, 40, 41, 44, 49, 58, 60, 3698, 1494, 9226, 1909, 103, 10437, 3368, 3386, 4906, 6055, 6056, 6392, 2679, 2714, 2685, 7225, 8177, 8342, 9303, 12948, 12999);
        mfctyIDs.removeAll(removeMf);
        return mfctyIDs;
    }

    @Override
    public void getInquirysheetListByMfctyID(Integer custID, QueryConditionEntity queryConditionEntity, VoModel<?, ?> vo,Integer userID, String queryTime ) {
        List<InquirySheetEntity> inquirySheetEntityList;
        List<Integer> mfctyIDList = new ArrayList<Integer>();
        MultipleDataSource.setDataSourceKey("dataSource");
        if(custID!=null){
            Integer mfctyID = wxCustomerDao.getmfctyIDByCustID(custID);
            //System.out.println("mfctyID:"+mfctyID);
            if(mfctyID==null){
                inquirySheetEntityList = Collections.emptyList();
                vo.setTotal(0);
                vo.setModel(inquirySheetEntityList);
                return;
            }
            mfctyIDList.add(mfctyID);
        }else{

            Integer authority = userDutyDao.getAuthorityByUserID(userID);
//            List<Integer> authorities = new ArrayList<>() ;
//            authService.findRoleIdsByUserId(userID , authorities) ;
//            Integer authority = (authorities.isEmpty() ? 0 : authorities.get(0));


            List<Integer> mfctyIDsBySelectConditon = new ArrayList<Integer>();
            List<Integer> mfctyIDsByAuthority = getMfctyIDsByAuthorityAndUserID(authority, userID);
            if(mfctyIDsByAuthority.size()==0){
                inquirySheetEntityList = Collections.emptyList();
                vo.setTotal(0);
                vo.setModel(inquirySheetEntityList);
                return;
            }
            if(queryConditionEntity.getMfctyID()!=null){
                mfctyIDsBySelectConditon.add(queryConditionEntity.getMfctyID());
                mfctyIDsByAuthority.retainAll(mfctyIDsBySelectConditon);
            }else{
                if(queryConditionEntity.getProvinceID()!=null||queryConditionEntity.getCityID()!=null||queryConditionEntity.getAreaID()!=null){
                    mfctyIDsBySelectConditon = wxBillOfDocumentDao.getMfctyIDsByQueryCondition(queryConditionEntity);
                    mfctyIDsByAuthority.retainAll(mfctyIDsBySelectConditon);
                }
            }
            if(mfctyIDsByAuthority.size()==0){
                inquirySheetEntityList = Collections.emptyList();
                vo.setTotal(0);
                vo.setModel(inquirySheetEntityList);
                return;
            }

            mfctyIDList.addAll(mfctyIDsByAuthority);

        }

        if(mfctyIDList.size()==0){
            inquirySheetEntityList = Collections.emptyList();
            vo.setTotal(0);
            vo.setModel(inquirySheetEntityList);
            return;
        }

        queryConditionEntity.setMfctyIDList(mfctyIDList);
        MultipleDataSource.setDataSourceKey("mainDataSource");

        List<UserIDAndMfctyIDEntity> userIDAndMfctyIDEntities = wxBillOfDocumentDao.getQPUserIDAndOrgIDListByMfctyIDs(mfctyIDList);

        Map<String, String> userIDToMfctyNameMap = new HashMap<String, String>();
        List<String> qpuUserIDList = new ArrayList<String>();
        for(UserIDAndMfctyIDEntity userIDAndMfctyIDEntity : userIDAndMfctyIDEntities){
            List<String> mfctyNames = qpuOrgDao.getMfctyNameByMfctyID(userIDAndMfctyIDEntity.getMfctyID());
            String mfctyName = CollectionUtils.isEmpty(mfctyNames)?"无":mfctyNames.get(0);
            userIDToMfctyNameMap.put(userIDAndMfctyIDEntity.getUserID(), mfctyName);
            qpuUserIDList.add(userIDAndMfctyIDEntity.getUserID());
        }

        if(userIDAndMfctyIDEntities.size()==0){
            inquirySheetEntityList = Collections.emptyList();
            vo.setTotal(0);
            vo.setModel(inquirySheetEntityList);
            return;
        }
        queryConditionEntity.setQpuUserIDList(qpuUserIDList);

        inquirySheetEntityList = wxBillOfDocumentDao.getInquirySheetListByUserIDs(queryConditionEntity, vo, queryTime);

        for(InquirySheetEntity inquirySheetEntity : inquirySheetEntityList){
            inquirySheetEntity.setMfctyName(userIDToMfctyNameMap.get(inquirySheetEntity.getUserID()));
            Integer carTypeID = inquirySheetEntity.getCarTypeId();
            List<Integer> carTypeIDs = new ArrayList<>();
            carTypeIDs.add(carTypeID);
            List<CarTypeDTO> carTypeDTOs = carTypeService.findCarTypeByIds(carTypeIDs);
            String brandSystem;

            if(carTypeDTOs.size()!=0){
                CarTypeDTO carTypeDTO = carTypeDTOs.get(0);
                brandSystem = carTypeDTO.getBrandName()+carTypeDTO.getCarSystem();
                inquirySheetEntity.setBrandSystem(brandSystem);
            }
        }

        if (CollectionUtils.isEmpty(inquirySheetEntityList)) {
            inquirySheetEntityList = Collections.emptyList();
            vo.setTotal(0);
        } else {
            vo.setTotal(wxBillOfDocumentDao
                    .getInquirySheetListCountByUserIDs(queryConditionEntity, vo, queryTime));
        }
        for(InquirySheetEntity inquirySheetEntity : inquirySheetEntityList ){
            System.out.println(inquirySheetEntity.getBrandSystem());
        }
        System.out.println("===========");
        vo.setModel(inquirySheetEntityList);
        MultipleDataSource.setDataSourceKey("dataSource");
    }

    @Override
    public InquirySheetEntity getInquirysheetAndDetailByInquiryID(Integer inquiryID) {
        MultipleDataSource.setDataSourceKey("mainDataSource");
        InquirySheetEntity inquirySheetEntity = wxBillOfDocumentDao.getInquirySheetEntityAndDetailByInquiryID(inquiryID);
        if(inquirySheetEntity==null){
            return null;
        }
        List<PartDetailEntity> partDetailEntityList = wxBillOfDocumentDao.gerInquirySheetDetailByInquiryID(inquiryID);
        Integer inquiryState = inquirySheetEntity.getStatus();
        if(inquiryState==2){
            for(PartDetailEntity partDetailEntity : partDetailEntityList){
                Integer inquiryDetailId = partDetailEntity.getInquiryDetailId();
                List<QuotedetailEntity> quotedetailEntities = wxBillOfDocumentDao.getInquiryDetailMenoy(inquiryID, inquiryDetailId);

                partDetailEntity.setQuotedetailEntityList(quotedetailEntities);
            }
        }
        inquirySheetEntity.setPartDetailEntityList(partDetailEntityList);
        MultipleDataSource.setDataSourceKey("dataSource");
        return inquirySheetEntity;

    }


}
