let nock = require('nock');

module.exports.hash = "854c210bc19cd8b3c0871b55a76cdd83";

module.exports.testInfo = {"uniqueName":{},"newDate":{}}

nock('https://azure_managedhsm.managedhsm.azure.net:443', {"encodedQueryParams":true})
  .put('/keys/CRUDKeyName-encryptslocallyanddecryptsremotely-')
  .query(true)
  .reply(401, "", [
  'content-type',
  'application/json; charset=utf-8',
  'x-ms-server-latency',
  '1',
  'x-content-type-options',
  'nosniff',
  'www-authenticate',
  'Bearer authorization="https://login.microsoftonline.com/azure_tenant_id", resource="https://managedhsm.azure.net"',
  'x-frame-options',
  'SAMEORIGIN',
  'content-length',
  '0',
  'x-ms-request-id',
  'f38292ca-81fe-11eb-9792-000d3abb962e',
  'strict-transport-security',
  'max-age=31536000; includeSubDomains',
  'content-security-policy',
  "default-src 'self'",
  'cache-control',
  'no-cache'
]);

nock('https://login.microsoftonline.com:443', {"encodedQueryParams":true})
  .post('/azure_tenant_id/oauth2/v2.0/token', "response_type=token&grant_type=client_credentials&client_id=azure_client_id&client_secret=azure_client_secret&scope=https%3A%2F%2Fmanagedhsm.azure.net%2F.default")
  .reply(200, {"token_type":"Bearer","expires_in":86399,"ext_expires_in":86399,"access_token":"access_token"}, [
  'Cache-Control',
  'no-store, no-cache',
  'Pragma',
  'no-cache',
  'Content-Type',
  'application/json; charset=utf-8',
  'Expires',
  '-1',
  'Strict-Transport-Security',
  'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options',
  'nosniff',
  'P3P',
  'CP="DSP CUR OTPi IND OTRi ONL FIN"',
  'x-ms-request-id',
  'ebb430b2-fcf6-4981-bd62-64aeef0e2d00',
  'x-ms-ests-server',
  '2.1.11562.6 - NCUS ProdSlices',
  'Set-Cookie',
  'fpc=Av11lCN598dKoi4J_eLANTlYXQRlBAAAADhY29cOAAAA; expires=Sat, 10-Apr-2021 00:15:57 GMT; path=/; secure; HttpOnly; SameSite=None',
  'Set-Cookie',
  'x-ms-gateway-slice=estsfd; path=/; secure; samesite=none; httponly',
  'Set-Cookie',
  'stsservicecookie=estsfd; path=/; secure; samesite=none; httponly',
  'Date',
  'Thu, 11 Mar 2021 00:15:57 GMT',
  'Content-Length',
  '1322'
]);

nock('https://azure_managedhsm.managedhsm.azure.net:443', {"encodedQueryParams":true})
  .put('/keys/CRUDKeyName-encryptslocallyanddecryptsremotely-', {"key":{"kty":"oct","key_ops":["encrypt","decrypt","wrapKey","unwrapKey"],"k":"AAECAwQFBgcICQoLDA0ODxAREhMUFRYX"},"attributes":{}})
  .query(true)
  .reply(200, {"attributes":{"created":1615421757,"enabled":true,"exportable":false,"recoverableDays":90,"recoveryLevel":"Recoverable+Purgeable","updated":1615421757},"key":{"key_ops":["encrypt","decrypt","unwrapKey","wrapKey"],"kid":"https://azure_managedhsm.managedhsm.azure.net/keys/CRUDKeyName-encryptslocallyanddecryptsremotely-/18d3e17140a90d850ddb59c94ebd8307","kty":"oct-HSM"}}, [
  'content-type',
  'application/json; charset=utf-8',
  'x-content-type-options',
  'nosniff',
  'content-length',
  '386',
  'x-ms-request-id',
  'f3ab845a-81fe-11eb-9792-000d3abb962e',
  'x-ms-keyvault-region',
  'westeurope',
  'strict-transport-security',
  'max-age=31536000; includeSubDomains',
  'content-security-policy',
  "default-src 'self'",
  'x-ms-keyvault-network-info',
  'addr=50.35.231.105',
  'x-ms-server-latency',
  '254',
  'cache-control',
  'no-cache',
  'x-frame-options',
  'SAMEORIGIN'
]);

nock('https://azure_managedhsm.managedhsm.azure.net:443', {"encodedQueryParams":true})
  .post('/keys/CRUDKeyName-encryptslocallyanddecryptsremotely-/18d3e17140a90d850ddb59c94ebd8307/decrypt')
  .query(true)
  .reply(401, "", [
  'content-type',
  'application/json; charset=utf-8',
  'x-ms-server-latency',
  '0',
  'x-content-type-options',
  'nosniff',
  'www-authenticate',
  'Bearer authorization="https://login.microsoftonline.com/azure_tenant_id", resource="https://managedhsm.azure.net"',
  'x-frame-options',
  'SAMEORIGIN',
  'content-length',
  '0',
  'x-ms-request-id',
  'f3ea94a6-81fe-11eb-9792-000d3abb962e',
  'strict-transport-security',
  'max-age=31536000; includeSubDomains',
  'content-security-policy',
  "default-src 'self'",
  'cache-control',
  'no-cache'
]);

nock('https://login.microsoftonline.com:443', {"encodedQueryParams":true})
  .post('/azure_tenant_id/oauth2/v2.0/token', "response_type=token&grant_type=client_credentials&client_id=azure_client_id&client_secret=azure_client_secret&scope=https%3A%2F%2Fmanagedhsm.azure.net%2F.default")
  .reply(200, {"token_type":"Bearer","expires_in":86399,"ext_expires_in":86399,"access_token":"access_token"}, [
  'Cache-Control',
  'no-store, no-cache',
  'Pragma',
  'no-cache',
  'Content-Type',
  'application/json; charset=utf-8',
  'Expires',
  '-1',
  'Strict-Transport-Security',
  'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options',
  'nosniff',
  'P3P',
  'CP="DSP CUR OTPi IND OTRi ONL FIN"',
  'x-ms-request-id',
  '2e6bb9d7-271b-4810-9306-e6b54d931f00',
  'x-ms-ests-server',
  '2.1.11562.6 - SCUS ProdSlices',
  'Set-Cookie',
  'fpc=Av11lCN598dKoi4J_eLANTlYXQRlBQAAADhY29cOAAAA; expires=Sat, 10-Apr-2021 00:15:58 GMT; path=/; secure; HttpOnly; SameSite=None',
  'Set-Cookie',
  'x-ms-gateway-slice=estsfd; path=/; secure; samesite=none; httponly',
  'Set-Cookie',
  'stsservicecookie=estsfd; path=/; secure; samesite=none; httponly',
  'Date',
  'Thu, 11 Mar 2021 00:15:57 GMT',
  'Content-Length',
  '1322'
]);

nock('https://azure_managedhsm.managedhsm.azure.net:443', {"encodedQueryParams":true})
  .post('/keys/CRUDKeyName-encryptslocallyanddecryptsremotely-/18d3e17140a90d850ddb59c94ebd8307/decrypt', {"alg":"A192CBCPAD","value":"7B4Ga_RIWg7DQripb-lCD01GwqJpS86R-YHyNthnXFos69jKxnvyYLD57W-Ji9M1","iv":"AAECAwQFBgcICQoLDA0ODw"})
  .query(true)
  .reply(200, {"alg":"A192CBCPAD","kid":"https://azure_managedhsm.managedhsm.azure.net/keys/CRUDKeyName-encryptslocallyanddecryptsremotely-/18d3e17140a90d850ddb59c94ebd8307","value":"ZW5jcnlwdHMgbG9jYWxseSBhbmQgZGVjcnlwdHMgcmVtb3RlbHk"}, [
  'content-type',
  'application/json; charset=utf-8',
  'x-content-type-options',
  'nosniff',
  'content-length',
  '237',
  'x-ms-request-id',
  'f415374c-81fe-11eb-9792-000d3abb962e',
  'x-ms-keyvault-region',
  'westeurope',
  'strict-transport-security',
  'max-age=31536000; includeSubDomains',
  'content-security-policy',
  "default-src 'self'",
  'x-ms-keyvault-network-info',
  'addr=50.35.231.105',
  'x-ms-server-latency',
  '94',
  'cache-control',
  'no-cache',
  'x-frame-options',
  'SAMEORIGIN'
]);

nock('https://azure_managedhsm.managedhsm.azure.net:443', {"encodedQueryParams":true})
  .delete('/keys/CRUDKeyName-encryptslocallyanddecryptsremotely-')
  .query(true)
  .reply(200, {"attributes":{"created":1615421757,"enabled":true,"exportable":false,"recoverableDays":90,"recoveryLevel":"Recoverable+Purgeable","updated":1615421757},"deletedDate":1615421758,"key":{"key_ops":["encrypt","decrypt","wrapKey","unwrapKey"],"kid":"https://azure_managedhsm.managedhsm.azure.net/keys/CRUDKeyName-encryptslocallyanddecryptsremotely-/18d3e17140a90d850ddb59c94ebd8307","kty":"oct-HSM"},"recoveryId":"https://azure_managedhsm.managedhsm.azure.net/deletedkeys/CRUDKeyName-encryptslocallyanddecryptsremotely-","scheduledPurgeDate":1623197758}, [
  'content-type',
  'application/json; charset=utf-8',
  'x-content-type-options',
  'nosniff',
  'content-length',
  '579',
  'x-ms-request-id',
  'f43bcf24-81fe-11eb-9792-000d3abb962e',
  'x-ms-keyvault-region',
  'westeurope',
  'strict-transport-security',
  'max-age=31536000; includeSubDomains',
  'content-security-policy',
  "default-src 'self'",
  'x-ms-keyvault-network-info',
  'addr=50.35.231.105',
  'x-ms-server-latency',
  '108',
  'cache-control',
  'no-cache',
  'x-frame-options',
  'SAMEORIGIN'
]);

nock('https://azure_managedhsm.managedhsm.azure.net:443', {"encodedQueryParams":true})
  .get('/deletedkeys/CRUDKeyName-encryptslocallyanddecryptsremotely-')
  .query(true)
  .reply(200, {"attributes":{"created":1615421757,"enabled":true,"exportable":false,"recoverableDays":90,"recoveryLevel":"Recoverable+Purgeable","updated":1615421757},"deletedDate":1615421758,"key":{"key_ops":["wrapKey","unwrapKey","decrypt","encrypt"],"kid":"https://azure_managedhsm.managedhsm.azure.net/keys/CRUDKeyName-encryptslocallyanddecryptsremotely-/18d3e17140a90d850ddb59c94ebd8307","kty":"oct-HSM"},"recoveryId":"https://azure_managedhsm.managedhsm.azure.net/deletedkeys/CRUDKeyName-encryptslocallyanddecryptsremotely-","scheduledPurgeDate":1623197758}, [
  'x-frame-options',
  'SAMEORIGIN',
  'x-ms-request-id',
  'f46486e4-81fe-11eb-9792-000d3abb962e',
  'content-type',
  'application/json; charset=utf-8',
  'x-ms-keyvault-region',
  'westeurope',
  'content-length',
  '579',
  'strict-transport-security',
  'max-age=31536000; includeSubDomains',
  'content-security-policy',
  "default-src 'self'",
  'cache-control',
  'no-cache',
  'x-content-type-options',
  'nosniff',
  'x-ms-build-version',
  '1.0.20210306-1-6fb7c19a-develop',
  'x-ms-keyvault-network-info',
  'addr=50.35.231.105',
  'x-ms-server-latency',
  '36'
]);

nock('https://azure_managedhsm.managedhsm.azure.net:443', {"encodedQueryParams":true})
  .delete('/deletedkeys/CRUDKeyName-encryptslocallyanddecryptsremotely-')
  .query(true)
  .reply(204, "", [
  'content-type',
  'application/json; charset=utf-8',
  'x-content-type-options',
  'nosniff',
  'content-length',
  '0',
  'x-ms-request-id',
  'f482311c-81fe-11eb-9792-000d3abb962e',
  'x-ms-keyvault-region',
  'westeurope',
  'strict-transport-security',
  'max-age=31536000; includeSubDomains',
  'content-security-policy',
  "default-src 'self'",
  'x-ms-keyvault-network-info',
  'addr=50.35.231.105',
  'x-ms-server-latency',
  '114',
  'cache-control',
  'no-cache',
  'x-frame-options',
  'SAMEORIGIN'
]);
