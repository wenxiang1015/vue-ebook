const actions = {
    setFileName({ commit }, fileName) {
        return commit('SET_FILE_NAME', fileName);
    },
    setMenuVisible({ commit }, menuVisible) {
        return commit('SET_MENU_VISIBLE', menuVisible);
    },
    setSettingVisible({ commit }, settingVisible) {
        return commit('SET_SETTING_VISIBLE', settingVisible);
    },
    setSelectedFontSize({ commit }, selectedFontSize) {
        return commit('SET_SELECTED_FONT_SIZE', selectedFontSize);
    },
    setCurrentBook: ({ commit }, currentBook) => {
        return commit('SET_CURRENT_BOOK', currentBook)
    },
    setSelectedFontFamily: ({ commit }, selectedFontFamily) => {
        return commit('SET_SELECTED_FONT_FAMILY', selectedFontFamily)
    },
    setFontFamilyVisible: ({ commit }, fontFamilyVisible) => {
        return commit('SET_FONT_FAMILY_VISIBLE', fontFamilyVisible)
    },
    setSelectedTheme: ({ commit }, selectedTheme) => {
        return commit('SET_SELECTED_THEME', selectedTheme)
    },
    setBookAvailable: ({ commit }, bookAvailable) => {
        return commit('SET_BOOK_AVAILABLE', bookAvailable)
    },
    setProgress: ({ commit }, progress) => {
        return commit('SET_PROGRESS', progress)
    },
    setSection: ({ commit }, section) => {
        return commit('SET_SECTION', section)
    },
    setCover: ({ commit }, cover) => {
        return commit('SET_COVER', cover)
    },
    setMetadata: ({ commit }, metadata) => {
        return commit('SET_METADATA', metadata)
    },
    setNavigation: ({ commit }, navigation) => {
        return commit('SET_NAVIGATION', navigation)
    },
    setOffsetY({ commit }, offsetY) {
        return commit('SET_OFFSETY', offsetY)
    },
    setIsBookmark({ commit }, isBookmark) {
        return commit('SET_IS_BOOKMARK', isBookmark)
    },
    setPaginate: ({ commit }, paginate) => {
        return commit('SET_PAGINATE', paginate)
    },
    setPagelist: ({ commit }, pagelist) => {
        return commit('SET_PAGELIST', pagelist)
    },

    setHotSearchOffsetY: ({ commit }, hotSearchOffsetY) => {
        return commit('SET_HOT_SEARCH_OFFSETY',hotSearchOffsetY)
    },
    setFlapCardVisible: ({ commit }, flapCardVisible) => {
        return commit('SET_FLAP_CARD_VISIBLE',flapCardVisible)
    },
    setIsEditMode: ({ commit }, isEditMode) => {
        return commit('SET_IS_EDIT_MODE',isEditMode)
    },
    setShelfList: ({ commit }, shelfList) => {
        return commit('SET_SHELF_LIST',shelfList)
    },
    setShelfSelected: ({ commit }, shelfSelected) => {
        return commit('SET_SHELF_SELECTED',shelfSelected)
    },
    setShelfTitleVisible: ({ commit }, shelfTitleVisible) => {
        return commit('SET_SHELF_TITLE_VISIBLE',shelfTitleVisible)
    },
    setShelfCategory ({ commit }, shelfCategory) {
        return commit('SET_SHELF_CATEGORY', shelfCategory)
    },
    setCurrentType ({ commit }, currentType) {
        return commit('SET_SHELF_CURRENT_TYPE', currentType)
    }
}

export default actions;