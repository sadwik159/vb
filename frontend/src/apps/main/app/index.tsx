import "src/common/service-worker/pwa";

import NProgress from "nprogress";
import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { initWindowGlobals } from "src/common/window.globals";
import { LazySwitch } from "src/components/lazy-switch";
import { Loading } from "src/components/loading";
import { frontendConfig } from "src/config";
import { mainConfig } from "t9/apps/main/config";
import { mainStore } from "t9/redux/main";
import { fetchArticle } from "t9/redux/main/actions/article";
import { fetchArticles } from "t9/redux/main/actions/articles";
import { resetSelectedArticle } from "t9/redux/main/actions/articles-scene";
import { fetchBook } from "t9/redux/main/actions/book";
import { fetchBooks } from "t9/redux/main/actions/books";
import { resetSelectedBook } from "t9/redux/main/actions/books-scene";
import { fetchStatistics } from "t9/redux/main/actions/covid-19-scene";
import { fetchRecentArticles, fetchRecentBooks, fetchRecentProjects } from "t9/redux/main/actions/landing-scene";
import { fetchProjects } from "t9/redux/main/actions/projects-scene";
import { fetchFavoriteBooks } from "t9/redux/main/actions/reader-scene";
import { Footer } from "../components/footer";
import { Navbar } from "../components/navbar";
import "./style";

// only called once across entry.
initWindowGlobals(mainConfig.app.frontendBaseURL, mainConfig.language.isDefaultLanguage, mainStore);

const lazyComponents = window.globals.addLazyComponents([
  {
    component: () => <Loading />,
    import: () => import(/* webpackChunkName: "landing" */ "../scenes/landing"),
    operationName: "loading-landing-scene",
    status: "not-loaded",
    url: { is: "/", exact: true },
  },
  {
    component: () => <Loading />,
    import: () => import(/* webpackChunkName: "articles" */ "../scenes/articles"),
    operationName: "loading-articles-scene",
    status: "not-loaded",
    url: { is: "/Articles", exact: false },
  },
  {
    component: () => <Loading />,
    import: () => import(/* webpackChunkName: "books" */ "../scenes/books"),
    operationName: "loading-books-scene",
    status: "not-loaded",
    url: { is: "/Books", exact: false },
  },
  {
    component: () => <Loading />,
    import: () => import(/* webpackChunkName: "projects" */ "../scenes/projects"),
    operationName: "loading-projects-scene",
    status: "not-loaded",
    url: { is: "/Projects", exact: false },
  },
  {
    component: () => <Loading />,
    import: () => import(/* webpackChunkName: "reader" */ "../scenes/reader"),
    operationName: "loading-reader-scene",
    status: "not-loaded",
    url: { is: "/Reader", exact: false },
  },
  {
    component: () => <Loading />,
    import: () => import(/* webpackChunkName: "developer" */ "../scenes/developer"),
    operationName: "loading-developer-scene",
    status: "not-loaded",
    url: { is: "/Developer", exact: false },
  },
  {
    component: () => <Loading />,
    import: () => import(/* webpackChunkName: "covid-19" */ "../scenes/covid-19"),
    operationName: "loading-covid-19-scene",
    status: "not-loaded",
    url: { is: "/COVID-19", exact: false },
  },
]);

window.globals.addLazyOperations([
  {
    actions: [fetchArticles],
    operationName: "fetch-articles",
    repeatable: false, status: "not-called",
    url: { is: "/Articles", exact: false },
  },
  {
    actions: [fetchArticle],
    operationName: "fetch-article",
    repeatable: true, status: "not-called",
    url: { is: "/Articles/:articleSlug", exact: true },
  },
  {
    actions: [resetSelectedArticle],
    operationName: "reset-articles-scene-selectedKeys",
    repeatable: true, status: "not-called",
    url: { is: "/Articles", exact: true },
  },
  {
    actions: [fetchBooks],
    operationName: "fetch-books",
    repeatable: false, status: "not-called",
    url: { is: "/Books", exact: false },
  },
  {
    actions: [fetchBook],
    operationName: "fetch-book",
    repeatable: true, status: "not-called",
    url: { is: "/Books/:bookSlug", exact: true },
  },
  {
    actions: [resetSelectedBook],
    operationName: "reset-books-scene-selectedKeys",
    repeatable: true, status: "not-called",
    url: { is: "/Books", exact: true },
  },
  {
    actions: [fetchRecentArticles, fetchRecentProjects],
    operationName: "fetch-data-for-landing-scene",
    repeatable: false, status: "not-called",
    url: { is: "/(Developer)?", exact: true },
  },
  {
    actions: [fetchRecentBooks],
    operationName: "fetch-recent-books",
    repeatable: false, status: "not-called",
    url: { is: "/(Reader)?", exact: true },
  },
  {
    actions: [fetchFavoriteBooks],
    operationName: "fetch-data-for-reader-scene",
    repeatable: false, status: "not-called",
    url: { is: "/Reader", exact: false },
  },
  {
    actions: [fetchProjects],
    operationName: "fetch-book",
    repeatable: true, status: "not-called",
    url: { is: "/Projects", exact: false },
  },
  {
    actions: [fetchStatistics],
    operationName: "fetch-covid-19-status",
    repeatable: false, status: "not-called",
    url: { is: "/COVID-19", exact: false },
  },
]);

export const App: React.SFC<{}> = () => {
  return (
    <>
      <Navbar />
      <LazySwitch
        transitionKey={1}
        transitionClass="fade"
        timeout={frontendConfig.animation.animationDuration}

        childrenKey="app-level"
        lazyComponents={lazyComponents}
      />
      <Footer />
    </>
  );
};

render(
  (<Provider store={mainStore}><Router history={window.globals.history}><App /></Router></Provider>),
  document.getElementById("app-container"),
);

// Progress bar
NProgress.configure({ showSpinner: false, trickleSpeed: 200, minimum: .4, speed: 500 });
let _oldStatus: string;
mainStore.subscribe(() => {
  const status = mainStore.getState().status.status;
  if (_oldStatus === status) { return; }
  _oldStatus = status;
  if (status === "active") {
    NProgress.start();
  } else if (status === "idle") {
    NProgress.done();
  }
});
