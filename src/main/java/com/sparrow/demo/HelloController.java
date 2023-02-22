package com.sparrow.demo;

import com.sparrow.cache.exception.CacheNotFoundException;
import com.sparrow.constant.User;
import com.sparrow.mvc.RequestParameters;
import com.sparrow.mvc.ViewWithModel;
import com.sparrow.protocol.BusinessException;
import com.sparrow.protocol.LoginUser;
import com.sparrow.protocol.Result;
import com.sparrow.protocol.constant.SparrowError;
import com.sparrow.servlet.ServletContainer;
import com.sparrow.support.Authenticator;
import com.sparrow.support.web.ResultAssembler;
import com.sparrow.support.web.ServletUtility;
import com.sparrow.vo.HelloVO;
import javax.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HelloController {

    private Authenticator authenticator;

    private ServletContainer servletContainer;

    private static Logger logger = LoggerFactory.getLogger(HelloController.class);

    public void setAuthenticator(Authenticator authenticator) {
        this.authenticator = authenticator;
    }

    public void setServletContainer(ServletContainer servletContainer) {
        this.servletContainer = servletContainer;
    }

    @RequestParameters("key")
    public HelloVO env(String key) throws BusinessException {
        return new HelloVO(System.getenv(key));
    }

    @RequestParameters("key")
    public HelloVO env2(String key) throws BusinessException {
        return new HelloVO(key);
    }

    public ViewWithModel hello() {
        logger.info("hello");
        return ViewWithModel.forward("hello", new HelloVO("我来自遥远的sparrow 星球,累死我了..."));
    }

    public ViewWithModel exception() throws BusinessException {
        throw new BusinessException(SparrowError.SYSTEM_SERVER_ERROR);
    }

    public ViewWithModel fly() {
        return ViewWithModel.redirect("fly-here", new HelloVO("我是从fly.jsp飞过来，你是不是没感觉？"));
    }

    public ViewWithModel transit() throws BusinessException {
        return ViewWithModel.transit(new HelloVO("我从你这歇一会，最终我要到transit-here"));
    }

    @RequestParameters("threadId,pageIndex")
    public ViewWithModel thread(Long threadId, Integer pageIndex) {
        return ViewWithModel.forward("thread", new HelloVO("服务器的threadId=" + threadId + ",pageIndex=" + pageIndex));
    }

    public HelloVO json() {
        return new HelloVO("够意思吧，json不用页面");
    }

    public ViewWithModel welcome() {
        return ViewWithModel.forward(new HelloVO("jsp page content from server ..."));
    }

    public ViewWithModel login(HttpServletRequest request) throws BusinessException, CacheNotFoundException {
        LoginUser loginToken = new LoginUser();
        loginToken.setNickName("nick-zhangsan");
        loginToken.setAvatar("http://localhost");
        ServletUtility servletUtility = ServletUtility.getInstance();
        loginToken.setDeviceId(servletUtility.getDeviceId(request));
        logger.debug("login device id {}", loginToken.getDeviceId());
        loginToken.setExpireAt(System.currentTimeMillis() + 1000 * 60 * 60);
        loginToken.setDays(20);
        loginToken.setUserId(1L);
        loginToken.setUserName("zhangsan");
        loginToken.setActivate(true);
        String sign = authenticator.sign(loginToken);
        servletContainer.rootCookie(User.PERMISSION, sign, 6);
        Result result = ResultAssembler.assemble(new Result<>(loginToken, "login_success"));
        return ViewWithModel.transit("/login_success", "/", result);
    }

    public ViewWithModel authorizing() {
        return ViewWithModel.forward(new HelloVO("你成功了"));
    }
}
