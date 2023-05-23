<template>
  <div id="app">
    <div class="msg-recall" style="display: none">
      <ul>
        <li class="recall">撤回</li>
      </ul>
    </div>
    <router-view />
  </div>
</template>

<style lang="less">
#app {
  width: 1100px;
  margin: 100px auto;
}

.msg-recall {
  position: absolute;
  left: 0;
  top: 0;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;

    li {
      padding: 5px 5px;
      cursor: pointer;

      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>
