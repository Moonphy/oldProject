package com.qipeipu.crm.utils.view;

import freemarker.core.Environment;
import freemarker.template.TemplateException;
import freemarker.template.TemplateExceptionHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.Writer;

/**
 * Created by johnkim on 15-2-3.
 */
public class FreemarkerExceptionHandler implements TemplateExceptionHandler {

    private static final Logger log = LoggerFactory
            .getLogger(FreemarkerExceptionHandler.class);

    @Override
    public void handleTemplateException(TemplateException e, Environment env, Writer out) throws TemplateException {
        log.warn("[Freemarker Error: " + e.getMessage() + "]");
        throw new TemplateException("freemarker error", e,env);
    }
}
