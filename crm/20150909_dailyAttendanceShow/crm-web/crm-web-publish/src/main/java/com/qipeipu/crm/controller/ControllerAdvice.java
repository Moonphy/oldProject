package com.qipeipu.crm.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.util.ClassUtils;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Created by johnkim on 15-2-3.
 */
@Slf4j
@Controller
public class ControllerAdvice {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(ControllerAdvice.class);

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public String handleException(Exception ex) {
        logger.error("{捕获到异常：}{}",ex);
        return ClassUtils.getShortName(ex.getClass()) + ex.getMessage();
    }

}
