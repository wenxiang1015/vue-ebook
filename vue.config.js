function mock(app,url,data){
    app.get(url,(request,response)=>{
 //       response.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
        response.json(data);
    })
}

const homeData = require('./src/mock/bookHome')
const shelfData = require('./src/mock/bookShelf')
const listData = require('./src/mock/bookList')
const flatListData = require('./src/mock/bookFlatList')

module.exports = {
    publicPath: process.env.NODE_ENV === 'production'?'./':'/',
    devServer: {
        //应用启动之前
        before(app){
            mock(app,'/book/home',homeData)
            mock(app,'/book/shelf',shelfData)
            mock(app,'/book/list',listData)
            mock(app,'/book/flat-list',flatListData)
        },
        proxy: {
            '/book/detail': {
                target: 'http://47.99.166.157:3000'
            }
        }
    },
    configureWebpack: {
        performance: {
            hints: 'warning',
            maxAssetSize: 524288,
            maxEntrypointSize: 524288
        }
    }
}