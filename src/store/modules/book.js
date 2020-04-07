const book = {
  state: {
    fileName: '',
    menuVisible: false,
    settingVisible: -1,// -1.不显示 0.字体 1.主题 2.进度 3.目录
    selectedFontSize: 16,
    currentBook: null,
    selectedFontFamily: 'Days One',
    fontFamilyVisible: false,
    selectedTheme: 'Default'
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
  }
}

export default book