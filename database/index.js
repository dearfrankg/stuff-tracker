import fs from "fs";
import path from "path";
import data from "./database.json";

const SUCCESS = { success: "ok" };
const NOT_FOUND = { message: "record not found" };

function saveData() {
  const file = path.join(process.cwd(), "database", "database.json");
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

const fields = {
  users: ["id", "name", "username", "password"],
  containers: ["id", "type", "name", "containerId", "userId"],
  items: ["id", "name", "imageId", "containerId", "userId"],
  images: ["id", "url", "alt"],
};

const generic = {
  list: ({ table, related }) => {
    return data[table];
  },

  create: ({ table, payload, fields }) => {
    const record = {
      id: data[table].length ? Math.max(...data[table].map((item) => item.id)) + 1 : 1,
    };
    fields.forEach((field) => payload[field] && (record[field] = payload[field]));
    data[table].push(record);
    saveData();
    return record;
  },

  read: ({ table, id }) => {
    const record = data[table].find((item) => item.id === id);
    return record ? record : NOT_FOUND;
  },

  update: ({ table, id, payload, fields }) => {
    const record = data[table].find((item) => item.id === id);
    if (record) {
      fields.forEach((field) => (record[field] = payload[field] || record[field]));
    }
    saveData();
    return record ? SUCCESS : NOT_FOUND;
  },

  delete: ({ table, id }) => {
    const record = data[table].find((item) => item.id === id);
    if (record) {
      data[table] = data[table].filter((item) => item.id !== id);
    }
    saveData();
    return record ? SUCCESS : NOT_FOUND;
  },
};

export const db = {
  users: {
    list: (related = []) => generic.list({ table: "users", related }),
    create: (payload) => generic.create({ table: "users", payload, fields: fields.users.slice(1) }),
    read: (id) => generic.read({ table: "users", id }),
    update: (id, payload) => generic.update({ table: "users", id, payload, fields: fields.users.slice(1) }),
    delete: (id) => generic.delete({ table: "users", id }),
  },

  containers: {
    list: (related = []) => generic.list({ table: "containers", related }),
    create: (payload) => generic.create({ table: "containers", payload, fields: fields.containers.slice(1) }),
    read: (id) => generic.read({ table: "containers", id }),
    update: (id, payload) => generic.update({ table: "containers", id, payload, fields: fields.containers.slice(1) }),
    delete: (id) => generic.delete({ table: "containers", id }),

    listByUserId: (id) => data.containers.filter((item) => item.userId === id),
  },

  items: {
    list: (related = []) => generic.list({ table: "items", related }),
    create: (payload) => generic.create({ table: "items", payload, fields: fields.items.slice(1) }),
    read: (id) => generic.read({ table: "items", id }),
    update: (id, payload) => generic.update({ table: "items", id, payload, fields: fields.items.slice(1) }),
    delete: (id) => generic.delete({ table: "items", id }),

    listByUserId: (id) => data.items.filter((item) => item.userId === id),
    listByContainerId: (id) => data.items.filter((item) => item.containerId === id),
    listWithinContainer: (containerId) => {
      const containerIds = db.getContainerDecendantInfo({ containerId, fieldName: "id" });
      const filterWithinContainers = (item) => containerIds.includes(item.containerId);
      return db.items.list().filter(filterWithinContainers);
    },

    breadcrumb: (itemId) => {
      const { containerId } = db.items.read(itemId);
      return db.getContainerAcendantInfo({ containerId, fieldName: "name" });
    },
  },

  images: {
    list: (related = []) => generic.list({ table: "images", related }),
    create: (payload) => generic.create({ table: "images", payload, fields: fields.images.slice(1) }),
    read: (id) => generic.read({ table: "images", id }),
    update: (id, payload) => generic.update({ table: "images", id, payload, fields: fields.images.slice(1) }),
    delete: (id) => generic.delete({ table: "images", id }),
  },

  getContainerAcendantInfo: ({ containerId, fieldName, breadcrumb = [], stop = false }) => {
    if (stop) {
      return breadcrumb;
    }

    const container = db.containers.read(containerId);
    breadcrumb.unshift(container[fieldName]);
    return db.getContainerAcendantInfo({
      containerId: container.containerId,
      fieldName,
      breadcrumb,
      stop: container.type === "location",
    });
  },

  getContainerDecendantInfo: ({ containerId, fieldName, breadcrumb = [], stop = false }) => {
    if (stop) {
      return breadcrumb;
    }

    if (breadcrumb.length === 0) {
      breadcrumb.unshift(containerId);
    }

    const withinContainers = (item) => breadcrumb.includes(item.containerId);
    const containerIds = db.containers
      .list()
      .filter(withinContainers)
      .map((item) => item[fieldName]);

    const newBreadcrumb = [...new Set([...breadcrumb, ...containerIds])];

    return db.getContainerDecendantInfo({
      containerId,
      fieldName,
      breadcrumb: newBreadcrumb,
      stop: breadcrumb.length === newBreadcrumb.length,
    });
  },
};
