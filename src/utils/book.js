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

const themeList = (vue)=>{
    return [
        {
          alias: vue.$t('book.themeDefault'),
          name: 'Default',
          style: {
            body: {
              'color': '#4c5059',
              'background': '#cecece',

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

module.exports = {
    FONT_SIZE_LIST,
    FONT_FAMILY_LIST,
    themeList
}