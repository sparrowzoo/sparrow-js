var contentCategoryController = {
            api: {
                add: "new",
                search: "search.do",
                enable:"enable",
                disable:"disable",
                delete:"delete"
            },

            load: function () {
                $.gridView.id="grvContentCategoryList";
                document.forms[0].action=this.api.search;

                $.dispatcher.eventRegistry = [
                    {
                        id: "btnSearch",
                        delegate: function (e, srcElement) {
                            $("#hdnCurrentPageIndex").value(1);
                            $.submit($entity_namController.api.search);
                        }
                    },
                    {
                        id: "btnAdd",
                        delegate: function (e, srcElement) {
                            window.location.href = contentCategoryController.api.add;
                        }
                    },
                    {
                        id: "btnEnable",
                        delegate: function (e, srcElement) {
                            $.gridView.submit(contentCategoryController.api.enable,lang.message.enable);
                        }
                    },
                    {
                        id: "btnDisable",
                        delegate: function (e, srcElement) {
                            $.gridView.submit(contentCategoryController.api.disable,lang.message.disable);
                        }
                    },
                    {
                        id: "btnDelete",
                        delegate: function (e, srcElement) {
                                $.gridView.submit(contentCategoryController.api.delete, lang.message.delete);
                        }
                    }
                ];
                $.dispatcher.bind();
            }
            };
            define("contentCategory", [], function () {
                return contentCategoryController;
            });