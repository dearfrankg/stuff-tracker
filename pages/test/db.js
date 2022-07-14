import { db } from "../../database";
import { PageHeader } from "antd";

const styles = {
  flex: { display: "flex" },
};

const getStructure = (data, table) => {
  return [
    { title: "List", data: data[table].list },
    { title: "Create", data: data[table].create },
    { title: "Read", data: data[table].read },
    { title: "Update", data: data[table].update },
    { title: "Delete", data: data[table].delete },
  ];
};

const Database = ({ data }) => {
  const flexItems = Object.keys(data).map((table, tableIndex) => {
    const structure = getStructure(data, table);
    const commands = structure.map((item, itemIndex) => (
      <div key={itemIndex}>
        <strong>{item.title}</strong>
        <pre style={{ fontSize: "0.5rem" }}>{JSON.stringify(item.data, null, 2)}</pre>
      </div>
    ));
    return (
      <div key={tableIndex} style={{ ...styles.flex, flexDirection: "column" }}>
        <h2>{table}</h2>
        {commands}
      </div>
    );
  });
  return (
    <>
      <PageHeader title={"Database Test"} />
      <div style={{ ...styles.flex, justifyContent: "space-evenly" }}>{flexItems}</div>
    </>
  );
};

export async function getServerSideProps() {
  const data = {
    users: {},
    containers: {},
    items: {},
    images: {},
  };

  const records = {
    users: {
      create: { name: "John Wayne", username: "jwayne", password: "xxx" },
      update: { password: "test123" },
    },
    containers: {
      create: { type: "location", name: "171 Alpine Way", containerId: 1, userId: 1 },
      update: { type: "room" },
    },
    items: {
      create: { name: "electic toothbrush", imageId: 22, userId: 1, containerId: 11 },
      update: { name: "polaris electic toothbrush" },
    },
    images: {
      create: { url: "/images/electic-toothbrush.webp", alt: "electic toothbrush" },
      update: { url: "/images/polaris-electic-toothbrush.webp", alt: "polaris electic toothbrush" },
    },
  };

  Object.keys(data).forEach((table) => {
    const nextId = Math.max(...db[table].list().map((item) => item.id)) + 1;

    data[table] = {
      list: { records: db[table].list().length },
      create: db[table].create(records[table].create),
      read: db[table].read(nextId),
      update: (() => {
        db[table].update(nextId, records[table].update);
        return db[table].read(nextId);
      })(),
      delete: (() => {
        db[table].delete(nextId);
        return { records: db[table].list().length };
      })(),
    };
  });

  return { props: { data } };
}

export default Database;
