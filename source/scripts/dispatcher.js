Sparrow.dispatcher = {
    builder: {
        id: "id",//控件标签 id
        delegate: "delegate",//事件委托
        api: "api",//ajax请求的api
        strategy: "strategy",//策略 控件的 value
        eventName: "eventName"//事件的名称 默认为onclick
    },
    commandAdapter: {},
    ctrlIdEventMap: {},
    eventRegistry: [],
    register: function (eventConfig) {
        this.eventRegistry.push(eventConfig);
    },
    dispatcher: function (e, srcElement) {
        var commandKey = srcElement.id + "_" + srcElement.value;
        var builder = this.commandAdapter[commandKey];

        var delegate = null;
        if (builder != null) {
            delegate = builder.delegate;
        }

        if (delegate == null) {
            builder = this.commandAdapter[srcElement.id];
            if (builder != null) {
                delegate = builder.delegate;
            }
        }
        if (builder != null && delegate != null) {
            if (builder.api) {
                $.ajax.json(builder.api, builder.parameter, delegate, srcElement);
            } else {
                delegate(e, srcElement);
            }
        }
    },
    bind: function () {
        for (var i = 0; i < this.eventRegistry.length; i++) {
            var builder = this.eventRegistry[i];
            var strategy = builder.strategy;
            var eventName = builder.eventName;
            var commandKey = builder.id + (strategy ? "_" + strategy : "");
            this.commandAdapter[commandKey] = builder;
            this.ctrlIdEventMap[builder.id] = eventName ? eventName : "onclick";
        }
        for (ctrlId in this.ctrlIdEventMap) {
            $("#" + ctrlId).bind(this.ctrlIdEventMap[ctrlId], function (e) {
                Sparrow.dispatcher.controller(e, $.event(e).srcElement)
            });
        }
    }
};