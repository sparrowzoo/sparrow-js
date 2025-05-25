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
  function loadHTML(url, containerId, params) {
    let container = $(`#${containerId}`);
    if (container.length <= 0) {
      container = $("<div>");
      container.attr("id", containerId);
      document.body.appendChild(container[0]);
    }
    var right = params.get("r");
    var bottom = params.get("b");
    if (!right) {
      right = "4rem";
    }
    if (!bottom) {
      bottom = "4rem";
    }
    container.css({ position: "absolute", right: right, bottom: bottom });
    // 显示加载状态
    $.ajax({
      url: url,
      method: "GET",
      cache: false, // 禁用缓存
      dataType: "html",
    })
      .done(function (html) {
        html = html.replace("</body>", "");
        html = html.replace("</html>", "");
        container.append(html); // 外部样式不
        //debugger;
        reloadAssets(container);
      })
      .fail(function (jqXHR, textStatus) {
        console.error("加载失败:", textStatus);
        container.html('<p class="error">内容加载失败，请刷新重试</p>');
      });
  }

  // 资源重载处理
  function reloadAssets(container) {
    //处理样式表;
    container.find('link[rel="stylesheet"]').each(function () {
      $(this).clone().appendTo("head");
    });

    // 处理脚本（保持顺序执行）
    const scripts = container.find("script").get();

    (function loadScript(index) {
      debugger;
      if (index >= scripts.length) return;

      const script = scripts[index];
      const newScript = $("<script>");

      if (script.src) {
        newScript
          .attr("src", script.src + "?t=" + Date.now())
          .addEventListener("load", () => {
            loadScript(index + 1);
          });
      } else {
        newScript.text(script.innerHTML);
        setTimeout(() => loadScript(index + 1), 0);
      }
      $("body").append(newScript);
    })(0);
  }

  $(document).ready(() => {
    var src = document.getElementById("talk-script").src;
    var params = new URL(src).searchParams;
    var htmlUrl = params.get("html");
    loadHTML(htmlUrl, "content-container", params);
  });
});
