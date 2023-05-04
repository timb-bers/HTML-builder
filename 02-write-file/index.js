const fs = require("fs");
const path = require("path");
const {stdin, stdout, stderr, exit} = process;


const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');
stdout.write('Пожалуйста, введите текст: ');
let message = '';

stdin.on('data', data => {
  if (data.toString().trim() == 'exit') {
    message = ('Вы ввели команду "exit" для выхода.');
    exit();
  }
  writeStream.write(data);
});

process.on('exit', code => {
    (code === 0) 
      ? stdout.write(`${message} Всё впорядке, удачи!`)
      : stderr.write(`${message} Что то пошло не так, ошибка: ${code}`);
});

process.on('SIGINT', () => {
  message = 'Использовалась команда "ctrl+c" для выхода.'
  exit();
});
