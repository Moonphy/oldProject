package com.qipeipu.crm.controller;

import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.service.cdn.qiniu.UploadService;
import com.qipeipu.crm.utils.bean.tools.GUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by johnkim on 15-5-27.
 */
@Slf4j
@Controller
@RequestMapping(value = "cdn/qn")
public class QiniuController {

    @Autowired
    private UploadService uploadService;

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(QiniuController.class);

    @RequestMapping(value = "token", method = RequestMethod.GET)
    public void getToken(HttpServletRequest request,HttpServletResponse response) {
        String token = uploadService.uploadToken();
        String domain = uploadService.getDomain();
        logger.info("本次上传token：{}", token);
        logger.info("本次上传domain：{}", domain);
        Map<String,String> map = new HashMap<String,String>();
        map.put("token",token);
        map.put("domain",domain);
        GUtils.responseJson(response, ResultDTO.successResult(map,"token信息获取成功"));
    }

    @RequestMapping(value = "file", method = RequestMethod.GET)
    public void getToken(HttpServletRequest request,HttpServletResponse response,String key) {
        String realurl = uploadService.getDownloadUrl(key);
        logger.info("原始资源key：{}，真实上传url：{}", key, realurl);
        try {
            if(GUtils.isEmptyOrNull(key)){
                response.setStatus(400);
            }
            response.sendRedirect(realurl);
        } catch (IOException e) {
            logger.error("资源重定向失败:{}",realurl);
        }
    }

}
