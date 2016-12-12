package com.qipeipu.crm.service.impl.cdn.qiniu;

import com.qipeipu.crm.service.cdn.qiniu.UploadService;
import com.qipeipu.crm.utils.cdn.qiniu.UploadConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by johnkim on 15-5-27.
 * 七牛存储实现
 */
@Service
public class UploadServiceImpl implements UploadService {

    @Autowired
    private UploadConfig config;

    @Override
    public String uploadToken() {
        return UploadConfig.auth.uploadToken(config.getBucketName());
    }

    @Override
    public String getDomain() {
        return config.getDomain();
    }

    @Override
    public String getDownloadUrl(String key) {
        return UploadConfig.auth.privateDownloadUrl(config.getDomain()+key);
    }

}
