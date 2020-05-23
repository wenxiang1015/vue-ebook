const book = {
    fileName: state => state.book.fileName,
    menuVisible: state => state.book.menuVisible,
    settingVisible: state => state.book.settingVisible,
    selectedFontSize: state => state.book.selectedFontSize,
    currentBook: state => state.book.currentBook,
    selectedFontFamily: state => state.book.selectedFontFamily,
    fontFamilyVisible: state => state.book.fontFamilyVisible,
    selectedTheme: state => state.book.selectedTheme,
    bookAvailable: state => state.book.bookAvailable,
    progress: state => state.book.progress,
    section: state => state.book.section,
    cover: state => state.book.cover,
    metadata: state => state.book.metadata,
    navigation: state => state.book.navigation,
    offsetY: state => state.book.offsetY,
    isBookmark: state => state.book.isBookmark,
    paginate: state => state.book.paginate,
    pagelist: state => state.book.pagelist,

    hotSearchOffsetY: state => state.store.hotSearchOffsetY,
    flapCardVisible: state => state.store.flapCardVisible,
    isEditMode: state => state.store.isEditMode,
    shelfList: state => state.store.shelfList,
    shelfSelected: state => state.store.shelfSelected,
    shelfTitleVisible: state => state.store.shelfTitleVisible,
    shelfCategory: state => state.store.shelfCategory,
    currentType: state => state.store.currentType
}

export default book