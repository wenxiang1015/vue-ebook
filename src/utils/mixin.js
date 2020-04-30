import { mapGetters, mapActions } from 'vuex';
import { themeList,addCss,removeAllCss,getReadTimeByMinute } from './book';
import { saveLocation, getBookmark } from './localStorage'

export const ebookMixin = {
    computed: {
        ...mapGetters([
            "fileName",
            "menuVisible",//上下菜单是否显示 true 显示 false 隐藏
            "settingVisible",
            "selectedFontSize",
            "currentBook",
            "selectedFontFamily",
            "fontFamilyVisible",
            "selectedTheme",
            'bookAvailable',//分页是否完成 true 完成 false 未完成
            'progress',
            'section',
            'cover',
            'metadata',
            'navigation',
            'offsetY',
            'isBookmark',
            'paginate',
            'pagelist',
        ]),
		//因为有两个组件都用到这个属性,写成计算属性而不是 data 是为了减少频繁调用 themeList(this)
		themeList(){
			return themeList(this);
        },
        getSectionName(){
            // if (this.section) {
            //   const sectionInfo = this.currentBook.section(this.section);
            //   if (sectionInfo && sectionInfo.href && this.currentBook.navigation) {
            //     return this.currentBook.navigation.get(sectionInfo.href).label;//这里只能获取一级目录
            //   }
            // }
            // return ''
        
            //navigation 中的 index 对应 this.section
            if(this.section&&this.navigation[this.section]){
                return this.navigation[this.section].label;
            }
            return '';
        },
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
            'setCover',
            'setMetadata',
            'setNavigation',
            'setOffsetY',
            'setIsBookmark',
            'setPaginate',
            'setPagelist',
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
          if(currentLocation&&currentLocation.start){
            // console.log(currentLocation)
            const startCfi = currentLocation.start.cfi;
            //初次加载的时候,分页还没有完成,可能导致 progress 获取不到
            const progress = this.currentBook.locations.percentageFromCfi(startCfi);
            this.setSection(currentLocation.start.index);
            this.setProgress(Math.floor(progress * 100));
            saveLocation(this.fileName,startCfi);
            const bookmask = getBookmark(this.fileName)
            let isBookmark = false;
            if(bookmask){
                //如果 bookmask 中的 item 包含 startCfi,说明当前页是书签页
                if(bookmask.some(item=>item.cfi === startCfi)){
                    isBookmark = true;
                }
            }
            this.setIsBookmark(isBookmark);
            let paginate = ''; 
            if(this.pagelist){
                const totalPage = this.pagelist.length
                const currentPage = currentLocation.start.location
                //currentPage 不能等于 0 ，因为没有分页的时候，所有的 location 都默认设置为 0
                if(currentPage && currentPage >0){
                    paginate = currentPage + '/' + totalPage;
                }
            }
            this.setPaginate(paginate)
          }
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
        },
        hideMenuVisible() {
            this.setMenuVisible(false);
            this.setSettingVisible(-1);
            this.setFontFamilyVisible(false);
        },
        getReadTimeText(){
          return this.$t('book.haveRead').replace('$1',getReadTimeByMinute(this.fileName));
        }
    }
}