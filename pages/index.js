import { useState } from "react";
import Image from "next/image";
import { db } from "/database";
import { Space, Input } from "antd";
import { Select, Breadcrumb } from "/components/cogent";
import { SiteLayout } from "/components/site-layout";

const { Search } = Input;

const resources = {
  styles: {
    controlsSelect: { width: 300 },
    controlsSearch: { width: 200 },
    items: { display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "space-evenly", marginTop: 50 },
    itemCard: {
      width: 300,
      background: "#efefef",
      borderRadius: 8,
      boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
    },
    itemCardSelected: {
      width: 300,
      background: "#efefef",
      borderRadius: 8,
      boxShadow: "rgba(70, 70, 93, 0.5) 0px 2px 5px -1px, rgba(0, 0, 0, 0.8) 0px 2px 4px -1px",
    },
    imageWrap: {},
    image: { borderRadius: "8px 8px 0 0" },
    itemName: { margin: "4px 8px" },
    breadcrumb: {
      marginTop: -33,
      zIndex: 5,
      position: "fixed",
      width: "calc( 100vw - 200px )",
      height: 50,
      background: "#fff",
      padding: "12px 8px 24px 8px ",
    },
  },

  data: {
    containerOrderMap: {
      location: 1,
      area: 2,
      room: 3,
      container: 4,
    },
  },

  components: ({ styles, state, handle }) => ({
    Controls: ({ containerSelectOptions }) => (
      <Space size="large">
        <span>Container: </span>
        <Select
          value={state.container}
          onChange={handle.container}
          options={containerSelectOptions}
          style={styles.controlsSelect}
        />
        <Search defaultValue={state.search} onSearch={handle.search} style={styles.controlsSearch} allowClear />
      </Space>
    ),

    ItemList: ({ itemList }) => {
      const items = itemList.map((item, itemIndex) => {
        const cardStyle = item.id === state.selected ? styles.itemCardSelected : styles.itemCard;

        return (
          <div key={itemIndex} style={cardStyle} onClick={() => handle.selectCard(item.id)}>
            <div style={styles.imageWrap}>
              <Image
                style={styles.image}
                src={item.imageUrl}
                objectFit="cover"
                alt={item.alt}
                width={300}
                height={150}
              />{" "}
            </div>

            <div style={styles.itemName}>{item.name}</div>
          </div>
        );
      });

      return <div style={styles.items}>{items}</div>;
    },
  }),

  handle: ({ state, set, containerOrderMap }) => ({
    container: (value) => set({ container: value }),
    search: (value) => set({ search: value }),
    sortByOrderAndName: (a, b) => a.order - b.order || a.name.localeCompare(b.name),
    filterNameIncludesSearch: (item) => item.name.includes(state.search),
    selectCard: (value) => set({ selected: value }),
    addOrderField: (item) => ({
      ...item,
      order: containerOrderMap[item.type],
    }),
    addImageAndAltFields: (item) => {
      const { url, alt } = db.images.read(item.id);

      return {
        id: item.id,
        name: item.name,
        imageUrl: url,
        alt,
      };
    },
  }),

  selectors: {
    getContainerSelectOptions: ({ handle, userId }) => {
      const containerSelectOptions = db.containers
        .listByUserId(userId)
        .map(handle.addOrderField)
        .sort(handle.sortByOrderAndName)
        .map((item) => ({
          value: item.id,
          label: `${item.name} (${item.type})`,
        }));

      return [{ value: 0, label: "All Containers" }, ...containerSelectOptions];
    },

    getItemList: ({ userId, state, handle }) => {
      const isAllContainers = state.container === 0;
      const itemList = isAllContainers
        ? db.items.listByUserId(userId)
        : db.items.listContainerDecendants(state.container);

      return itemList.filter(handle.filterNameIncludesSearch).map(handle.addImageAndAltFields);
    },

    getBreadcrumbByItemId: (itemId) => (itemId ? db.items.breadcrumb(itemId) : []),
  },
};

const { styles } = resources;
const { containerOrderMap } = resources.data;
const { getContainerSelectOptions, getBreadcrumbByItemId, getItemList } = resources.selectors;

const Items = () => {
  const [state, setState] = useState({
    container: 0,
    search: "",
    selected: null,
  });
  const set = (newState) => setState((state) => ({ ...state, ...newState }));
  const handle = resources.handle({ state, set, containerOrderMap });
  const { Controls, ItemList } = resources.components({ styles, state, handle });

  const containerSelectOptions = getContainerSelectOptions({ handle, userId: 1 });
  const breadcrumbList = getBreadcrumbByItemId(state.selected);
  const itemList = getItemList({ userId: 1, state, handle });

  return (
    <SiteLayout pageTitle="Items" controls={<Controls {...{ containerSelectOptions }} />}>
      <Breadcrumb options={breadcrumbList} style={styles.breadcrumb} />
      <ItemList itemList={itemList} />
    </SiteLayout>
  );
};

export default Items;
