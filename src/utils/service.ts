import {
  searchEntities,
  createEntity,
  getEntities,
  deleteEntity,
  deleteAll,
  getEntity,
  updateEntity,
  getIndexedEntities,
} from "./dynamo-adapter";

export const create = async (entity) => {
  return await createEntity(process.env.TABLE, entity);
};

export const update = async (entity) => {
  return await updateEntity(process.env.TABLE, entity);
};

export const list = async () => {
  return await getEntities(process.env.TABLE);
};

export const indexedEntities = async (indexName, keys) => {
  return await getIndexedEntities(process.env.TABLE ?? "", indexName, keys);
};

export const get = async (id) => getEntity(process.env.TABLE, id);

export const search = async (searchText, field = "") =>
  searchEntities({
    field,
    tableName: process.env.TABLE ?? "",
    searchText,
  });

export const remove = async (id) => deleteEntity(process.env.TABLE, id);

export const removeAll = async () => deleteAll(process.env.TABLE);
