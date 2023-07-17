var sparrowExampleController = {
            api: {
                save: "save",
                manage: "manage"
            },

            load: function () {
                document.domain = $.browser.cookie.root_domain;
                $.v.init(sparrowExampleInfo)

                $.dispatcher.eventRegistry = [
                    {
                        id: "btnReturn",
                        delegate: function (e, srcElement) {
                            window.location.href = sparrowExampleController.api.manage;
                        },
                        strategy: lang.command.return
                    },
                    {
                        id: "btnSave",
                        delegate: function (e, srcElement) {
                            $.v.getValidateResult(sparrowExampleInfo, function () {
                                $.submit(sparrowExampleController.api.save);
                            });
                        },
                        strategy: lang.command.save
                    }];
                $.dispatcher.bind();
            }
        };
        define("sparrowExample", [], function () {
            return sparrowExampleController;
        });