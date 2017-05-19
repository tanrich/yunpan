export function saveLocalStorage (value, state) {
  let user = window.localStorage.__user__
  if (!user) {
    user = {
      username: '',
      hasLogin: ''
    }
  } else {
    user = JSON.parse(user)
    for (let k in user) {
      if (!k) {
        user[k] = ''
      }
    }
  }
  user = {
    username: value,
    hasLogin: state
  }
  window.localStorage.__user__ = JSON.stringify(user)
}
export function getLocalStorage (df) {
  let user = window.localStorage.__user__
  if (!user) {
    return df
  }
  let userState = JSON.parse(user)['hasLogin']
  if (!userState) {
    return df
  }
  return user
}
