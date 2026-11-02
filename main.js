import { program } from 'commander';
import fs from 'fs';
import http from 'http';

program.helpOption('--help', 'Вивести довідку');
program
  .requiredOption('-i, --input <path>', 'шлях до файлу даних')
  .requiredOption('-h, --host <address>', 'адреса сервера')
  .requiredOption('-p, --port <number>', 'порт сервера')
  .option('-o, --output <path>', 'файл, у який записується остання надіслана відповідь');

program.parse();
const options = program.opts();

fs.access(options.input, fs.constants.F_OK, (err) => {
  if (err) {
    console.error('Cannot find input file');
    process.exit(1);
  }

  const server = http.createServer((req, res) => {
    const Url = new URL(req.url, `http://${options.host}:${options.port}`)

    if (Url.pathname == "/") {
      
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end('Сервер працює')
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end('Помилка 404: Маршрут не знайдено')
    }
  });

  server.listen(options.port, options.host, () => {
    console.log(`Сервер успішно запущено.`)
    console.log(`Слухаю на http://${options.host}:${options.port}/`)
  });
});