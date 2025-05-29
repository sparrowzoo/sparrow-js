var tokenConfig = {};
tokenConfig[$.url.root] = {
  "login-token": function () {
    return localStorage.getItem("token");
  },
};
Sparrow.ajax.tokenConfig = tokenConfig;
