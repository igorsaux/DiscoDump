import { createApp } from "vue";
import { createPinia } from "pinia";
import { MotionPlugin } from "@vueuse/motion";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowLeft,
  faArrowRight,
  faBug,
  faVolumeHigh,
  faHashtag,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import VueTippy from "vue-tippy";
import "tippy.js/dist/tippy.css";
import "monaco-editor/min/vs/editor/editor.main.css";
import "monaco-editor/esm/vs/language/typescript/ts.worker.js";

import "./userWorker";
import App from "./App.vue";
import "./assets/base.css";

library.add(faArrowLeft);
library.add(faArrowRight);
library.add(faBug);
library.add(faVolumeHigh);
library.add(faHashtag);
library.add(faPlay);

const app = createApp(App);

app.component("fa-icon", FontAwesomeIcon);
app.use(MotionPlugin);
app.use(createPinia());
app.use(VueTippy, {
  directive: "tippy",
  component: "tippy",
  componentSingleton: "tippy-singleton",
  defaultProps: {
    allowHTML: true,
  },
});
app.mount("body");
