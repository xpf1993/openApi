import Cookies from 'js-cookie'
// 统一domain path sjzx_
let keyBefore = 'mpt_'
let myCookies = {
  set: function (key, value) {
    Cookies.set(`${keyBefore}${key}`, value)
  },
  get: function (key) {
    let getKey = Cookies.get(`${keyBefore}${key}`)
    return getKey
  },
  remove: function (key) {
    Cookies.remove(`${keyBefore}${key}`)
  }
}
export default myCookies