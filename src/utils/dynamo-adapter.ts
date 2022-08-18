import aws from "aws-sdk";
import { v4 } from "uuid";
import * as R from "ramda";

let docClient;
// connect to local DB if running offline
if (process.env.IS_OFFLINE) {
  console.log("--- Dynamo is offline!");
  docClient = new aws.DynamoDB.DocumentClient({
    region: "localhost",
    endpoint: "http://localhost:8000",
  });
} else {
  docClient = new aws.DynamoDB.DocumentClient({
    sessionToken: process.env.AWS_SESSION_TOKEN,
    region: process.env.AWS_REGION,
  });
}

export async function searchEntities({
  tableName,
  attributesToGet,
  searchText,
  field,
}: {
  tableName: string;
  attributesToGet?: string[];
  searchText: string;
  field: string;
}) {
  const entities = await getEntities(tableName, attributesToGet);
  return R.filter(R.propSatisfies(R.test(new RegExp(searchText)), field))(
    entities
  );
}
export async function getEntities(tableName, attributesToGet?: string[]) {
  const params = {
    TableName: tableName,
    ...(attributesToGet ? { AttributesToGet: attributesToGet } : {}),
  };
  console.log("--- getEntities", params);

  return docClient
    .scan(params)
    .promise()
    .then((data) => {
      console.log("--- getEntities", tableName, JSON.stringify(data));
      return data.Items;
    });
}

const _end = (length, i, endString) => (i + 1 < length ? endString : "");
const _eq = (i, query, keyName, keyCount) =>
  `${query}${keyName} = :${keyName}${i}${_end(keyCount, i, " AND ")}`;

const _buildQuery = (keys: Record<string, string | number>) => {
  const query = Object.keys(keys).reduce((query, key, i) => {
    const res = _eq(i, query, key, Object.keys(keys).length);
    return res;
  }, "");
  return query;
};

const _buildExpressionAttibuteValues = (
  keys: Record<string, string | number>
) => {
  return Object.keys(keys).reduce(
    (e, key, i) => ({ ...e, [`:${key}${i}`]: keys[key] }),
    {}
  );
};
export async function getIndexedEntities(
  tableName: string,
  indexName: string,
  keys: Record<string, string | number>
) {
  const params = {
    TableName: tableName,
    IndexName: indexName,
    KeyConditionExpression: _buildQuery(keys),
    ExpressionAttributeValues: _buildExpressionAttibuteValues(keys),
  };
  console.log("--- params", JSON.stringify(params, null, 2));

  return docClient
    .query(params)
    .promise()
    .then((data) => {
      console.log(
        "--- getIndexedEntities",
        tableName,
        JSON.stringify(data),
        JSON.stringify(data.Items)
      );
      return data.Items;
    });
}
export async function getEntity(tableName, id, attributesToGet?: string[]) {
  const params = {
    TableName: tableName,
    Key: {
      id: `${id}`,
    },
    ...(attributesToGet ? { AttributesToGet: attributesToGet } : {}),
  };
  return docClient
    .get(params)
    .promise()
    .then((data) => {
      console.log("---getEntity", tableName, JSON.stringify(data));
      return data && data.Item;
    });
}

export async function createEntity(tableName, entity) {
  // set an id if not set
  console.log("--- createEntity", entity);
  const createdAt = new Date();
  entity = { ...entity, id: entity.id ? entity.id : v4() };
  entity = { ...entity, createdAt: createdAt.getTime() };
  const params = {
    TableName: tableName,
    Item: entity,
  };
  console.log("--- entity params", JSON.stringify(params));
  return docClient
    .put(params)
    .promise()
    .then(() => entity);
}

export async function deleteEntity(tableName, id, idName = "id") {
  const params = {
    TableName: tableName,
    Key: {
      [idName]: id,
    },
  };
  console.log("--- delete entity", id);
  return docClient
    .delete(params)
    .promise()
    .then((err, data) => {
      if (err !== undefined && !R.isEmpty(err)) {
        const msg = `DeleteItem failed:, ${JSON.stringify(err, null, 2)}`;
        console.error(msg);
        return { msg: new Error(msg) };
      } else {
        const msg = `DeleteItem succeeded:, ${JSON.stringify(data, null, 2)}`;
        console.log(msg);
        return { msg };
      }
    });
}

export async function deleteAll(tableName) {
  const entities = await getEntities(tableName);
  console.log("---- delete all", entities);
  return new Promise((resolve) => {
    entities.forEach(async (e) => await deleteEntity(tableName, e.id));
    resolve(entities);
  });
}

export async function updateEntity(tableName, entity, idName = "id") {
  // set an id if not set
  if (!entity[idName])
    throw new Error("Id was null when trying to update an entity");
  console.log("--- update entity", JSON.stringify(entity));
  const params = {
    TableName: tableName,
    Item: entity,
  };
  return docClient
    .put(params)
    .promise()
    .then(() => entity);
}
