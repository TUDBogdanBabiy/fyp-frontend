<template>
  <q-layout
    v-if="$route.path == '/login' || $route.path == '/register'"
    view="hHh lpR fFf"
  >
    <q-header elevated class="bg-accent text-white">
      <q-toolbar>
        <q-toolbar-title
          @click="$router.push('/home')"
          style="cursor: pointer;"
        >
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" />
          </q-avatar>
          Park Manager
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
  <router-view v-else></router-view>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>
