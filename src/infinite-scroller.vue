<template>
  <div
    class="infinite-scroller"
    :style="{
      height: `${height}px`,
    }"
  >
    <component :is="itemComponent"
      v-for="(item, index) in pagination.items"
      :key="item.uid"
      :item="item"
      class="infinite-scroller__item"
      :style="{
        transform: `translateY(${(index + (Math.max(0, pagination.from - allowance))) * itemHeight}px)`
      }"
    />
    <div
      class="infinite-scroller__item"
      :style="{
        transform: `translateY(${pagination.total * itemHeight}px)`
      }"
    />
  </div>
</template>

<script>
import debounce from 'lodash/debounce';

export default {
  props: {
    height: {
      type: Number,
      default: 400,
    },
    itemHeight: {
      type: Number,
      required: true,
    },
    itemComponent: {
      type: Object,
      required: true,
    },
    itemFetcher: {
      type: Function,
      required: true,
    },
    allowance: {
      type: Number,
      default: 10,
    },
    initialStartIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      scrollPosition: 0,
      pagination: {
        from: this.initialStartIndex,
        count: 10,
        total: 0,
        items: [],
      },
      onGoingRequest: {
        from: null,
      },
    };
  },
  computed: {
    viewableFirstIndex() {
      return Math.floor(this.scrollPosition / this.itemHeight);
    },
    viewableLastIndex() {
      return Math.floor(
        (this.scrollPosition + (parseInt(this.height, 10)))
        / this.itemHeight
      );
    },
  },
  watch: {
    viewableFirstIndex(viewableFirstIndex) {
      const distance = viewableFirstIndex - this.pagination.from;

      if (distance < -(this.allowance / 2)) {
        if (this.viewableFirstIndex != this.onGoingRequest.from) {
          this.$_fetchItem({
            from: this.viewableFirstIndex,
            count: this.viewableLastIndex - this.viewableFirstIndex,
          });
        }
      }
    },
    viewableLastIndex(viewableLastIndex) {
      const distance = (this.pagination.from + this.pagination.count) - viewableLastIndex;
      
      if (distance < -(this.allowance / 2)) {
        if (this.viewableFirstIndex != this.onGoingRequest.from) {
          this.$_fetchItem({
            from: this.viewableFirstIndex,
            count: this.viewableLastIndex - this.viewableFirstIndex,
          });
        }
      }
    },
  },
  created() {
    this.showScrollFeedbackHandler = debounce(this.showScrollFeedback.bind(this), 50);
  },
  beforeDestroy() {
    this.$el.removeEventListener('scroll', this.showScrollFeedbackHandler);
  },
  mounted() {
    this.$el.addEventListener('scroll', this.showScrollFeedbackHandler);
    this.$_fetchItem(this.pagination)
      .then(() => {
        this.$nextTick(() => {
          this.$el.scrollTop = this.pagination.from  * this.itemHeight;
        })
      });
  },
  methods: {
    showScrollFeedback(event) {
      this.scrollPosition = this.$el.scrollTop;
    },
    $_fetchItem(requestPagination) {
      this.onGoingRequest.from = requestPagination.from;
      this.onGoingRequest.count = requestPagination.count;

      return this.itemFetcher({
        from: Math.max(0, requestPagination.from - this.allowance),
        count: requestPagination.count + (this.allowance * 2),
      })
        .then((pagination) => {
          const actualFrom = Math.min((pagination.from + this.allowance), requestPagination.from);
          this.pagination = {
            ...pagination,
            from: actualFrom,
            count: requestPagination.count,
          };
        })
        .catch(() => {

        })
        .then(() => {
          this.onGoingRequest.from = null;
          this.onGoingRequest.count = null;
        })
    }
  },
}
</script>

<style>
.infinite-scroller {
  overflow-y: scroll;
  position: relative;
}

.infinite-scroller__item {
  position: absolute;
  width: calc(100% - 200px);
}
.infinite-scroller__item:last-child {
  height: 1px;
  width: 1px;
}

</style>
