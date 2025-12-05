export const staggeredPop = {
  initial: (index) => ({
    opacity: 0.5,
    scale: 0,
    transition: {
      delay: 0,
      duration: 0.25,
    },
  }),
  animate: (index) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.2 * index,
      duration: 0.3,
    },
  }),
};
