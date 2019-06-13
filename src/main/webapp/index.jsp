<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://www.sparrowzoo.com/ui" prefix="j" %>

<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description"
          content="A layout example with a side menu that hides on mobile, just like the Pure website.">
    <title>Sparrow Example &ndash; Sparrow JS Framework</title>

    <jsp:include page="${root_path}/examples/head.jsp"/>
    <j:style href="$resource/assets/styles/modal.css"/>
</head>
<body>


<div id="layout">
    <jsp:include page="${root_path}/examples/menu.jsp"/>
    <div id="main">
        <div class="header">
            <h1>Page Title</h1>
            <h2>A subtitle for your page goes here</h2>
        </div>

        <div class="content">
            <h2 class="content-subhead">How to use this layout</h2>
            <p>
                To use this layout, you can just copy paste the HTML, along with the CSS in <a
                    href="/css/layouts/side-menu.css" alt="Side Menu CSS">side-menu.css</a>, and the JavaScript in <a
                    href="/js/ui.js">ui.js</a>. The JS file uses vanilla JavaScript to simply toggle an
                <code>active</code> class that makes the menu responsive.
            </p>

            <h2 class="content-subhead">Now Let's Speak Some Latin</h2>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
            </p>

            <div class="pure-g">
                <div class="pure-u-1-4">
                    <img class="pure-img-responsive" src="http://farm3.staticflickr.com/2875/9069037713_1752f5daeb.jpg"
                         alt="Peyto Lake">
                </div>
                <div class="pure-u-1-4">
                    <img class="pure-img-responsive" src="http://farm3.staticflickr.com/2813/9069585985_80da8db54f.jpg"
                         alt="Train">
                </div>
                <div class="pure-u-1-4">
                    <img class="pure-img-responsive" src="http://farm6.staticflickr.com/5456/9121446012_c1640e42d0.jpg"
                         alt="T-Shirt Store">
                </div>
                <div class="pure-u-1-4">
                    <img class="pure-img-responsive" src="http://farm8.staticflickr.com/7357/9086701425_fda3024927.jpg"
                         alt="Mountain">
                </div>
            </div>

            <h2 class="content-subhead">Try Resizing your Browser</h2>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
            </p>



            <p>
                For example, here's a Bootstrap Modal. It's created by including the Pure CSS Rollup, and just adding
                Bootstrap's <a href="/css/bootstrap/modal.css"><code>modal.css</code></a> along with the jQuery plugin.
            </p>

            <!-- Button to trigger modal -->
            <p>
                <a href="#myModal" role="button" class="pure-button-primary pure-button" data-toggle="modal">
                    Launch Pure + Bootstrap Modal
                </a>
            </p>

        </div>
    </div>

    <!-- Modal -->
    <!--
     * Bootstrap v2.3.2
     *
     * Copyright 2012 Twitter, Inc
     * Licensed under the Apache License v2.0
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Designed and built with all the love in the world @twitter by @mdo and @fat.
     -->
    <div id="myModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
         aria-hidden="true">
        <div class="modal-header">
            <h1 id="myModalLabel">A Bootstrap Modal with Pure</h1>
        </div>

        <div class="modal-body">
            <p>
                This modal is launched by including <em>just</em> the <code>modal.css</code> and
                <code>modal.js</code> file from Bootstrap, and including Pure to drive all low-level styles. The
                result is a fully-functional Modal using just a fraction of the CSS.
            </p>

            <form class="pure-form pure-form-stacked">
                <legend>A Stacked Form</legend>

                <label for="email">Email</label>
                <input id="email" type="text" placeholder="Email">

                <label for="password">Password</label>
                <input id="password" type="password" placeholder="Password">

                <label for="state">State</label>
                <select id="state">
                    <option>AL</option>
                    <option>CA</option>
                    <option>IL</option>
                </select>

                <label class="pure-checkbox">
                    <input type="checkbox"> Remember me
                </label>
            </form>
        </div>

        <div class="modal-footer">
            <button class="pure-button" data-dismiss="modal" aria-hidden="true">Close</button>
            <button class="pure-button pure-button-primary">Submit</button>
        </div>
    </div>

    <script language="JavaScript" type="text/javascript" src="https://code.jquery.com/jquery-1.9.1.js"></script>
    <script language="JavaScript" type="text/javascript" src="https://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script>


</div>
</body>
</html>
