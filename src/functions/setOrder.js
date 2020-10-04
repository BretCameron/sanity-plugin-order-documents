import client from "part:@sanity/base/client";

export const setOrder = (_id, index) => {
  return client
    .patch(_id)
    .set({ order: index })
    .commit();
};

export const setListOrder = list => {
  return Promise.all(list.map(({ _id }, index) => setOrder(_id, index)));
};
