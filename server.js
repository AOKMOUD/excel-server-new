const express = require('express');
const xlsx = require('xlsx');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000; // Используем порт от Render

app.use(cors());
app.use(express.json());

const localFilePath = path.join(__dirname, 'spisokKnig.xlsx'); // Локальный путь

// 🔹 Функция для загрузки Excel-файла из сети
const downloadFile = async () => {
    try {
        const fileUrl = "C:\pythonProject3\excel-server\spisokKnig.xlsx"; // Локальный сервер (замените на ваш)
        const response = await axios({
            method: 'GET',
            url: fileUrl,
            responseType: 'stream',
        });

        // ✅ Записываем файл в локальную папку
        const writer = fs.createWriteStream(localFilePath);
        response.data.pipe(writer);
        console.log(`✅ Файл загружен: ${localFilePath}`);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`❌ Ошибка при загрузке файла: ${error.message}`);
    }
};

// 🔹 Проверочный маршрут
app.get('/', (req, res) => {
    res.send('✅ Сервер работает! 🚀');
});

// 🔹 Чтение данных из Excel
app.get('/data', async (req, res) => {
    try {
        // 🔄 Загружаем файл перед чтением
        await downloadFile();

        if (!fs.existsSync(localFilePath)) {
            return res.status(404).json({ error: 'Файл Excel не найден' });
        }

        const workbook = xlsx.readFile(localFilePath);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        res.json(data);
    } catch (error) {
        console.error(`❌ Ошибка при обработке файла: ${error.message}`);
        res.status(500).json({ error: 'Ошибка при чтении файла', details: error.message });
    }
});

// ✅ Запускаем сервер
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Сервер запущен на порту ${PORT}`);
});
