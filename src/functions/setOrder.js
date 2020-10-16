import client from "part:@sanity/base/client";
import { DEFAULT_FIELD_VALUE } from "../data";

export const setOrder = (_id, index, field = DEFAULT_FIELD_VALUE) => {
  return client
    .patch(_id)
    .set({ [field]: index })
    .commit();
};

export const setListOrder = (list, field = DEFAULT_FIELD_VALUE, start, end) => {
  if (start || end) {
    start = start || 0;
    end = end || list.length - 1;

    list = list.filter((_, index) => index >= start && index <= end);
  }

  return Promise.all(
    list.map(({ _id }, index) => {
      return setOrder(_id, index + (start || 0), field);
    })
  );
};
