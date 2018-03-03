import Vue from 'vue';
import {
  Button,
  Select,
  InputNumber,
  Table,
  TableColumn,
  Option,
  Switch
} from 'element-ui';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.use(Button);
Vue.use(Select);
Vue.use(InputNumber);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Option);
Vue.use(Switch);

new Vue({
  render: h => h(App)
}).$mount('#app');
