import { db } from "/database";
import { SiteLayout } from "/components/site-layout";

const resources = {
  styles: {
    title: { fontSize: "1rem", lineHeight: "2rem" },
    ul: { margin: "4px 0" },
  },

  data: {
    dbMethods: [
      { title: "getUsers()", items: db.getUsers() },
      { title: "getUsersById(1)", items: [db.getUserById(1)] },

      { title: "getContainers()", items: db.getContainers() },
      { title: "getContainersById(1)", items: [db.getContainerById(1)] },
      { title: "getContainersByUserId(1)", items: db.getContainersByUserId(1) },

      { title: "getItems()", items: db.getItems() },
      { title: "getItemsById(1)", items: [db.getItemById(1)] },
      { title: "getItemsByUserId(1)", items: db.getItemsByUserId(1) },
      { title: "getItemsByContainerId(1)", items: db.getItemsByContainerId(1) },

      { title: "getImages()", items: db.getImages().map((item) => ({ id: item.id, name: item.alt })) },
      { title: "getImagesById(1)", items: [db.getImageById(1)].map((item) => ({ id: item.id, name: item.alt })) },
    ],
  },

  components: {
    Title: ({ styles, title }) => <h1 style={styles.title}>{title}</h1>,

    List: ({ styles, items }) => {
      const listItems = items.map((item) => <li key={item.id}>{item.name}</li>);
      return <ul style={styles.ul}>{listItems}</ul>;
    },
  },

  selectors: {
    getMethodItems: ({ styles, dbMethods, Title, List }) =>
      dbMethods.map((item, itemIndex) => ({
        id: itemIndex,
        name: (
          <div key={itemIndex}>
            <Title styles={styles} title={item.title} />
            <List styles={styles} items={item.items} />
          </div>
        ),
      })),
  },
};

const { styles } = resources;
const { dbMethods } = resources.data;
const { Title, List } = resources.components;
const methodItems = resources.selectors.getMethodItems({ styles, dbMethods, Title, List });

const DatabaseMethods = () => {
  return (
    <SiteLayout pageTitle="Admin">
      <List styles={styles} items={methodItems} />
    </SiteLayout>
  );
};

export default DatabaseMethods;
