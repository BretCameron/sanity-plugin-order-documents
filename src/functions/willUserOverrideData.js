import { DEFAULT_FIELD_VALUE } from "../data";

// returns true if it looks like using the Order Documents plugin will override existing data (for the given type and field)
export const willUserOverrideData = (documents, field = DEFAULT_FIELD_VALUE) => {
  // for speed, test the first 5 entries only
  const iterations = documents.length >= 5 ? 5 : documents.length;

  for (let i = 0; i < iterations; i += 1) {
    const document = documents[i];

    const isFieldBlank = !document[field];
    const isFieldCorrect = document[field] === i;

    if (!isFieldBlank && !isFieldCorrect) {
      return true;
    }
  }

  return false;
};
