Sparrow.password = {
  api: {
    find: "/password/send-find-password-email.json",
    reset: "/password/reset-by-token.json",
    modify: "/password/modify.json",
  },
  bindEvents: function () {
    $.dispatcher.eventRegistry = [
      {
        id: "btnSendPasswordToken",
        delegate: $.password.sendPasswordToken,
      },
    ];
    $.dispatcher.bind();
  },
  init: function () {
    this.bindEvents();
  },
  sendPasswordToken: function (srcElement) {
    $.v.getValidateResult(findPassword, function () {
      $.ajax.post(
        $.url.root + $.password.api.find,
        "email=" + $("#txtValidateEmail").value(),
        function (result) {
          $.message(result.message);
        }
      );
    });
  },
};
document.ready(function () {
  $.password.init();
});
