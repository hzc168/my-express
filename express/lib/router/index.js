const url = require('url')
const methods = require('methods')
// const pathRegexp = require('path-to-regexp')
const Layer = require('./layer')
const Route = require('./route')

function Router() {
    this.stack = []
}

methods.forEach(method => {
    Router.prototype[method] = function (path, handlers) {
        // this.stack.push({
        //     path,
        //     method,
        //     handler
        // })
        // const layer = new Layer(path, handler)
        // layer.method = method
        // this.stack.push(layer)
        const route = new Route()
        const layer = new Layer(path, route.dispatch.bind(route))
        layer.route = route
        this.stack.push(layer)
        route[method](path, handlers)
    }
})


Router.prototype.handle = function (req, res) {
    const { pathname } = url.parse(req.url)
    const method = req.method.toLocaleLowerCase()

    // 处理中间件
    let index = 0
    const next = () => {
        if (index >= this.stack.length) {
            return res.end(`Can not get ${pathname}`)
        }
        const layer = this.stack[index++]
        const match = layer.match(pathname)
        if (match) {
            req.params = req.params || {}
            Object.assign(req.params, layer.params)
        }
        // if (match && layer.method === method) {
        // 顶层只判定请求路径，内层判定请求方法
        if (match) {
            // 顶层这里调用 handler 其实就是 dispatch 函数
            return layer.handler(req, res, next)
        }
        next()
    }
    next()


    // // const route = this.stack.find(route => {
    // const layer = this.stack.find(layer => {
    //     // const keys = []
    //     // const regexp = pathRegexp(route.path, keys, {})
    //     // const match = regexp.exec(pathname)
    //     const match = layer.match(pathname)
    //     // console.log('keys => ', keys)
    //     // console.log('match => ', match)
    //     if (match) {
    //         req.params = req.params || {}
    //         // keys.forEach((key, index) => {
    //         //     req.params[key.name] = match[index + 1]
    //         // })
    //         Object.assign(req.params, layer.params)
    //     }
    //     return match && layer.method === method
    // })
    // if (layer) {
    //     return layer.handler(req, res)
    // }
    // res.end('404 not found.')
}

Router.prototype.use = function (path, handlers) {
    if (typeof path === 'function') {
        handlers.unshift(path)
        path = '/'

    }
    handlers.forEach(handler => {
        const layer = new Layer(path, handler)
        layer.isUseMiddleware = true
        this.stack.push(layer)
    })
}

module.exports = Router