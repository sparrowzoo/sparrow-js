Sparrow.http = {
    post: function (url, data,token) {
        return new Promise((resolve, reject) => {
            Sparrow.ajax.post(url, data, function (responseText) {
                var result = responseText.json();
                if (result == null) {
                    reject(responseText);
                    return;
                }
                resolve(result);
            },token)
        })
    },
    get: function (url,token) {
        return new Promise((resolve, reject) => {
            Sparrow.ajax.get(url, function (responseText) {
                var result = responseText.json();
                if (result == null) {
                    reject(responseText);
                    return;
                }
                resolve(result);
            })
        },token)
    }
};
