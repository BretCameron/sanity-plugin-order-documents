import schema from "part:@sanity/base/schema";

export const getDocumentTypeNames = () => {
  return schema
    .getTypeNames()
    .map(typeName => schema.get(typeName))
    .filter(({ type }) => type && type.name === "document")
    .map(type => ({ name: type.name, title: type.title }))
    .filter(({ name }) => {
      const fields = schema.get(name).fields
      const hasOrderField = fields.filter((field) => field.name === 'order').length > 0
      
      return hasOrderField && !name.startsWith("sanity.")
    });
};
