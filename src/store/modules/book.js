const book = {
  state: {
    fileName: '',
    menuVisible: false,
    settingVisible: -1,// -1.不显示 0.字体 1.主题 2.进度 3.目录
    selectedFontSize: 16,
    currentBook: null,
    selectedFontFamily: 'Days One',
    fontFamilyVisible: false,
    selectedTheme: 'Default',
    bookAvailable: false,//分页是否完成
    progress: 0,
    section: 0,//章节
    cover: null,//封面图片
    metadata: null,//图书元信息
    navigation: null,//目录
    offsetY: 0,//下拉偏移量
    isBookmark: false,//当前页是否是书签页
    paginate: '',// 分页信息
    pagelist: null,//分页后的 location 集合
  },
  mutations: {
    SET_FILE_NAME(state, fileName) {
      state.fileName = fileName;
    },
    SET_MENU_VISIBLE(state, menuVisible) {
      state.menuVisible = menuVisible;
    },
    SET_SETTING_VISIBLE(state, settingVisible) {
      state.settingVisible = settingVisible;
    },
    SET_SELECTED_FONT_SIZE(state, selectedFontSize) {
      state.selectedFontSize = selectedFontSize;
    },
    SET_CURRENT_BOOK: (state, currentBook) => {
      state.currentBook = currentBook
    },
    SET_SELECTED_FONT_FAMILY: (state, selectedFontFamily) => {
      state.selectedFontFamily = selectedFontFamily
    },
    SET_FONT_FAMILY_VISIBLE: (state, fontFamilyVisible) => {
      state.fontFamilyVisible = fontFamilyVisible
    },
    SET_SELECTED_THEME: (state, selectedTheme) => {
      state.selectedTheme = selectedTheme
    },
    'SET_BOOK_AVAILABLE': (state, bookAvailable) => {
      state.bookAvailable = bookAvailable
    },
    'SET_PROGRESS': (state, progress) => {
      state.progress = progress
    },
    'SET_SECTION': (state, section) => {
      state.section = section
    },
    'SET_COVER': (state, cover) => {
      state.cover = cover
    },
    'SET_METADATA': (state, metadata) => {
      state.metadata = metadata
    },
    'SET_NAVIGATION': (state, navigation) => {
      state.navigation = navigation
    },
    'SET_OFFSETY': (state, offsetY) => {
      state.offsetY = offsetY
    },
    'SET_IS_BOOKMARK': (state, isBookmark) => {
      state.isBookmark = isBookmark
    },
    'SET_PAGINATE': (state, paginate) => {
      state.paginate = paginate
    },
    'SET_PAGELIST': (state, pagelist) => {
      state.pagelist = pagelist
    },
  }
}

export default book