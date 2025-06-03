function SPARROW_HTTP_CLIENT() {
    this.config = {
        api_root_url: "../api/",
        api_list_container_id: "sltApiList",
        api_url_id: "txtUrl",
        api_result_id: "txtResponseText",
        api_method_id: "spanMethod",
        api_response_text_id: "txtResponseText",
        token_text_id: "txtToken",
        api_parameter_data_id: "txtData",
        api_current_key: "user_login",
        api_send_id: "btnSend",
        link_parameter_id: "linkParameter",
        link_api: "linkApi",
        link_result: "linkResult",
    }

    this.initMethodConfig = function () {
        var methodList = $(this.config.api_list_container_id);
        for (var key in parameters) {
            var option = new Option(parameters[key].text, key);
            methodList.options.add(option);
        }
    }

    this.initParameter = function (key) {
        this.config.api_current_key=key;
        var NULL_LINK = "javascript:{};"
        var p = parameters[key];
        var data = p.data;
        $(this.config.api_parameter_data_id).value = data ? data : "";
        $(this.config.api_url_id).value = p.url ? p.url : "";
        $(this.config.api_method_id).innerText = p.method ? p.method : "";
        $(this.config.link_parameter_id).href = p.parameter_url ? p.parameter_url : NULL_LINK;
        $(this.config.link_parameter_id).innerText = p.parameter_url ?"参数说明:"+ p.parameter_url : "";

        $(this.config.link_result).href = p.result_url ? p.result_url : NULL_LINK;
        $(this.config.link_result).innerHTML = p.result_url ?"返回值说明:"+ p.result_url : "";

        $(this.config.link_api).href = p.api_url ? p.api_url : NULL_LINK;
        $(this.config.link_api).innerHTML = p.api_url ? "接口说明:"+p.api_url : "";
    }
    this.call = function () {
        var http_client=this;
        var data = $(this.config.api_parameter_data_id).value;
        var method = $(this.config.api_method_id).innerText;
        jQuery.ajax(
            {
                //除post 方法外其他方法必须能过url传
                url: this.config.api_root_url + $(this.config.api_url_id).value,
                context: document.body,
                dataType: 'text',
                data: data,
                type: method,
                headers: {'Token': $(this.config.token_text_id).value},
                success: function (responseText) {
                    $(http_client.config.api_response_text_id).value = $.format(responseText);
                    var is_login=parameters[http_client.config.api_current_key].login;
                    var jsonResult=jQuery.parseJSON(responseText);
                    if(is_login){
                        if(jsonResult.status.code==0)
                        $(http_client.config.token_text_id).value=jsonResult.data.token;
                    }
                }
            });
    }
    this.init = function () {
        var http_client = this;
        $(this.config.api_send_id).onclick = function () {
            http_client.call();
        }
        $(this.config.api_list_container_id).onchange=function () {
            http_client.initParameter(this.value);
        }
        this.initParameter(this.config.api_current_key);
        this.initMethodConfig();
    }
};

