package com.qipeipu.crm.utils.cdn.qiniu;

import com.qiniu.util.Auth;

/**
 * Created by johnkim on 15-5-27.
 * 七牛配置
 */
public class UploadConfig {

    //管理 token
    String accessKey;
    //签名
    String secretKey;
    //仓库名字
    String bucketName;
    //访问地址，末尾需带/
    String domain;
    //Auth 七牛SDK
    public static Auth auth = null;

    //初始化 AuthSDK，在spring配置文件中声明调用
    public void init() {
        auth = Auth.create(accessKey,secretKey);
    }

    public String getAccessKey() {
        return accessKey;
    }

    public void setAccessKey(String accessKey) {
        this.accessKey = accessKey;
    }

    public String getSecretKey() {
        return secretKey;
    }

    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getBucketName() {
        return bucketName;
    }

    public void setBucketName(String bucketName) {
        this.bucketName = bucketName;
    }
}
