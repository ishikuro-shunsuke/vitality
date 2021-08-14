export const toyyyymmdd = d => {
  const yyyy = `${d.getFullYear()}`
  const mm = `0${d.getMonth() + 1}`.slice(-2)
  const dd = `0${d.getDate()}`.slice(-2)
  return `${yyyy}-${mm}-${dd}`
}

export default ({ app }, inject) => {
  inject('toyyyymmdd', toyyyymmdd)
}