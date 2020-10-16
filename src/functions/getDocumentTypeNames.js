import schema from "part:@sanity/base/schema";
import { DEFAULT_FIELD } from "../data";

export const getDocumentTypeNames = (field = DEFAULT_FIELD) => {
  return schema.getTypeNames().reduce((array, typeName) => {
    const { name, title, type, fields } = schema.get(typeName);

    const isDocument = type && type.name === "document";
    const isSanity = name && name.startsWith("sanity.");
    const hasOrderField = fields && fields.filter(({ name }) => name === field).length > 0;

    if (isDocument && !isSanity && hasOrderField) {
      array.push({ name, title: title || name });
    }

    return array;
  }, []);
};
