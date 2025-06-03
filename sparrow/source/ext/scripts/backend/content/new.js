var contentController = {
            api: {
                save: "save",
                manage: "manage"
            },

            load: function () {
                document.domain = $.browser.cookie.root_domain;
                $.v.init(contentInfo)

                $.dispatcher.eventRegistry = [
                    {
                        id: "btnReturn",
                        delegate: function (e, srcElement) {
                            window.location.href = contentController.api.manage;
                        },
                        strategy: lang.command.return
                    },
                    {
                        id: "btnSave",
                        delegate: function (e, srcElement) {
                            $.v.getValidateResult(contentInfo, function () {
                                $.submit(contentController.api.save);
                            });
                        },
                        strategy: lang.command.save
                    }];
                $.dispatcher.bind();
            }
        };
        define("content", [], function () {
            return contentController;
        });