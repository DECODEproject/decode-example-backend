import express from 'express';
import cors from 'cors';
import sessions, { getSession, verify } from './sessions';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/sessions', (req, res) => {
  res.send(sessions);
});

app.get('/session/:sessionId', (req, res) => {
  const status = getSession(req.params.sessionId);
  console.log('getSession ', req.params.sessionId, status);
  res.send({
    sessionStatus: getSession(req.params.sessionId) || 'notfound',
  })
});

app.post('/verify', async (req, res) => {
  try {
    const verified = await verify(req.body);
    return res.send({
      sessionStatus: verified,
    });
  } catch (error) {
    console.log('Error: ', error);
    return res.status(412).send({
      message: error.message,
    });
  }
});

app.listen(process.env.PORT, () =>
  console.log(`DECODE example backend listening on port ${process.env.PORT}!`),
);
