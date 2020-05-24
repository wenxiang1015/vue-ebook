import axios from 'axios'
import {setLocalForage} from "../utils/localForage";

export function flatList () {
    return axios({
        method: 'get',
        url: `${process.env.VUE_APP_BOOK_URL}/book/flat-list`
    })
}

export function download(book,onSuccess,onProgress,onError) {
    return axios.create({
        baseURL: process.env.VUE_APP_STATIC_URL + '/epub',
        method: "GET",
        responseType: "blob",
        timeout: 180 * 1000,
        onDownloadProgress: progressEvent => {
            if(onProgress) onProgress(progressEvent)
        }
    }).get(`${book.categoryText}/${book.fileName}.epub`).then(res => {
        /**
         * blob 中的参数要求必须实现 iterator 接口
         * 这里的 [] 只是把 res.data 作为数组的第一个元素
         */
        const blob = new Blob([res.data]);
        //保存到 indexDB
        setLocalForage(book.fileName,blob,()=>{
            if(onSuccess) onSuccess(book)
        },err => {
            if(onError) onError(err)
        })
    }).catch(err => {
        if(onError) onError(err)
    })
}

export function home() {
    return axios({
        method: 'get',
        url: `${process.env.VUE_APP_BASE_URL}/book/home`
    })
}

export function detail(book) {
    return axios({
        method: 'get',
        url: `${process.env.VUE_APP_BASE_URL}/book/detail`,
        params: {
            fileName: book.fileName
        }
    })
}

export function list() {
    return axios({
        method: 'get',
        url: `${process.env.VUE_APP_BASE_URL}/book/list`
    })
}

export function shelf() {
    return axios({
        method: 'get',
        url: `${process.env.VUE_APP_BASE_URL}/book/shelf`
    })
}