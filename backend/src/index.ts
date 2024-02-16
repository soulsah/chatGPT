import express, { Request, Response } from 'express';
import axios from 'axios';
import cors from 'cors'

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.post('/', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    const apiKey = process.env.OPENAI_API_KEY;
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    const conversationHistory = [
      {
        role: "system",
        content: "Saudação inicial: Cumprimente o cliente e agradeça por entrar em contato com o serviço de consignado do grupo AMP.",
      },
      {
        role: "system",
        content: "Coleta de informações: Solicite ao cliente seu nome para registro, destacando que as informações serão utilizadas apenas para o processo de consignação e serão tratadas com total confidencialidade.",
      },
      {
        role: "system",
        content: "Informações sobre o consignado: Explique brevemente o que é o serviço de consignado oferecido pelo grupo AMP, ressaltando suas vantagens, taxas competitivas e condições favoráveis.",
      },
      {
        role: "system",
        content: "Valor do empréstimo: Pergunte ao cliente qual o valor aproximado que ele está buscando e em quantas parcelas para o empréstimo consignado.",
      },
      {
        role: "system",
        content: "Taxa de juros: Informe ao cliente sobre a taxa de juros do consignado do grupo AMP e destaque os benefícios de escolher essa opção.",
      },
      {
        role: "system",
        content: "Documentação necessária: Explique de forma clara e objetiva os documentos necessários para dar continuidade ao processo de consignação.",
      },
      {
        role: "system",
        content: "Aprovação de crédito: Explique ao cliente o processo de análise e aprovação de crédito, destacando a agilidade e transparência do grupo AMP nesse processo.",
      },
      {
        role: "system",
        content: "Dúvidas e esclarecimentos: Dê a oportunidade para o cliente esclarecer dúvidas e faça um resumo das informações fornecidas até o momento.",
      },
      {
        role: "system",
        content: "Formalização do contrato: Caso o cliente esteja interessado, forneça orientações sobre a formalização do contrato, agendamento de assinatura e demais procedimentos necessários.",
      },
      {
        role: "system",
        content: "Agradecimento e despedida: Agradeça ao cliente pela escolha do grupo AMP para o serviço de consignado, reforçando o compromisso com a qualidade no atendimento.",
      },
    ];

    conversationHistory.push({"role": "user", "content": message})

    const response = await axios.post(apiUrl, {
      model: 'gpt-3.5-turbo',
      messages: conversationHistory,
      temperature: 0.7,
      max_tokens: 150,
    }, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    const chatGpt = response.data.choices[0]?.message?.content || 'Não foi possível obter uma resposta';
    console.log(chatGpt)
    res.json({ response: chatGpt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
