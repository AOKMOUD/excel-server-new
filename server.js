const express = require('express');
const xlsx = require('xlsx');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000; // ✅ Используем порт от Render

app.use(cors()); // ✅ Разрешаем CORS
app.use(express.json()); // ✅ Поддержка JSON

// 📌 Проверка, существует ли файл
const filePath = path.join(__dirname, 'spisokKnig.xlsx');
if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ Файл Excel отсутствует: ${filePath}`);
}

// 🔹 Проверочный маршрут (проверить в браузере)
app.get('/', (req, res) => {
    res.send('✅ Сервер работает! 🚀');
});

// 🔹 API для Excel-данных
app.get('/data', (req, res) => {
    try {
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Файл Excel не найден' });
        }
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        res.json(data);
    } catch (error) {
        console.error(`❌ Ошибка: ${error.message}`);
        res.status(500).json({ error: 'Ошибка при чтении файла', details: error.message });
    }
});

// ✅ Запуск сервера (ключевая правка!)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Сервер запущен на порту ${PORT}`);
});
