var contentCategoryController = {
            api: {
                save: "save",
                manage: "manage"
            },

            load: function () {
                document.domain = $.browser.cookie.root_domain;
                $.v.init(contentCategoryInfo)

                $.dispatcher.eventRegistry = [
                    {
                        id: "btnReturn",
                        delegate: function (e, srcElement) {
                            window.location.href = contentCategoryController.api.manage;
                        },
                        strategy: lang.command.return
                    },
                    {
                        id: "btnSave",
                        delegate: function (e, srcElement) {
                            $.v.getValidateResult(contentCategoryInfo, function () {
                                $.submit(contentCategoryController.api.save);
                            });
                        },
                        strategy: lang.command.save
                    }];
                $.dispatcher.bind();
            }
        };
        define("contentCategory", [], function () {
            return contentCategoryController;
        });