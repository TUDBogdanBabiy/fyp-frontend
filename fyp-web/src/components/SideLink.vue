<template>
  <q-item clickable :to="link" @click="onClick()">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-h5">{{ title }}</q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: "SideLink",
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ""
    },

    link: {
      type: [String, Object],
      default: "/"
    },

    icon: {
      type: String,
      default: ""
    },

    onClick: {
      type: Function,
      default: () => {
        return null;
      }
    }
  }
};
</script>
