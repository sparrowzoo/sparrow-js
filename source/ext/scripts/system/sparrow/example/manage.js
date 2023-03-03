var sparrowExampleController = {
            api: {
                add: "new",
                search: "search.do",
                enable:"enable",
                disable:"disable",
                delete:"delete"
            },

            load: function () {
                $.gridView.id="grvSparrowExampleList";
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
                            window.location.href = sparrowExampleController.api.add;
                        }
                    },
                    {
                        id: "btnEnable",
                        delegate: function (e, srcElement) {
                            $.gridView.submit(sparrowExampleController.api.enable,lang.message.enable);
                        }
                    },
                    {
                        id: "btnDisable",
                        delegate: function (e, srcElement) {
                            $.gridView.submit(sparrowExampleController.api.disable,lang.message.disable);
                        }
                    },
                    {
                        id: "btnDelete",
                        delegate: function (e, srcElement) {
                                $.gridView.submit(sparrowExampleController.api.delete, lang.message.delete);
                        }
                    }
                ];
                $.dispatcher.bind();
            }
            };
            define("sparrowExample", [], function () {
                return sparrowExampleController;
            });