const book = {
    fileName: state => state.book.fileName,
    menuVisible: state => state.book.menuVisible,
    settingVisible: state => state.book.settingVisible,
    selectedFontSize: state => state.book.selectedFontSize,
    currentBook: state => state.book.currentBook,
    selectedFontFamily: state => state.book.selectedFontFamily,
    fontFamilyVisible: state => state.book.fontFamilyVisible,
    selectedTheme: state => state.book.selectedTheme,
}

export default book