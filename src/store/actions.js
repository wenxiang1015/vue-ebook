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
}

export default actions;