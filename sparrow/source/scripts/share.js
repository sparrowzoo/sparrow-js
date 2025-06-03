/* 第三方分享实现 */
Sparrow.share = {
    config: {
        icon: $.url.resource + '/images/share.png',
        share: [
            // 无appkey但有websit配置
            {
                url: 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?style=202&width=80&height=31&showcount=1&url={0}&title={1}&pics={2}&desc={3}&summary={4}&site='
                + encodeURIComponent($.browser.getCookie($.browser.cookie.website_name))
                + '&otype=share',
                position: {
                    left: 160,
                    top: 0
                },
                title: "分享到QQ空间"
            },
            {
                url: 'http://service.weibo.com/share/share.php?appkey=318168823&url={0}&title={1}&pic={2}&ralateUid=3199233727',
                position: {
                    left: 0,
                    top: 0
                },
                title: "分享到新浪微博"
            }]
    },
    init: function () {
        var shareArray = document.getElementsByName("share");
        var shareTemplateArray = [];
        for (var j = 0; j < this.config.share.length; j++) {
            shareTemplateArray
                .push('<a target="_blank" style="height:32px;width:32px;display:inline-block;background:url({0}) {1}px {2}px;" title="{3}" href="{4}"></a>'
                    .format(this.config.icon,
                        this.config.share[j].position.left,
                        this.config.share[j].position.top,
                        this.config.share[j].title,
                        this.config.share[j].url));
        }
        shareTemplate = shareTemplateArray.join("");
        for (var i = shareArray.length - 1; i >= 0; i--) {
            var shareData = shareArray[i].value.json();
            shareArray[i].parentNode.innerHTML = shareTemplate.format(encodeURIComponent(shareData.url),
                encodeURIComponent(shareData.title),
                encodeURIComponent(shareData.pic),
                encodeURIComponent(shareData.comment),
                encodeURIComponent(shareData.summary));
        }
    }
};