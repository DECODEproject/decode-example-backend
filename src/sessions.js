import uuid from 'uuid/v4';

const SESSION_STATUS = {
  NEW: 'new',
  VALID: 'valid',
  INVALID: 'invalid',
};

let sessions = {};

export const newSession = () => {
  const sessionId = uuid();
  sessions[sessionId] = SESSION_STATUS.NEW;
  return sessionId;
};

export const getSession = id => sessions[id];

export const verify = ({ sessionId, credentials }) => {
  console.log('args: ', sessionId, credentials);
  return SESSION_STATUS.VALID;
};

export default sessions;
