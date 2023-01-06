import { createRouter, RouterType, Matcher } from 'lambda-micro';
import { AWSClients, generateID } from '../common';

const router = createRouter(RouterType.HTTP_API_V2);
const dynamoDB = AWSClients.dynamoDB();
const tableName = process.env.DYNAMO_DB_TABLE;

// SERVICE FUNCTIONS

const getCommentsForDocument = async (request, response) => {
  const params = {
    TableName: tableName,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
    ExpressionAttributeValues: {
      ':pk': request.pathVariables.docid,
      ':sk': 'Comment',
    },
  };
  const results = await dynamoDB.query(params).promise();
  return response.output(results.items, 200);
};

const createComment = async (request, response) => {
  const userId = 'mock';
  const commentId = `Comment#${generateID()}`;
  const item = {
    PK: request.pathVariables.docid,
    SK: commentId,
    DateAdded: new Date().toISOString(),
    Owner: userId,
    ...JSON.parse(request.event.body),
  };
  const params = {
    TableName: tableName,
    Item: item,
    ReturnValue: 'NONE',
  };
  await dynamoDB.put(params).promise();
  return response.output(item, 200);
};

const deleteComment = async (request, response) => {
  const params = {
    TableName: tableName,
    Key: {
      PK: request.pathVariables.docid,
      SK: `Comment#${request.pathVariables.commentid}`,
    },
  };
  await dynamoDB.delete(params).promise();
  return response.output({}, 200);
};

// ROUTES

router.add(Matcher.HttpApiV2('GET', '/comments/'), getData);

router.add(Matcher.HttpApiV2('GET', '/comments/(/:docid)'), getCommentsForDocument);

router.add(Matcher.HttpApiV2('POST', '/comments/(/:docid)'), createComment);

router.add(Matcher.HttpApiV2('DELETE', '/comments/(/:docid/:commentid)'), deleteComment);

exports.handler = async (event, context) => {
  return router.run(event, context);
};
