const express = require('express');
const xlsx = require('xlsx');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000; // Используем порт, который назначает Render

app.use(cors()); // Разрешаем запросы с фронтенда

// 📌 Путь к локальному файлу (должен быть в проекте!)
const filePath = path.join(__dirname, 'spisokKnig.xlsx');

// Проверяем, существует ли файл
if (!fs.existsSync(filePath)) {
    console.error(`❌ Файл Excel не найден: ${filePath}`);
}

// 🔹 Маршрут для проверки работы сервера
app.get('/', (req, res) => {
    res.send('✅ Сервер работает!');
});

// 🔹 Маршрут для получения данных из Excel
app.get('/data', (req, res) => {
    try {
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Файл Excel не найден' });
        }

        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        res.json(data); // Отправляем данные в JSON
    } catch (error) {
        console.error(`❌ Ошибка при чтении файла: ${error.message}`);
        res.status(500).json({ error: 'Ошибка при чтении файла', details: error.message });
    }
});

// 🔹 Запускаем сервер и слушаем PORT от Render
app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту ${PORT}`);
});
