package com.sparrow.authorizing;

import com.sparrow.support.AbstractAuthenticatorService;

public class AuthorizingDemo extends AbstractAuthenticatorService {
    @Override
    protected String getSecret(Long userId) {
        //getPasswordByUserId();
        return "111111";
    }
}
