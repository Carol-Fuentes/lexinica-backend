require('dotenv').config(); // 🔹 Va al inicio

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');  // Usando la versión moderna del SDK

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/chat', async (req, res) => {
    const { pregunta } = req.body;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "Eres un abogado especializado en Derecho Penal, Laboral y Familiar de Nicaragua." },
                { role: "user", content: pregunta },
            ],
        });

        const respuesta = completion.choices[0].message.content;
        res.json({ respuesta });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener respuesta de la IA.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});