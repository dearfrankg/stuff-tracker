const apiUrl = "http://localhost:5000/api";

const getParams = (options) => {
  return "";
};

const fetchOptions = {
  list: {
    method: "GET",
  },
  create: (payload) => ({
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  }),
  read: {
    method: "GET",
  },
  update: (payload) => ({
    method: "PUT",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  }),
  delete: {
    method: "DELETE",
  },
};

const generic = {
  list: ({ table, options = {} }) => {
    const params = ""; //getOptions(options);
    const url = `${apiUrl}/${table}${params}`;
    return fetch(url, fetchOptions.list).then((res) => res.json());
  },

  create: ({ table, options }) => {
    const params = "";
    const url = `${apiUrl}/${table}${params}`;
    return fetch(url, fetchOptions.create(options.payload)).then((res) => res.json());
  },

  read: ({ table, options }) => {
    const params = "";
    const url = `${apiUrl}/${table}/${options.id}${params}`;
    return fetch(url, fetchOptions.read).then((res) => res.json());
  },

  update: ({ table, options }) => {
    const params = "";
    const url = `${apiUrl}/${table}/${options.id}${params}`;
    return fetch(url, fetchOptions.update(options.payload)).then((res) => res.json());
  },

  delete: ({ table, options }) => {
    const params = "";
    const url = `${apiUrl}/${table}/${options.id}${params}`;
    return fetch(url, fetchOptions.delete).then((res) => res.json());
  },
};

export const services = {
  users: {
    list: (options) => generic.list({ table: "users", options }),
    create: (options) => generic.create({ table: "users", options }),
    read: (options) => generic.read({ table: "users", options }),
    update: (options) => generic.update({ table: "users", options }),
    delete: (options) => generic.delete({ table: "users", options }),
  },
  containers: {
    list: (options) => generic.list({ table: "containers", options }),
    create: (options) => generic.create({ table: "containers", options }),
    read: (options) => generic.read({ table: "containers", options }),
    update: (options) => generic.update({ table: "containers", options }),
    delete: (options) => generic.delete({ table: "containers", options }),
  },
  items: {
    list: (options) => generic.list({ table: "items", options }),
    create: (options) => generic.create({ table: "items", options }),
    read: (options) => generic.read({ table: "items", options }),
    update: (options) => generic.update({ table: "items", options }),
    delete: (options) => generic.delete({ table: "items", options }),
  },
  images: {
    list: (options) => generic.list({ table: "images", options }),
    create: (options) => generic.create({ table: "images", options }),
    read: (options) => generic.read({ table: "images", options }),
    update: (options) => generic.update({ table: "images", options }),
    delete: (options) => generic.delete({ table: "images", options }),
  },
};
