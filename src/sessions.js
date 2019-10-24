import zenroom from 'zenroom';
import { isNil } from 'ramda';
import fetch from 'node-fetch';
import verifyProof from './verify-proof.zen';

const SESSION_STATUS = {
  NEW: 'new',
  VALID: 'valid',
  INVALID: 'invalid',
};

let sessions = {};

export const getSession = id => sessions[id];

export const verify = async ({ sessionId, credential, optionalAttributes }) => {
  console.log('args: ', sessionId, credential, optionalAttributes);
  sessions[sessionId] = SESSION_STATUS.NEW;
  if (isNil(credential)) throw new Error('credential');
  const { authorizable_attribute_id: attributeId, value, credential_issuer_endpoint_address: credentialIssuerUrl } = credential;
  if (isNil(attributeId)) throw new Error('attributeId');
  if (isNil(value)) throw new Error('value');
  if (isNil(credentialIssuerUrl)) throw new Error('credentialIssuerUrl');
  const { proof } = value;
  if (isNil(proof)) throw new Error('proof');
  const credentialProof = { credential_proof: proof };
  console.log('Attribute id: ', attributeId);
  console.log('Credential issuer URL: ', credentialIssuerUrl);
  console.log('Proof: ', credentialProof);
  const uidResp = await fetch(`${credentialIssuerUrl}/uid`);
  if (!uidResp.ok) throw new Error('no uid');
  const { credential_issuer_id: credentialIssuerId } = await uidResp.json();
  if (isNil(credentialIssuerId)) throw new Error('credentialIssuerId');
  console.log('Credential issuer id: ', credentialIssuerId);
  const verfierResp = await fetch(`${credentialIssuerUrl}/authorizable_attribute/${attributeId}`);
  if (!verfierResp.ok) throw new Error('no verifier');
  const { verification_key: verificationKey } = await verfierResp.json();
  console.log('verificationKey: ', verificationKey);
  if (isNil(verificationKey)) throw new Error('verification key');
  zenroom
    .success(() => console.log('Success'))
    .error(() => { throw new Error('not verified') })
    .script(verifyProof(credentialIssuerId))
    .data(JSON.stringify(verificationKey))
    .keys(credentialProof)
    .zenroom_exec()
    .reset();
  sessions[sessionId] = {
    sessionStatus: SESSION_STATUS.VALID,
    sharedData: optionalAttributes,
  };
  return SESSION_STATUS.VALID;
};

export default sessions;
