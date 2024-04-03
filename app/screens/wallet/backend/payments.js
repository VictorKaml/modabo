import axios, {AxiosResponse} from 'axios';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import {storage} from '../../mmkv/instance';
import {
  DEPOSIT_ENDPOINT,
  PAWAPAY_API,
  PAYOUT_ENDPOINT,
} from '../../../constants';
import {Alert} from 'react-native';

export async function depositRequest(depositAmount, phone_no, mobileOperator) {
  storage.getString('@jwtToken');
  const YOUR_JWT_HERE = storage.getString('@jwtToken');
  // const phone_no = '265993456789';

  const depositId = uuidv4();
  storage.set('@depositId', depositId);

  console.log('MY JWT:', YOUR_JWT_HERE);

  try {
    const response = await axios.post(
      DEPOSIT_ENDPOINT,
      {
        depositId: depositId,
        amount: depositAmount,
        currency: 'MWK',
        correspondent: mobileOperator,
        payer: {
          type: 'MSISDN',
          address: {value: phone_no},
        },
        customerTimestamp: '2020-02-21T17:32:28Z',
        statementDescription: 'Note of 4 to 22 chars',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${PAWAPAY_API}`,
        },
      },
    );

    console.log('Response data is:', response?.data);
    const depositStatus = response?.data.status;
    console.log('Deposit status is: ', depositStatus);
    storage.set('@depositStatus', depositStatus);

    return depositStatus;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

export async function payoutRequest(payoutAmount, phone_no, mobileOperator) {
  const YOUR_JWT_HERE = storage.getString('@jwtToken');
  // const phone_no = '265993456789';

  const payoutId = uuidv4();
  console.log('My payout ID is', payoutId);
  storage.set('@payoutId', payoutId);

  try {
    const response = await axios.post(
      PAYOUT_ENDPOINT,
      {
        payoutId: payoutId,
        amount: payoutAmount,
        currency: 'MWK',
        correspondent: mobileOperator,
        recipient: {
          type: 'MSISDN',
          address: {value: phone_no},
        },
        customerTimestamp: '2020-02-21T17:32:28Z',
        statementDescription: 'Note of 4 to 22 chars',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${PAWAPAY_API}`,
        },
      },
    );

    const depositStatus = JSON.stringify(response?.data);
    storage.set('@payoutStatus', depositStatus);

    console.log(response?.data.status);
    console.log('Payout status is: ', depositStatus);

    return depositStatus;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return;
  }
}

async function getDepositStatus() {
  const depositId = uuidv4();
  console.log(depositId);
  try {
    const response = await axios.post(
      `https://api.sandbox.pawapay.cloud/deposits/${depositId}`,
      {
        method: 'Get',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${PAWAPAY_API}`,
        },
      },
    );
    console.log('Transaction status is: ', response.data);
    return response?.data.status;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}
