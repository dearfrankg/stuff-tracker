import data from "./database.json";

export const db = {
  getUsers: () => data.users,
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
