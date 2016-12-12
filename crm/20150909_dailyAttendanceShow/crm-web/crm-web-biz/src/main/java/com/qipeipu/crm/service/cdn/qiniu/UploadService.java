package com.qipeipu.crm.service.cdn.qiniu;

/**
 * Created by johnkim on 15-5-27.
 * 七牛存储
 */
public interface UploadService {
    /***
     * 更新/获取 七牛token
     * @return 七牛授权token
     */
    String uploadToken();


    /***
     * 获取domain
     * @return
     */
    String getDomain();

    /**
     * 获取下载URL地址
     * key 文件的key
     * @return
     */
    String getDownloadUrl(String key);
}
