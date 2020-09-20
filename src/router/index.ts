import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "@/views/home/Home.vue";

Vue.use(VueRouter);

export const ROUTES = {
  HOME: { name: "Home", path: "/" },
  SCRIBE_PANEL: { name: "ScribePanel", path: "/scribe-panel" }
};

const routes: Array<RouteConfig> = [
  {
    path: ROUTES.HOME.path,
    name: ROUTES.HOME.name,
    component: Home
  },
  {
    path: ROUTES.SCRIBE_PANEL.path,
    name: ROUTES.SCRIBE_PANEL.name,
    component: () =>
      import(
        /* webpackChunkName: "about" */ "../views/scribe-panel/ScribePanel.vue"
      )
  }
];

const router = new VueRouter({
  mode: "hash",
  routes
});

export default router;
