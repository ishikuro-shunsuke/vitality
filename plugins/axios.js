export default function ({ $axios, store }) {
  $axios.onError((error) => {
    store.commit('print', error)
  })
}
