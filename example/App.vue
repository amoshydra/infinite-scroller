<template>
  <div>
    <h1>Inifinite scroller</h1>
    <InfiniteScroller
      v-bind="infiniteScrollerOption"
    ></InfiniteScroller>
  </div>
</template>

<script>
import InfiniteScroller from './../src/infinite-scroller';
import ExampleItem from './ExampleItem';
import fetcher from './fetcher';

export default {
  components: {
    ExampleItem,
    InfiniteScroller,
  },
  data() {
    return {
      infiniteScrollerOption: {
        height: 400,
        itemHeight: 60,
        itemComponent: ExampleItem,
        itemFetcher: this.$_infiniteScrollerItemComponent_fetcher,
        allowance: 10,
        initialStartIndex: 0,
      }
    };
  },
  methods: {
    $_infiniteScrollerItemComponent_fetcher({ from, count }) {
      return fetcher.fetch('/list', { from, count });
    },
  }
};
</script>

<style>

</style>
