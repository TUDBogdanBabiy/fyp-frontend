<template>
  <div id="q-app">
    <Base />
  </div>
</template>
<script>
import Base from "./layouts/Base";
export default {
  name: "App",
  components: {
    Base
  }
};
</script>

<style scoped lang="scss">
#q-app {
  background-color: $grey-1;
}
</style>
