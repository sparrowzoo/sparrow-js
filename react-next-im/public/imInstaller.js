function loadjQuery(callback) {
  if (window.jQuery) {
    callback();
    return;
  }
  const script = document.createElement("script");
  script.src = "https://code.jquery.com/jquery-3.7.1.min.js";
  script.onload = callback;
  script.onerror = function () {
    console.error("加载失败，请检查网络或 CDN 状态");
  };
  document.head.appendChild(script);
}

// 加载 jQuery 并初始化功能
loadjQuery(function () {
  var root = "./";
  var loading = root + "/loading.gif";
  var htmlUrl = root + "/online.html";

  function loadHTML(url, containerId) {
    const container = $(`#${containerId}`);
    container.css({ position: "absolute", right: "4rem", bottom: "4rem" });
    var img = new Image();
    img.src = loading;
    img.loop = true;
    img.lazyload = true;
    container.append(img);
    // 显示加载状态
    $.ajax({
      url: url,
      method: "GET",
      cache: false, // 禁用缓存
      dataType: "html",
    })
      .done(function (html) {
        container.html(html); // 外部样式不
        debugger;
        //reloadAssets(container);
      })
      .fail(function (jqXHR, textStatus) {
        console.error("加载失败:", textStatus);
        container.html('<p class="error">内容加载失败，请刷新重试</p>');
      });
  }

  // 资源重载处理
  function reloadAssets(container) {
    // 处理样式表
    container.find('link[rel="stylesheet"]').each(function () {
      $(this).clone().appendTo("head");
    });

    // 处理脚本（保持顺序执行）
    const scripts = container.find("script").get();
    (function loadScript(index) {
      if (index >= scripts.length) return;

      const script = scripts[index];
      const newScript = $("<script>");

      if (script.src) {
        newScript
          .attr("src", script.src + "?t=" + Date.now())
          .on("load", () => loadScript(index + 1));
      } else {
        newScript.text(script.innerHTML);
        setTimeout(() => loadScript(index + 1), 0);
      }

      $("body").append(newScript);
    })(0);
  }

  // $(document).ready(() => {
  //   loadHTML(htmlUrl, "content-container");
  // });
  $(window).on("load", function () {
    console.log("所有资源加载完成！");
    loadHTML(htmlUrl, "content-container");
  });
});
