import React from 'react';
import { Layout, Menu, Breadcrumb, List, Button, Table } from 'antd';
import './App.css';
import { observable, computed, action, makeObservable, autorun } from "mobx"
import { useLocalStore, useObserver } from "mobx-react"
import  { GetUsers }   from './GetData';

const { Header, Content, Footer } = Layout;

//console.log(GetUsers().then(() => {console.log("fullfilled")}))


class MainStore {
  users = [];
  groups = [];
  rights = [];
  currentPage = { key: 'Группы' };

  changePage(item: any) {
    console.log(item)
    this.currentPage = item;
  }

  loadUsers = () => {
    GetUsers().then(res => {
      this.users = res.users;
      console.log(res);
    });
  }

  constructor() {
    makeObservable(this, {
      users: observable,
      groups: observable,
      rights: observable,
      currentPage: observable,
      changePage: action,
      loadUsers: action
    });
    autorun(() => console.log(this));
  }
}

const mainStore = new MainStore();
mainStore.loadUsers();

const StoreContext = React.createContext(mainStore);

/* const StoreProvider: React.FC = ({ children }) => {
  const store = useLocalStore(() => ({
    users: [],
    groups: [],
    rights: [],
    currentPage: 1,
    changePage: (item: any) => {
      console.log("call from storeProvider")
      store.currentPage = item.key;
    }
  }));

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}; */

function useRootStore() {
  const context = React.useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useRootStore must be used within RootStoreProvider")
  }

  return context
}

function Navbar() {
  const store = useRootStore();
  return useObserver(() =>  (
      <Header>
          <Menu theme="dark" mode="horizontal"  onClick={(item) => {store.changePage(item)}}>
              <Menu.Item key={'Группы'}>{`Группы`}</Menu.Item>
              <Menu.Item key={'Пользователи'}>{`Пользователи`}</Menu.Item>
              <Menu.Item key={'Права'}>{`Права`}</Menu.Item>
          </Menu>
      </Header>
  ));
};

function UsersPage() {
  const store = useRootStore();
  store.loadUsers();
  console.log(store.users);
  let dataSource = store.users;
  const columns = [
    {
      title: 'П/Н',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Имя',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Действия',
      key: 'action',
      render: () => {
        return (
        <Button type="primary" danger>
          Удалить
        </Button>
        )
      }
    }
  ];

  return useObserver(() =>  (
    <Table columns={columns} dataSource={dataSource} />
  ));
}

function MainContent() {
  const store = useRootStore();
  return useObserver(() =>  (
    <Content style={{ padding: '0 50px' }}>
    <Breadcrumb style={{ margin: '16px 0' }}>
      <Breadcrumb.Item>Home</Breadcrumb.Item>
      <Breadcrumb.Item>{store.currentPage.key}</Breadcrumb.Item>
    </Breadcrumb>
    <div className="site-layout-content">
      <UsersPage />
    </div>
  </Content>
  ));
}

function App() {
  const store = useRootStore();
  return (
    <Layout className="layout">
        <Navbar />
        <MainContent />
    </Layout>
  );
};



export default App;
