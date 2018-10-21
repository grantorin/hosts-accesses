import Vue from 'vue'
import Translit from './Translit.vue'
import App from './App.vue'

document.body.style.opacity = 1;

new Vue({
  el: '#translit',
  render: h => h(Translit)
})

/**
 * Test support your browser web storage
 */
if ( typeof( Storage ) === "undefined" ) {
    alert( "Sorry, your browser does not support web storage..." );
    throw "stop";
}


new Vue({
  el: '#app',
  render: h => h(App)
})