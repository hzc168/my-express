const express = require('./express')

const app = express()

app.get('/', (req, res) => {
    res.end('请求 /')
})

app.get('/about', (req, res) => {
    res.end('请求 /about')
})

app.post('/about', (req, res) => {
    res.end('请求post /about')
})

app.get('/ab?cd', (req, res) => {
    res.end('请求 /ab?cd')
})

app.get('/ab*cd', (req, res) => {
    res.end('请求 /ab*cd')
})

app.get('/users/:userId/books/:bookId', (req, res) => {
    console.log(req.params)
    res.end('请求 /users/:userId/books/:bookId')
})


app.get('/foo', (req, res, next) => {
    console.log('foo 1')
    setTimeout(()=> {
        next()
    }, 1000)
})

app.get('/foo', (req, res, next) => {
    console.log('foo 2')
        next()
})

app.get('/foo', (req, res) => {
    console.log('foo')
    res.end('请求 /foo')
})


app.get('/middleware', (req, res, next) => {
    console.log('middleware1')
    next()
}, (req, res, next) => {
    console.log('middleware2')
    next()
})

app.get('/middleware', (req, res, next) => {
    console.log('middleware3')
    next()
}, (req, res) => {
    res.end('请求 /middleware')
})

// console.log(app._router)



// 不验证请求方法和请求路径
app.use(function(req, res, next) {
    res.end('hello')
})

// 所有请求，同上
app.use('/', function(req, res, next) {
    console.log(1234)
    next()
}, function(req, res, next) {
    console.log(4321)
    next()
}, function(req, res) {
    res.end('12344321')
})

// 匹配 /start 开头的
app.use('/start', function(req, res, next) {
    res.end('hello')
})

app.listen(3004, () => {
    console.log('server is running...')
})
