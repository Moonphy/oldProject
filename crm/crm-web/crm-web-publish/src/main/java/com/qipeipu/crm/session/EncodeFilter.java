package com.qipeipu.crm.session;

import java.io.IOException;
import java.util.Enumeration;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

public class EncodeFilter implements Filter {

	private static final Logger logger = Logger.getLogger(EncodeFilter.class);

	String encoding = "UTF-8";

	@Override
	public void destroy() {
		logger.info("EncodeFilter Closed!");
	}

	@Override
	public void doFilter(ServletRequest req, ServletResponse resp,
			FilterChain chain) throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest)req;
		HttpServletResponse response = (HttpServletResponse)resp;
		String method = request.getMethod();
		if(method.equalsIgnoreCase("post")){
			request.setCharacterEncoding(encoding);
		}else{
			Enumeration<String> en = request.getParameterNames();
			while(en.hasMoreElements()){
				String[] values = request.getParameterValues(en.nextElement());
				for (int i = 0; i < values.length; i++) {
					values[i] = new String(values[i].getBytes("ISO8859-1"),encoding);
				}
			}
		}
		response.setContentType("text/html;charset="+encoding);
		chain.doFilter(request, response);
		logger.info("EncodeFilter doFilter!");
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
		// TODO Auto-generated method stub
		logger.info("EncodeFilter started!");
	}

}
