// import fs from "fs";
import data from "./database.json";

const SUCCESS = { success: "ok" };
const NOT_FOUND = { message: "record not found" };

function saveData() {
  // fs.writeFileSync("./database.json", JSON.stringify(data, null, 2));
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
    if (record.id) {
      fields.forEach((field) => (record[field] = payload[field] || record[field]));
    }
    saveData();
    return record.id ? SUCCESS : NOT_FOUND;
  },

  delete: ({ table, id }) => {
    const record = data[table].find((item) => item.id === id);
    if (record.id) {
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
    read: (id) => generic.read("containers", id),
    update: (id, payload) => generic.update({ table: "containers", id, payload, fields: fields.containers.slice(1) }),
    delete: (id) => generic.delete({ table: "containers", id }),
  },

  items: {
    list: (related = []) => generic.list({ table: "items", related }),
    create: (payload) => generic.create({ table: "items", payload, fields: fields.items.slice(1) }),
    read: (id) => generic.read("items", id),
    update: (id, payload) => generic.update({ table: "items", id, payload, fields: fields.items.slice(1) }),
    delete: (id) => generic.delete({ table: "items", id }),
  },

  images: {
    list: (related = []) => generic.list({ table: "images", related }),
    create: (payload) => generic.create({ table: "images", payload, fields: fields.images.slice(1) }),
    read: (id) => generic.read("images", id),
    update: (id, payload) => generic.update({ table: "images", id, payload, fields: fields.images.slice(1) }),
    delete: (id) => generic.delete({ table: "images", id }),
  },

  getUserById: (id) => data.users.find((item) => item.id === id),

  getContainers: () => data.containers,
  getContainerById: (id) => data.containers.find((item) => item.id === id),
  getContainersByUserId: (id) => data.containers.filter((item) => item.userId === id),
  genContainerInfoAscendingById: ({ containerId, fieldName, breadcrumb = [], stop = false }) => {
    if (stop) {
      return breadcrumb;
    }

    const container = db.getContainerById(containerId);
    breadcrumb.unshift(container[fieldName]);
    return db.genContainerInfoAscendingById({
      containerId: container.containerId,
      fieldName,
      breadcrumb,
      stop: container.type === "location",
    });
  },
  genContainerInfoDecendingById: ({ containerId, fieldName, breadcrumb = [], stop = false }) => {
    if (stop) {
      return breadcrumb;
    }

    if (breadcrumb.length === 0) {
      breadcrumb.unshift(containerId);
    }

    const withinContainers = (item) => breadcrumb.includes(item.containerId);
    const containerIds = db
      .getContainers()
      .filter(withinContainers)
      .map((item) => item[fieldName]);

    const newBreadcrumb = [...new Set([...breadcrumb, ...containerIds])];

    return db.genContainerInfoDecendingById({
      containerId,
      fieldName,
      breadcrumb: newBreadcrumb,
      stop: breadcrumb.length === newBreadcrumb.length,
    });
  },

  getItems: () => data.items,
  getItemById: (id) => data.items.find((item) => item.id === id),
  getItemsByUserId: (id) => data.items.filter((item) => item.userId === id),
  getItemsByContainerId: (id) => {
    const containerIds = db.genContainerInfoDecendingById({ containerId: id, fieldName: "id" });
    const filterWithinContainers = (item) => containerIds.includes(item.containerId);
    return db.getItems().filter(filterWithinContainers);
  },
  getBreadcrumbByItemId: (itemId) => {
    const { containerId } = db.getItemById(itemId);
    return db.genContainerInfoAscendingById({ containerId, fieldName: "name" });
  },

  getImages: () => data.images,
  getImageById: (id) => data.images.find((item) => item.id === id),
};

const usersList = (relations) => {
  const relationships = {
    containers: (userId) => {
      const data = db.containers.list({ belongingToUser: userId });
      return {
        data,
        count: data.length,
      };
    },
    containerCount: (userId) => {
      const obj = relationships.containers(userId);
      delete obj.data;
      return obj;
    },
  };

  return data.users.map((user) => {
    relations.forEach((relation) => {
      if (relationships[relation]) {
        user = {
          ...user,
          [relation]: relationships[relation](user.id),
        };
      }
    });
  });
};
