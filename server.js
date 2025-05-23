const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configurar OpenAI con variable de entorno desde Heroku
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🔹 Webhook para Dialogflow (opcional, si usas Dialogflow)
app.post('/webhook', async (req, res) => {
  const pregunta = req.body.queryResult?.queryText;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Eres un abogado especializado en Derecho Penal, Laboral y Familiar de Nicaragua." },
        { role: "user", content: pregunta },
      ],
    });

    const respuesta = completion.choices[0]?.message?.content || "No se pudo generar respuesta.";
    return res.json({ fulfillmentText: respuesta });
  } catch (error) {
    console.error('Error en /webhook:', error);
    return res.json({
      fulfillmentText: "Lo siento, ocurrió un error al procesar tu consulta.",
    });
  }
});

// 🔹 Endpoint para frontend web
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

    const respuesta = completion.choices[0]?.message?.content || "No se pudo generar respuesta.";
    console.log("Respuesta generada:", respuesta); // Log para depuración
    res.json({ respuesta });
  } catch (error) {
    console.error('Error en /api/chat:', error);
    res.status(500).json({ error: 'Error al obtener respuesta de la IA.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});