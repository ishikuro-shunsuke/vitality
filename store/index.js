export const state = () => ({
  snackbar: {
    display: false,
    text: '',
  },
})

export const mutations = {
  print(state, message) {
    state.snackbar.display = true
    state.snackbar.text = message
    console.log('[Vitality]', message)
  },
  clearAlert(state) {
    state.snackbar.display = false
  },
}
