package com.qipeipu.crm.service.transformer;

import com.google.common.base.Function;
import com.qipeipu.crm.dtos.visit.CustomerBasedDTO;
import com.qipeipu.crm.dtos.visit.CustomerBasedEntity;

/**
 * Created by laiyiyu on 2015/3/24.
 */
public class CustomerBasedDTOTransformer implements Function<CustomerBasedEntity, CustomerBasedDTO> {

    public static final CustomerBasedDTOTransformer INSTANCE = new CustomerBasedDTOTransformer();

    @Override
    public CustomerBasedDTO apply(CustomerBasedEntity input) {

        CustomerBasedDTO customerBasedDTO = CustomerBasedDTO.builder().address(input.getAddress()).boothRoom(input.getBoothRoom()).businessArea(input.getBusinessArea())
                .cactMan(input.getCactMan()).cactTel(input.getCactTel()).liftingFrame(input.getLiftingFrame())
                .mfctyType(input.getMfctyType()).mfctyName(input.getMfctyName()).build();


        return customerBasedDTO;
    }
}
