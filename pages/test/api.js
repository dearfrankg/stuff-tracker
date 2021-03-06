import { useEffect, useState, useMemo } from "react";
import { services } from "/services";
import { PageHeader } from "antd";

const styles = {
  flex: { display: "flex" },
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

const tables = ["users", "containers", "items", "images"];

const getData = async (setState) => {
  const data = {};

  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    const nextId = Math.max(...(await services[table].list()).map((item) => item.id)) + 1;
    data[table] = {};
    data[table].list = { records: (await services[table].list()).length };
    data[table].create = await services[table].create({ payload: records[table].create });
    data[table].read = await services[table].read({ id: nextId });
    data[table].update = await (async () => {
      await services[table].update({ id: nextId, payload: records[table].update });
      return await services[table].read({ id: nextId });
    })();
    data[table].delete = await (async () => {
      await services[table].delete({ id: nextId });
      return { records: (await services[table].list()).length };
    })();
  }

  setState(data);
};

const API = (props) => {
  const [state, setState] = useState({});

  useEffect(() => {
    getData(setState);
  }, []);

  const flexItems = tables.map((table, tableIndex) => (
    <div key={tableIndex}>
      <h2>{table}</h2>
      <pre>{state[table] && JSON.stringify(state[table], null, 2)}</pre>
    </div>
  ));

  return (
    <>
      <PageHeader title={"API Test"} />
      <div style={{ ...styles.flex, justifyContent: "space-evenly" }}>{flexItems}</div>
    </>
  );
};

export default API;

// const getStructure = (data, table) => {
//   console.log("table: ", table);
//   return [
//     { title: "List", data: data[table].list },
//     { title: "Create", data: data[table].create },
//     { title: "Read", data: data[table].read },
//     { title: "Update", data: data[table].update },
//     { title: "Delete", data: data[table].delete },
//   ];
// };

// const flexItems = Object.keys(data).map((table, tableIndex) => {
//   const structure = getStructure(data, table);
//   const commands = structure.map((item, itemIndex) => (
//     <div key={itemIndex}>
//       <strong>{item.title}</strong>
//       <pre style={{ fontSize: "0.5rem" }}>{JSON.stringify(item.data, null, 2)}</pre>
//     </div>
//   ));
//   return (
//     <div key={tableIndex} style={{ ...styles.flex, flexDirection: "column" }}>
//       <h2>{table}</h2>
//       {commands}
//     </div>
//   );
// });
