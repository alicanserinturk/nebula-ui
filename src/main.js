if (process.env.VUE_APP_ENV === 'production') {
  const noop = () => {};
  console.log = noop;
  console.debug = noop;
  console.info = noop;
}

import Vue from 'vue'

Vue.config.ignoredElements = ['ion-icon', /^ion-/]

import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import ElementUI, {
  Alert,
  Aside,
  Autocomplete,
  Backtop,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonGroup,
  Calendar,
  Card,
  Carousel,
  CarouselItem,
  Cascader,
  CascaderPanel,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Col,
  Collapse,
  CollapseItem,
  ColorPicker,
  Container,
  DatePicker,
  Dialog,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Footer,
  Form,
  FormItem,
  Header,
  Icon,
  Image,
  Input,
  InputNumber,
  Link,
  Loading,
  Main,
  Menu,
  MenuItem,
  MenuItemGroup,
  Message,
  MessageBox,
  Notification,
  Option,
  OptionGroup,
  PageHeader,
  Pagination,
  Popover,
  Progress,
  Radio,
  RadioButton,
  RadioGroup,
  Rate,
  Row,
  Select,
  Slider,
  Spinner,
  Step,
  Steps,
  Submenu,
  Switch,
  Table,
  TableColumn,
  TabPane,
  Tabs,
  Tag,
  Timeline,
  TimelineItem,
  TimePicker,
  TimeSelect,
  Tooltip,
  Transfer,
  Tree,
  Upload
} from 'element-ui'
import locale from 'element-ui/lib/locale/lang/tr-TR'
import API from './utils/API'
import EventBus from './utils/EventBus'
import AppModuleHeader from "./components/app/ModuleHeader";
import AppModuleBody from "./components/app/ModuleBody";
import AppModule from "./components/app/Module";
import AppTable from "./components/app/Table";
import AppAccordion from "./components/app/Accordion";
import AppActionList from "./components/app/ActionList";
import AppListItem from "./components/app/ListItem";
import AppLabel from "./components/app/Label";
import AppWarning from "./components/app/Warning";
import AppFormRow from "./components/app/FormRow";
import AppCard from "./components/app/Card";
import AppAccess from "./components/app/Access";

import AppFormIconInput from "./components/form/IconInput";
import AppFormPriceInput from "./components/form/PriceInput";
import AppFormUrlInput from "./components/form/UrlInput";
import AppFormEditorInput from "./components/form/EditorInput";
import AppFormPasswordInput from "./components/form/PasswordInput";
import AppFormUserInput from "./components/form/UserSelect";
import AppFormQueueInput from "./components/form/QueueSelect";
import AppFormDialPlanInput from "./components/form/DialPlanSelect";
import AppFormPbxInput from "./components/form/PbxSelect";
import AppFormNumberSelect from "./components/form/NumberSelect";
import AppFormFormSelect from "./components/form/FormSelect";
import AppFormCallListSelect from "./components/form/CallListSelect";
import AppFormResultCodeSelect from "./components/form/ResultCodeSelect";

import AppDateText from "./components/text/Date";
import AppDateRangeText from "./components/text/DateRange";
import AppModernModal from "./components/app/ModernModal";
import AppCrm from "./components/app/Crm";
import AppSelector from "./components/app/Selector";
import AppAudio from "./components/app/Audio";
import AppLog from "./components/app/Log";
import AppSvg from "./components/app/Svg";
import AppInformation from "./components/app/Information";
import AppAvatar from "./components/app/Avatar";
import AppSelect from "./components/form/Select";

import AudioVisual from 'vue-audio-visual'
Vue.use(AudioVisual)

/*
* Element IO
* */
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Autocomplete);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Checkbox);
Vue.use(CheckboxButton);
Vue.use(CheckboxGroup);
Vue.use(Switch);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);
Vue.use(TimeSelect);
Vue.use(TimePicker);
Vue.use(Popover);
Vue.use(Tooltip);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tag);
Vue.use(Tree);
Vue.use(Alert);
Vue.use(Slider);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Upload);
Vue.use(Progress);
Vue.use(Spinner);
Vue.use(Badge);
Vue.use(Card);
Vue.use(Rate);
Vue.use(Steps);
Vue.use(Step);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Cascader);
Vue.use(ColorPicker);
Vue.use(Transfer);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Timeline);
Vue.use(TimelineItem);
Vue.use(Link);
Vue.use(Divider);
Vue.use(Image);
Vue.use(Calendar);
Vue.use(Backtop);
Vue.use(PageHeader);
Vue.use(CascaderPanel);
Vue.use(Loading.directive);
Vue.use(ElementUI, { locale });

/*
* Particles
* */
import VueParticles from 'vue-particles'
Vue.use(VueParticles)

import JsonExcel from "vue-json-excel";
Vue.component("downloadExcel", JsonExcel);

Vue.component('app-module-header', AppModuleHeader)
Vue.component('app-module-body', AppModuleBody)
Vue.component('app-module', AppModule)
Vue.component('app-table', AppTable)
Vue.component('app-accordion', AppAccordion)
Vue.component('app-list-action', AppActionList)
Vue.component('app-list-item', AppListItem)
Vue.component('app-label', AppLabel)
Vue.component('app-warning', AppWarning)
Vue.component('app-form-row', AppFormRow)
Vue.component('app-card', AppCard)
Vue.component('app-date-text', AppDateText)
Vue.component('app-date-range-text', AppDateRangeText)
Vue.component('app-modern-modal', AppModernModal)
Vue.component('app-crm', AppCrm)
Vue.component('app-selector', AppSelector)
Vue.component('app-access', AppAccess)

Vue.component('app-form-url-input', AppFormUrlInput)
Vue.component('app-form-price-input', AppFormPriceInput)
Vue.component('app-form-icon-input', AppFormIconInput)
Vue.component('app-form-editor-input', AppFormEditorInput)
Vue.component('app-form-password-input', AppFormPasswordInput)
Vue.component('app-form-user-select', AppFormUserInput)
Vue.component('app-form-queue-select', AppFormQueueInput)
Vue.component('app-form-dial-plan-select', AppFormDialPlanInput)
Vue.component('app-form-pbx-select', AppFormPbxInput)
Vue.component('app-form-number-select', AppFormNumberSelect)
Vue.component('app-form-form-select', AppFormFormSelect)
Vue.component('app-form-call-list-select', AppFormCallListSelect)
Vue.component('app-form-result-code-select', AppFormResultCodeSelect)
Vue.component('app-audio', AppAudio)
Vue.component('app-log', AppLog)
Vue.component('app-svg', AppSvg)
Vue.component('app-information', AppInformation)
Vue.component('app-avatar', AppAvatar)
Vue.component('app-select', AppSelect)

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
Vue.prototype.$event = EventBus;
Vue.prototype.$api = API

Vue.config.productionTip = false
new Vue({
  router,
  store,
  i18n,
  created(){
    let user = localStorage.getItem('user');
    this.$i18n.locale = user !== null ? JSON.parse(user).settings.interface_language : 'tr';
  },
  '$route': function(){

  },
  render: h => h(App)
}).$mount('#app')
