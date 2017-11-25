package com.qipeipu.crm.dtos.visit;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by laiyiyu on 2015/4/21.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class UserIDAndMfctyIDEntity {

    private String userID;

    private String mfctyID;
}
