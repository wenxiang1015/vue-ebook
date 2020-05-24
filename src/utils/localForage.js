import localForage from 'localforage'

export function setLocalForage(key, data, cb, cb2) {
  localForage.setItem(key, data).then((value) => {
    if (cb) cb(value)
  }).catch(function(err) {
    if (cb2) cb2(err)
  })
}

export function getLocalForage(key, cb) {
  localForage.getItem(key, (err, value) => {
    if(cb) cb(err, value)
  })
}

export function removeLocalForage(key, cb, cb2) {
  localForage.removeItem(key).then(function() {
    if(cb) cb()
  }).catch(function(err) {
    if(cb2) cb2(err)
  })
}

export function clearLocalForage(cb, cb2) {
  localForage.clear().then(function() {
    if(cb) cb()
  }).catch(function(err) {
    if(cb2) cb2(err)
  })
}

export function lengthLocalForage(cb) {
  localForage.length().then(
    numberOfKeys => {
      if (cb) cb(numberOfKeys)
    }).catch(function() {//err
    // console.log(err)
  })
}

// export function iteratorLocalForage() {
//   localForage.iterate(function(value, key, iterationNumber) {
//     console.log([key, value],iterationNumber)
//   }).then(function() {
//     console.log('Iteration has completed')
//   }).catch(function(err) {
//     console.log(err)
//   })
// }

export function support() {
  const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || null
  if (indexedDB) {
    return true
  } else {
    return false
  }
}
