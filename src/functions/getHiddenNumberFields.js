import schema from "part:@sanity/base/schema";

export const getHiddenNumberFields = () => {
  return schema.getTypeNames().reduce((array, typeName) => {
    const { name, type, fields } = schema.get(typeName);

    const isDocument = type && type.name === "document";
    const isSanity = name && name.startsWith("sanity.");

    if (isDocument && !isSanity && fields) {
      for (const { name, type } of fields) {
        const isHidden = type && type.hidden;
        const isNumber = type && type.name === "number";

        if (isHidden && isNumber && !array.includes(name)) {
          array.push(name);
        }
      }
    }

    return array;
  }, []);
};
