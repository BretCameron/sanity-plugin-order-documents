import client from "part:@sanity/base/client";

export const setOrder = (_id, index) => {
  return client
    .patch(_id)
    .set({ order: index })
    .commit();
};

export const setListOrder = (list, start = 6, end) => {
  if (start || end) {
    start = start || 0;
    end = end || list.length - 1;

    list = list.filter((_, index) => index >= start && index <= end);
  }

  return Promise.all(list.map(({ _id }, index) => setOrder(_id, index + (start || 0))));
};
