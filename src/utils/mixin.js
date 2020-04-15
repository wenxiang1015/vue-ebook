import { mapGetters, mapActions } from 'vuex';
import { themeList,addCss,removeAllCss } from './book';
import { saveLocation } from './localStorage'

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
            "selectedTheme",
            'bookAvailable',
            'progress',
            'section',
        ]),
		//因为有两个组件都用到这个属性,写成计算属性而不是 data 是为了减少频繁调用 themeList(this)
		themeList(){
			return themeList(this);
		}
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
            'setSelectedTheme',
            'setBookAvailable',
            'setProgress',
            'setSection',
        ]),
		setGlobalStyle(){
			removeAllCss();
			let styleName = 'theme_default';
			switch(this.selectedTheme){
				case 'Default': styleName = 'theme_default'; break;
				case 'Gold': styleName = 'theme_gold'; break;
				case 'Eye': styleName = 'theme_eye'; break;
				case 'Night': styleName = 'theme_night'; break;
			}
			addCss(`${process.env.VUE_APP_STATIC_URL}theme/` + styleName + '.css');
        },
        refreshLocation() {
          const currentLocation = this.currentBook.rendition.currentLocation();
          const startCfi = currentLocation.start.cfi;
          //初次加载的时候,分页还没有完成,可能导致 progress 获取不到
          const progress = this.currentBook.locations.percentageFromCfi(startCfi);
          this.setSection(currentLocation.start.index);
          this.setProgress(Math.floor(progress * 100));
          saveLocation(this.fileName,startCfi);
        },
        display(cfi,cb){
            if(cfi){
                this.currentBook.rendition.display(cfi).then(()=>{
                    this.refreshLocation();
                    if(cb) cb();
                })
            } else {
                this.currentBook.rendition.display().then(()=>{
                    this.refreshLocation();
                    if(cb) cb();
                })
            }
        }
    }
}