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
      
      fs.readFile(options.input, 'utf8', function(err, data) {
        if(err){
            res.writeHead(500,{ 'Content-Type': 'text/plain; charset=utf-8' })
            return res.end('Помилка 500: Неможливо прочитати файл даних')
        }
        
        const iris = data
          .split('\n')
          .filter(line => line.trim() !== "")
          .map(line => JSON.parse(line));
        
        const minPetalLengthParam = Url.searchParams.get('min_petal_length')
        const varietyParam = Url.searchParams.get('variety')

        if(minPetalLengthParam == null && varietyParam == null){
          const result = iris.map(par =>({
              petal_length: Number(par["petal.length"]),
              petal_width: Number(par["petal.width"]) 
          }))
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
          return res.end(JSON.stringify(result))
        }

      }); 

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