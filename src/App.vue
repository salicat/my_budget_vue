<template>
  <b-container fluid id = "app" >
    <b-row align-h="between">
      <b-col cols="2" style="margin: 1%;">
        <b-button v-b-toggle.sidebar id="main" v-if="is_auth"> ☰ </b-button>  
      </b-col>
      <b-col cols="2" style="border-radius: 10px;
                            margin: 1%;  
                            padding: 1%; 
                            border:1px solid rgb(0, 107, 107); 
                            box-shadow: 0 5px 15px rgba(0, 148, 148, 0.774);">
        <div v-if="is_auth">
          <h2>{{username}}</h2>    
        </div>
      </b-col>
    </b-row>    
        <b-sidebar id="sidebar" v-if="is_auth" bg-variant="dark">       
        <b-button-group vertical>
          <b-col cols="12">  
            <b-button variant="secondary" v-on:click="go_to_resumen">Resumen</b-button>
          </b-col>
          <b-col cols="12">
            <b-button variant="secondary" v-on:click="go_to_goals">Metas</b-button>
          </b-col>
          <b-col cols="12">
            <b-button variant="secondary" v-on:click="go_to_cats">Categorias</b-button>
          <b-col cols="12">  
            <b-button variant="secondary" v-on:click="go_to_reg">Registros</b-button>
          </b-col>
            <b-button variant="secondary" v-on:click="logOut" id="cerrar"> Cerrar Cesión </b-button>     
          </b-col>
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
    open_bar: function () {
      this.open = true;
    },
    close_bar: function () {
      this.open = false;
    }    
  }
}
</script>

<style>
body{
  background-color: black;
  color: rgb(0, 107, 107);
  width: 99%;
}
h1{
  color: #00E8FF;
}
</style>
