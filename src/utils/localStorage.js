import Storage from 'web-storage-cache'

const localStorage = new Storage()

export function getLocalStorage(key) {
  return localStorage.get(key)
}

export function removeLocalStorage(key) {
  return localStorage.delete(key)
}

export function clearLocalStorage() {
  return localStorage.clear()
}

export function setLocalStorage(key, value, expire = 30 * 24 * 3600) {
  return localStorage.set(key, value, { exp: expire })
}

export function getBookObject(fileName, key) {
  let book = localStorage.get(`${fileName}-info`) 
  if (book) {
    return book[key]
  } else {
    return null
  }
}

export function setBookObject(fileName, key, value) {
  let book = localStorage.get(`${fileName}-info`)
  if (!book) {
    book = {}
  }
  book[key] = value
  setLocalStorage(`${fileName}-info`, book)
}

export function getHome() {
  return localStorage.get('home')
}

export function saveHome(home) {
  return setLocalStorage('home', home, 1800)
}

export function getLocale() {
  return localStorage.get('locale')
}

export function saveLocale(locale) {
  return setLocalStorage('locale', locale)
}

export function getLocation(fileName) {
  return getBookObject(fileName, 'location')
}

export function saveLocation(fileName, location) {
  setBookObject(fileName, 'location', location)
}

export function getBookmark(fileName) {
  return getBookObject(fileName, 'bookmark')
}

export function saveBookmark(fileName, bookmark) {
  setBookObject(fileName, 'bookmark', bookmark)
}

export function getReadTime(fileName) {
  return getBookObject(fileName, 'time')
}

export function saveReadTime(fileName, theme) {
  setBookObject(fileName, 'time', theme)
}

export function getProgress(fileName) {
  return getBookObject(fileName, 'progress')
}

export function saveProgress(fileName, progress) {
  setBookObject(fileName, 'progress', progress)
}

export function getNavigation(fileName) {
  return getBookObject(fileName, 'navigation')
}

export function saveNavigation(fileName, navigation) {
  setBookObject(fileName, 'navigation', navigation)
}

export function getMetadata(fileName) {
  return getBookObject(fileName, 'metadata')
}

export function saveMetadata(fileName, metadata) {
  setBookObject(fileName, 'metadata', metadata)
}

export function getCover(fileName) {
  return getBookObject(fileName, 'cover')
}

export function saveCover(fileName, cover) {
  setBookObject(fileName, 'cover', cover)
}

export function getFontFamily(fileName) {
  return getBookObject(fileName, 'fontFamily')
}

export function saveFontFamily(fileName, fontFamily) {
  setBookObject(fileName, 'fontFamily', fontFamily)
}

export function getTheme(fileName) {
  return getBookObject(fileName, 'theme')
}

export function saveTheme(fileName, theme) {
  setBookObject(fileName, 'theme', theme)
}

export function getFontSize(fileName) {
  return getBookObject(fileName, 'fontSize')
}

export function saveFontSize(fileName, fontSize) {
  setBookObject(fileName, 'fontSize', fontSize)
}

export function saveBookShelf(shelf) {
  return setLocalStorage('shelf',shelf);
}

export function getBookShelf() {
  return localStorage.get('shelf');
}

export function appendAddToBookList(bookList) {
  bookList.push({
    cover: '',
    title: '',
    type: 3,
    id: Number.MAX_SAFE_INTEGER
  })
}

export function clearAddFromBookList(bookList) {
  return bookList.filter(item => {
    return item.type !== 3
  })
}

export function flatBookList(bookList) {
  if (bookList) {
    let orgBookList = bookList.filter(item => {
      return item.type !== 3
    })
    const categoryList = bookList.filter(item => {
      return item.type === 2
    })
    categoryList.forEach(item => {
      const index = orgBookList.findIndex(v => {
        return v.id === item.id
      })
      if (item.itemList) {
        item.itemList.forEach(subItem => {
          orgBookList.splice(index, 0, subItem)
        })
      }
    })
    orgBookList.forEach((item, index) => {
      item.id = index + 1
    })
    orgBookList = orgBookList.filter(item => item.type !== 2)
    return orgBookList
  } else {
    return []
  }
}

export function removeBookCache(fileName) {
  return new Promise(() => {//resolve, reject
    localStorage.delete(fileName)
    localStorage.delete(`${fileName}-info`)
    // removeLocalForage(fileName, () => {
    //   console.log(`[${fileName}]删除成功...`)
    //   resolve()
    // }, reject)
  })
}

export function switchLocale(vue) {
  if (vue.$i18n.locale === 'en') {
    vue.$i18n.locale = 'cn'
  } else {
    vue.$i18n.locale = 'en'
  }
  setLocalStorage('locale', vue.$i18n.locale)
}