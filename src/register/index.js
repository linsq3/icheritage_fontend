import Vue from 'vue'
import directives from './directive.js'
import components from './component.js'
import mixins from './mixin'
import methods from './method'


/**
 * 把一些全局对象和一些全局方法，注册到Vue原型上
 */
Vue.use({
    install(Vue, options) {
        // 注册混合
        Vue.mixin(mixins)
        // 注册指令
        directives.forEach(directive => {
            Vue.directive(directive.key, directive.value);
        })
        // 添加实例方法
        methods.forEach(method => {
            Vue.prototype[`$${method.name}`] = method.func;
        });
    }
})
// 注册全局组件
for (let key in components) {
    let cpName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    if (cpName && cpName[0] === '-') {
        cpName = cpName.replace('-', '')
    }
    Vue.component(cpName,components[key]);
}
