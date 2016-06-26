var express = require('express');
var app = express();

app.use((req, res, next) => {
  Promise.next = next;
  next();
});

app.get('/', (req, res, next) => {
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('foobar'));
    }, 100);
  });
});

app.get('/bar', (req, res, next) => {
  res.send({ bar: 'bar' });
});

app.get('/foo', (req, res, next) => {
    setTimeout(() => {
      throw new Error('foo');
    }, 100);
});

app.use((err, req, res, next) => {
  res.status(500).send({ error: 'Something failed!' });
});

process.on('unhandledRejection', (err, p) => {
  // ここだったらまだ救えるので、一旦 next を呼ぶ
  if (Promise.next) return Promise.next(err);
  console.error(err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  // ここに来たら終わり
  console.error(err);
  process.exit(1);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
