package com.sparrow.authorizing;

import com.sparrow.support.AbstractAuthenticatorService;
import javax.inject.Named;

@Named("authenticatorService")
public class AuthorizingDemo extends AbstractAuthenticatorService {
    @Override
    protected String getSecret(Long userId) {
        //getPasswordByUserId();
        return "111111";
    }
}
