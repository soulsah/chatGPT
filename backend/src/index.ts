import express, { Request, Response } from 'express';
import axios from 'axios';

const app = express();
const port = 3000;

app.use(express.json());

app.post('/', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    const apiKey = process.env.OPENAI_API_KEY;
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    const response = await axios.post(apiUrl, {
      prompt: message,
      max_tokens: 150,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    const chatgptResponse = response.data.choices[0]?.text || 'Não foi possível obter uma resposta';

    res.json({ response: chatgptResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
