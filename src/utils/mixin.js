import { mapGetters, mapActions } from "vuex";

export const ebookMixin = {
    computed: {
        ...mapGetters([
            "fileName",
            "menuVisible",
            "settingVisible",
            "selectedFontSize",
            "currentBook",
            "selectedFontFamily",
            "fontFamilyVisible",
            "selectedTheme"
        ])
    },
    methods: {
        ...mapActions([
            'setFileName',
            'setMenuVisible',
            'setSettingVisible',
            'setSelectedFontSize',
            'setCurrentBook',
            'setSelectedFontFamily',
            'setFontFamilyVisible',
            'setSelectedTheme'
        ]),
    }
}