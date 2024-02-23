import React from "react";
import {
  BrowserRouter,
  HashRouter,
  Link,
  MemoryRouter,
  NavLink,
  Route,
  Routes,
} from "react-router-dom";
import Father from "./Father";
import Uncle from "./Uncle";
import MyButton from "./EventButton";
import About from "./About";
import Home from "./Home";

const menus = [
  { url: "/home", component: Home, name: "Home" },
  { url: "/about", component: About, name: "About" },
];

function MenuRoutes() {
  const menuRoutes = menus.map((menu) => (
    <Route path={menu.url} Component={menu.component} />
  ));
  return <Routes>{menuRoutes}</Routes>;
}

function DynamicMenus() {
  const menus = [
    { title: "Home", id: 1, url: "/home" },
    { title: "About", id: 2, url: "/about" },
  ];
  const listItems = menus.map((menu) => (
    <div>
      <NavLink to={menu.url} className="link">
        {menu.title}
      </NavLink>
      <br />
    </div>
  ));

  return (
    <BrowserRouter>
      {listItems}
      {/*<MenuRoutes />*/}
      <Routes>
        <Route Component={Home} path="/home" />
        <Route Component={About} path="/about" />
      </Routes>
    </BrowserRouter>
  );
}

export default function App(properties) {
  return (
    <div style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
      I.Root my name is:
      {properties.name}
      <MyButton name="click me" />
      <Father />
      <Uncle />
      <h1>浏览器history路由[动态]</h1>
      <DynamicMenus />
      <h1>Hash 路由</h1>
      <a href="/blog">家目录</a>
      <br />
      <HashRouter>
        <Link target="_blank" to="http://www.baidu.com">
          百度
        </Link>
        <NavLink to="home" className="link">
          跳转Home页面
        </NavLink>
        <br />
        <NavLink to="about" className="link">
          跳转About页面
        </NavLink>
        <br />
        <Routes>
          <Route Component={Home} path="/home" />
          <Route Component={About} path="/about" />
        </Routes>
      </HashRouter>
      <h1>MemoryRouter 路由</h1>
      <MemoryRouter>
        <NavLink to="/home" className="link">
          跳转Home页面
        </NavLink>
        <br />
        <NavLink to="/about" className="link">
          跳转About页面
        </NavLink>
        <br />
        <Routes>
          <Route Component={Home} path="/home"></Route>
          <Route Component={About} path="/about" />
        </Routes>
      </MemoryRouter>
    </div>
  );
}
