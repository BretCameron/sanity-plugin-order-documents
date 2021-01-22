import schema from "part:@sanity/base/schema";
import { DEFAULT_FIELD_VALUE } from "../data";

export const getDocumentTypeNames = (field = DEFAULT_FIELD_VALUE) => {
  return schema.getTypeNames().reduce((array, typeName) => {
    const { name, title, type, fields } = schema.get(typeName);

    const isDocument = type && type.name === "document";
    const isSanity = name && name.startsWith("sanity.");
    const hasOrderField = fields && fields.filter(({ name }) => name === field).length > 0;

    const hiddenNumberFields = [];

    if (isDocument && !isSanity && hasOrderField) {
      for (const { name, type } of fields) {
        const isHidden = type && type.hidden;
        const isNumber = type && type.name === "number";

        if (isHidden && isNumber && array.findIndex((field) => field.name === name) === -1) {
          hiddenNumberFields.push({ name, title: type.title });
        }
      }

      array.push({ name, title: title || name, fields: hiddenNumberFields });
    }

    return array;
  }, []);
};
