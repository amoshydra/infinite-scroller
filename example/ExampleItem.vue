<template>
  <div class="item">
    <div class="item__name">
      {{ item.uid }} {{ item.name }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExampleItem',
  props: {
    item: {
      type: Object,
      default: () => ({
        uid: '~',
        name: '...',
      })
    },
  },
};
</script>

<style>
.item {
  border: 1px solid black;
  padding: 20px;
}
.item__name {
}
</style>
