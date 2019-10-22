import express from 'express';
import cors from 'cors';
import sessions, { newSession, getSession, verify } from './sessions';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/sessions', (req, res) => {
  res.send(sessions);
});

app.post('/new-session', (req, res) => {
  res.send({
    sessionId: newSession(),
  })
});

app.get('/session/:sessionId', (req, res) => {
  res.send({
    status: getSession(req.params.sessionId) || 'notfound',
  })
});

app.post('/verify', (req, res) => {
  res.send({
    status: verify(req.body),
  })
});

app.listen(3000, () =>
  console.log('DECODE example backend listening on port 3000!'),
);
