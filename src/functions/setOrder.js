import sanityClient from "part:@sanity/base/client";
import { DEFAULT_FIELD_VALUE } from "../data";
import { CLIENT_API_VERSION } from "../_constants";

const client = sanityClient.withConfig({ apiVersion: CLIENT_API_VERSION });

export const setOrder = async (_id, index, field = DEFAULT_FIELD_VALUE) => {
  return client
    .patch(_id)
    .set({ [field]: index })
    .commit();
};

export const setListOrder = async (list, field = DEFAULT_FIELD_VALUE, start = 0) => {
  return Promise.all(
    list.map(({ _id }, index) => {
      return setOrder(_id, index + start, field);
    })
  );
};
