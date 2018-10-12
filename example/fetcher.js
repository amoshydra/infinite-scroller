import list from './list.json';

export default {
  fetch(path, { from, count }) {
    console.log('fetching', from, `${count}0ms`);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          from,
          count,
          total: list.items.length,
          items: list.items.slice(from, from + count)
            .map((item, index) => ({
              ...item,
              uid: from + index,
            })),
        }
        )
      }, (1 || count * 10));
    });
  },
};