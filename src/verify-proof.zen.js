export default uniqueId => `
ZEN:begin(0)

ZEN:parse([[
Scenario coconut: verify proof
Given that I have a valid 'verifier' from '${uniqueId}'
and I have a valid 'credential proof'
When I aggregate the verifiers
and I verify the credential proof
Then print 'Success' 'OK' as 'string'
]])

ZEN:run()
`;
