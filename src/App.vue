<template >
  <b-container fluid id = "app" style="background-color: #000;
                                      color: rgb(0, 107, 107);">
    <b-row align-h="between" class="header">
      <b-col cols="2" style="margin: 1%;">
        <b-button v-b-toggle.sidebar id="main" v-if="is_auth"> ☰ </b-button>  
      </b-col>
      <b-col cols="3" md="2">
        <div v-if="is_auth" class="user_container">
          <p>{{username}}</p>    
        </div>
      </b-col>
    </b-row>    
        <b-sidebar id="sidebar" v-if="is_auth">       
          <b-button-group vertical size="lg">
              <b-button variant="secondary" v-on:click="go_to_resumen">Dashboard</b-button>
              <!-- <b-button variant="secondary" v-on:click="go_to_incomes"> Ingresos </b-button> -->
              <b-button variant="secondary" v-on:click="go_to_reg">Registers</b-button>
              <!-- <b-button variant="secondary" v-on:click="go_to_goals">Metas</b-button> -->
              <b-button variant="secondary" v-on:click="go_to_cats">Categories</b-button>              
			  <b-button variant="secondary" v-on:click="logOut" id="cerrar"> Logout </b-button>    
          </b-button-group>
        </b-sidebar>
      <b-row>
        <b-col cols="12">
          <div v-bind:class="[!open ? 'main-component_2' : 'main-component' ]">  
            <router-view v-on:log-in="logIn"> </router-view>
          </div>
        </b-col>
      </b-row>          
  </b-container>
</template>

<script>
import vueRouter from 'vue-router'
import Vue from 'vue'
import { BootstrapVue } from 'bootstrap-vue'
import Resumen from './components/Resumen.vue'
import Registros from './components/Registros.vue'

Vue.use(BootstrapVue)

export default {
    name: 'App',    
    components: { Resumen, Registros },
    data: function(){
      return {
              is_auth: localStorage.getItem('isAuth') || false, 
              username: localStorage.getItem("current_username"),
              open: false              
              };
    },    
    created: function(){
      this.$router.push({name: "root"})
      this.updateAuth()      
    },
          
  methods: {
    updateAuth: function(){
      var self = this;      
      self.is_auth = localStorage.getItem('isAuth') || false
      if(self.is_auth == false)
        self.$router.push({name: "Login"})
      else{
        let username = localStorage.getItem("current_username")
        self.$router.push({name: "Resumen", params:{ username: username }})
      }
    },
    go_to_incomes: function () {
      if (this.$route,name != "Ingresos"){
        let username = localStorage.getItem("current_username")
        this.$router.push({name:"Ingresos", params: {username: username}});
        this.open = false;
      }
    },
    go_to_goals: function () {
      if (this.$route.name != "Metas"){
        let username = localStorage.getItem("current_username")
        this.$router.push({name:"Metas", params: {username: username}});
        this.open = false;
      }
    },
    go_to_reg: function () {
      if (this.$route.name != "Registros"){
        let username = localStorage.getItem("current_username")
        this.$router.push({name: "Registros", params: {username: username}});
        this.open = false;
      }
    },
    go_to_resumen: function () {
      if (this.$route.name != "Resumen") {
      let username = localStorage.getItem("current_username")
      this.$router.push({name: "Resumen", params: {username: username}});
      this.open = false;        
      }
    },
    go_to_cats: function () {
      if (this.$route.name != "Categorias") {
      let username = localStorage.getItem("current_username")
      this.$router.push({name: "Categorias", params: {username: username}});                
      this.open = false;
      }
    },
    logIn: function(username){
      localStorage.setItem('current_username', username)
      localStorage.setItem('isAuth', true)
      this.updateAuth()
    },
    logOut: function () {
      localStorage.removeItem('isAuth')
      localStorage.removeItem("current_username")
      this.updateAuth()
    }, 
  }
}
</script>
