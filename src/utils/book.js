const FONT_SIZE_LIST = [
    { fontSize: 12 },
    { fontSize: 14 },
    { fontSize: 16 },
    { fontSize: 18 },
    { fontSize: 20 },
    { fontSize: 22 },
    { fontSize: 24 }
]

const FONT_FAMILY_LIST = [
    { font: 'Cabin' },
    { font: 'Days One' },
    { font: 'Montserrat' },
    { font: 'Tangerine' }
]

const themeList = (vue) => {
    return [
        {
          alias: vue.$t('book.themeDefault'),
          name: 'Default',
          style: {
            body: {
              'color': '#4c5059',
              'background': '#cecece'
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
              'background': '#c6c2b6'
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
              'background': '#a9c1a9'
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
              'background': '#000000'
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

const addCss = (href) => {
	const link = document.createElement('link');
	link.setAttribute('rel','stylesheet');
	link.setAttribute('type','text/css');
	link.setAttribute('href',href);
	document.getElementsByTagName('head')[0].appendChild(link);
}

const removeCss = (href) => {
	let links = document.getElementsByTagName('link');
	for(let i = links.length;i>=0;i--){
		let link = links[i];
		if(link&&link.getAttribute('href')&&link.getAttribute('href')===href){
			link.parentNode.removeChild(link);
		}
	}
}

const removeAllCss = () => {
	let styles = ['theme_default','theme_gold','theme_eye','theme_night'];
	for(let style of styles){
		removeCss(`${process.env.VUE_APP_STATIC_URL}theme/` + style + '.css');
	}
}

module.exports = {
    FONT_SIZE_LIST,
    FONT_FAMILY_LIST,
    themeList,
	addCss,
	removeAllCss
}