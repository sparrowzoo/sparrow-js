<template>
  <div id="app">
    <router-view keep-alive :key="$route.fullPath" />
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
    };
  },
  mounted() {
  }
}
</script>

<style>
#app {}
</style>
