const request = require('../utils/request');
const defaultData = require('../utils/defaultData');

const acceptedTypes = ['test', 'prod', 'mock'];

// global constants
const basePath = '/rswebpaytransaction/api/webpay/v1.0/transactions';

class Transaction {
  constructor(integrationType, apiKey, commerceCode) {
    this.apiKey = apiKey || defaultData.apiKey;
    this.commerceCode = commerceCode || defaultData.commerceCode;
    if (!acceptedTypes.includes(integrationType)) {
      throw new Error('Type not accepted');
    }
    this.integrationType = defaultData.integrationType[integrationType];
  }

  async create(buyOrder, sessionId, amount, returnUrl) {
    try {
      const payload = JSON.stringify({
        session_id: sessionId,
        buy_order: buyOrder,
        amount,
        return_url: returnUrl,
      });

      const headers = {
        'Tbk-Api-Key-Id': this.commerceCode,
        'Tbk-Api-Key-Secret': this.apiKey,
        'Content-Type': 'application/json',
        'Content-Length': payload.length,
      };

      const options = {
        host: this.integrationType,
        path: basePath,
        method: 'POST',
        headers,
      };

      const { status, body } = await request(options, payload);

      return { status, body };
    } catch (e) {
      throw new Error(e);
    }
  }

  async commit(token) {
    try {
      const headers = {
        'Tbk-Api-Key-Id': this.commerceCode,
        'Tbk-Api-Key-Secret': this.apiKey,
      };

      const options = {
        host: this.integrationType,
        path: `${basePath}/${token}`,
        method: 'PUT',
        headers,
      };

      const { status, body } = await request(options, '');

      return { status, body };
    } catch (e) {
      throw new Error(e);
    }
  }

  async refund(token, amount) {
    try {
      const payload = {
        amount,
      };

      const headers = {
        'Tbk-Api-Key-Id': this.commerceCode,
        'Tbk-Api-Key-Secret': this.apiKey,
        'Content-Type': 'application/json',
        'Content-Length': payload.length,
      };

      const options = {
        host: this.integrationType,
        path: `${basePath}/${token}/refunds`,
        method: 'POST',
        headers,
      };

      const { status, body } = await request(options, payload);

      return { status, body };
    } catch (e) {
      throw new Error(e);
    }
  }

  async capture(token, buyOrder, authorizationCode, amount) {
    try {
      const payload = JSON.stringify({
        buy_order: buyOrder,
        authorization_code: authorizationCode,
        capture_amount: amount,
      });

      const headers = {
        'Tbk-Api-Key-Id': this.commerceCode,
        'Tbk-Api-Key-Secret': this.apiKey,
        'Content-Type': 'application/json',
        'Content-Length': payload.length,
      };

      const options = {
        host: this.integrationType,
        path: `${basePath}/${token}/capture`,
        method: 'POST',
        headers,
      };

      const { status, body } = await request(options, payload);

      return { status, body };
    } catch (e) {
      throw new Error(e);
    }
  }

  async getStatus(token) {
    try {
      const headers = {
        'Tbk-Api-Key-Id': this.commerceCode,
        'Tbk-Api-Key-Secret': this.apiKey,
      };

      const options = {
        host: this.integrationType,
        path: `${basePath}/${token}`,
        method: 'GET',
        headers,
      };

      const { status, body } = await request(options);

      return { status, body };
    } catch (e) {
      throw new Error(e);
    }
  }
}

module.exports = Transaction;
