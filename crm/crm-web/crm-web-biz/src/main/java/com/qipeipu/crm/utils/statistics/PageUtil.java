package com.qipeipu.crm.utils.statistics;

import com.google.common.collect.Lists;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by laiyiyu on 2015/4/28.
 */
public class PageUtil<T> {
    public List<T> getPagedFilterPartsList(List<T> rankedPartsList, int page, int pageSize) {
        if (CollectionUtils.isEmpty(rankedPartsList)) {
            return Collections.EMPTY_LIST;
        }
        if (page >( rankedPartsList.size())/pageSize+1) {
            return Collections.EMPTY_LIST;
        }
        List<List<T>> partition;
        if(page==( rankedPartsList.size())/pageSize+1) {
            List<T> temp = new ArrayList<>();
            //int lastPart =  rankedPartsList.size()-(page-1)*pageSize;
            for(int i=(page-1)*pageSize;i<rankedPartsList.size();i++){
                temp.add(rankedPartsList.get(i));
            }
            return temp;
        }else{
            partition = Lists.partition(rankedPartsList, pageSize);
            return partition.get(page);
        }
    }
}
