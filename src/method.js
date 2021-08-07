// 除了 get 从 url query 中获取参数，其他均从请求体中获取
module.exports = {
    GET: 'param',
    POST: 'post',
    PUT: 'post',
    DELETE: 'post',
    PATCH: 'post',
    LINK: 'post',
    UNLINK: 'post'
}