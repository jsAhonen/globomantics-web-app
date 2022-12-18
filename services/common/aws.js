/*

AWS Clients

This file exports functions to create AWS Clients.
Having the clients defined in one place
makes it easier to implement tracing for AWS service calls.

*/

import * as AWS from 'aws-sdk';

let _dynamoDB;

/**
 * Creates the DynamoDB client for use in the application
 *
 * @returns {object} DynamoDB Client
 */

const dynamoDB = () => {
  if (!_dynamoDB) {
    _dynamoDB = new AWS.DynamoDB.DocumentClient();
  }
  return _dynamoDB;
};

export const AWSClients = {
  dynamoDB,
};
