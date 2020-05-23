import { getReadTime } from "./localStorage"
import { realPx } from './utils'

export const FONT_SIZE_LIST = [
  { fontSize: 12 },
  { fontSize: 14 },
  { fontSize: 16 },
  { fontSize: 18 },
  { fontSize: 20 },
  { fontSize: 22 },
  { fontSize: 24 }
]

export const FONT_FAMILY_LIST = [
  { font: 'Default' },
  { font: 'Cabin' },
  { font: 'Days One' },
  { font: 'Montserrat' },
  { font: 'Tangerine' }
]

export function themeList(vue) {
  return [
    {
      alias: vue.$t('book.themeDefault'),
      name: 'Default',
      style: {
        body: {
          'color': '#4c5059',
          'background': '#cecece',
          'padding-top': `${realPx(48)}px!important`,
          'padding-bottom': `${realPx(48)}px!important`
        },
        img: {
          'width': '100%'
        },
        '.epubjs-hl': {
          'fill': 'red', 'fill-opacity': '0.3', 'mix-blend-mode': 'multiply'
        }
      }
    },
    {
      alias: vue.$t('book.themeGold'),
      name: 'Gold',
      style: {
        body: {
          'color': '#5c5b56',
          'background': '#c6c2b6',
          'padding-top': `${realPx(48)}px!important`,
          'padding-bottom': `${realPx(48)}px!important`
        },
        img: {
          'width': '100%'
        },
        '.epubjs-hl': {
          'fill': 'red', 'fill-opacity': '0.3', 'mix-blend-mode': 'multiply'
        }
      }
    },
    {
      alias: vue.$t('book.themeEye'),
      name: 'Eye',
      style: {
        body: {
          'color': '#404c42',
          'background': '#a9c1a9',
          'padding-top': `${realPx(48)}px!important`,
          'padding-bottom': `${realPx(48)}px!important`
        },
        img: {
          'width': '100%'
        },
        '.epubjs-hl': {
          'fill': 'red', 'fill-opacity': '0.3', 'mix-blend-mode': 'multiply'
        }
      }
    },
    {
      alias: vue.$t('book.themeNight'),
      name: 'Night',
      style: {
        body: {
          'color': '#cecece',
          'background': '#000000',
          'padding-top': `${realPx(48)}px!important`,
          'padding-bottom': `${realPx(48)}px!important`
        },
        img: {
          'width': '100%'
        },
        '.epubjs-hl': {
          'fill': 'red', 'fill-opacity': '0.3', 'mix-blend-mode': 'multiply'
        }
      }
    }
  ]
}

export function addCss(href) {
	const link = document.createElement('link');
	link.setAttribute('rel','stylesheet');
	link.setAttribute('type','text/css');
	link.setAttribute('href',href);
	document.getElementsByTagName('head')[0].appendChild(link);
}

export function removeCss(href) {
	let links = document.getElementsByTagName('link');
	for(let i = links.length;i>=0;i--){
		let link = links[i];
		if(link&&link.getAttribute('href')&&link.getAttribute('href')===href){
			link.parentNode.removeChild(link);
		}
	}
}

export function removeAllCss() {
	let styles = ['theme_default','theme_gold','theme_eye','theme_night'];
	for(let style of styles){
		removeCss(`${process.env.VUE_APP_STATIC_URL}/theme/` + style + '.css');
	}
}

export function getReadTimeByMinute(fileName) {
  const readTime = getReadTime(fileName);
  if(!readTime){
    return 0;
  }else{
    return Math.ceil(readTime/60);
  }
}

//二维数组转一维数组(递归循环出所有的元素,处理之后所有的子项 subitems = [],也叫扁平化处理)
export function flatten(array) {
  return [].concat(...array.map(item=>[].concat(item,...flatten(item.subitems))));
}