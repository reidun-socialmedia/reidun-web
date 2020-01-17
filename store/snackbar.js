export const state = () => ({
  snack: '',
  color: '',
  top: '',
});

export const mutations = {
  setSnackColor(state, color) {
    state.color = color;
  },
  setSnackTop(state, top) {
    state.top = top;
  },
  setSnack(state, snack) {
    state.snack = snack;
  }
};

