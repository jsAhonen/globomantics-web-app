import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { NodejsServiceFunction } from '../constructs/lambda';

interface AppServiceProps {
  documentsTable: dynamodb.ITable;
}

export class AppServices extends cdk.Construct {
  public readonly commentsService: NodejsServiceFunction;
  constructor(scope: cdk.Construct, id: string, props: AppServiceProps) {
    super(scope, id);

    this.commentsService = new NodejsServiceFunction(this, 'CommentServiceLambda', {
      entry: path.join(__dirname, '../../../services/comments/index.js'),
    });

    props.documentsTable.grantReadData(this.commentsService);

    this.commentsService.addEnvironment('DYNAMO_DB_TABLE', props.documentsTable.tableName);
  }
}
