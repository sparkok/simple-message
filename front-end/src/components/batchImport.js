// 批量注册全局控件
import myTable from "@/components/myTable/index.vue";
import myDialog from "@/components/myDialog/index.vue";
import myButton from "@/components/myButton/index.vue";
import myCard from "@/components/myCard/index.vue";
import myContainer from "@/components/myContainer/index.vue";
import linkBtn from "@/components/linkBtn/index.vue";
import screenFull from "@/components/screenFull/index.vue";
import myProgress from "@/components/myProgress/index.vue";
import topicSwitch from "@/components/topicSwitch/index.vue";

export default {
    install (app) {
        app.component('my-table', myTable);
        app.component('my-dialog', myDialog);
        app.component('my-button', myButton);
        app.component('my-card', myCard);
        app.component('my-container', myContainer);
        app.component('link-btn', linkBtn);
        app.component('screen-full', screenFull);
        app.component('my-progress', myProgress);
        app.component('topic-switch', topicSwitch);
    }
}