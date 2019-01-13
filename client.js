const Koa = require('koa');
const serve = require('koa-static');
const fs = require('fs');
const app = new Koa();

app.use(serve('./public'));

app.use(async ctx => {
    let source = fs.readFileSync('views/index.html', 'utf8');
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.body = source;
});

app.listen(8080);