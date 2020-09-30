import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "@/views/home/Home.vue";
import ScribePanel from "@/views/scribe-panel/ScribePanel.vue";
import CurrentGameHistory from "@/views/current-game-history/CurrentGameHistory.vue";

Vue.use(VueRouter);

export const ROUTES = {
  HOME: { name: "Home", path: "/" },
  SCRIBE_PANEL: { name: "ScribePanel", path: "/scribe-panel" },
  CURRENT_GAME_HISTORY: {
    name: "CurrentGameHistory",
    path: "/current-game-history"
  }
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
    component: ScribePanel
  },
  {
    path: ROUTES.CURRENT_GAME_HISTORY.path,
    name: ROUTES.CURRENT_GAME_HISTORY.name,
    component: CurrentGameHistory
  }
];

const router = new VueRouter({
  mode: "hash",
  routes
});

export default router;
