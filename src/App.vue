<template>
  <div id = "app" >
    <div class = "top_right_vigneta" v-if="is_auth">
      <h2>{{username}}</h2>    
      </div>
    <div  class = "sidebar" v-if="is_auth"
          v-bind:class="[open ? 'sidebar_on' : 'sidebar']"
          >       
      <nav>  
        <button id="none" v-on:click="close_bar">X </button>
        <h2>Menú</h2 >
        <button v-on:click="go_to_resumen">Resumen</button>
        <button v-on:click="go_to_goals">Metas</button>
        <button v-on:click="go_to_cats">Categorias</button>
        <button v-on:click="go_to_reg">Registros</button>
        <button v-on:click="logOut" id="cerrar"> Cerrar Cesión </button>       
      </nav>
    </div>
    <div id="main" v-if="is_auth">
      <button class="openbtn" v-on:click="open_bar" v-if="!open"> ☰ </button>
    </div>
    <div v-bind:class="[!open ? 'main-component_2' : 'main-component' ]">  
      <router-view v-on:log-in="logIn"> </router-view>
    </div>        
  </div>
</template>

<script>
import vueRouter from 'vue-router'

export default {
    name: 'App',    
    components: {},
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
  color:#fff;
}
.sidebar {
  position: absolute;
  left: 0%;
  top: 5%;  
  width: 15%;
  width: 0;
  position: fixed;
  z-index: 1;
  height: 50%;
  overflow-x: hidden;
  transition: 0.5s;  
}
.sidebar {
    position: absolute;
    left: 0%;
    top: 5%;  
    width: 15%;
    width: 0;
    position: fixed;
    z-index: 1;
    background-color: #000000 ;
    color:#fff ;
    background-color: rgba(0, 0, 0, 0.85);
    display: flex;
    border-radius: 0px 10px 10px 0px;
    box-shadow: 10px 5px 20px 5px rgb(1, 41, 41);        
    height: 50%;
    transition: 0.5s;  
  }
  #none{
    border: none;
  }
  #none :hover{
    box-shadow: 10px 5px 20px 5px rgb(255, 9, 9);
  }
  .sidebar_on {
    position: absolute;
    left: 0%;
    top: 5%;  
    width: 30%;
    max-width: 150px;
    min-height: 400px;
    background-color: #000000 ;
    color:#fff ;
    background-color: rgba(0, 0, 0, 0.85);
    display: flex;
    border-radius: 0px 10px 10px 0px;
    box-shadow: 10px 5px 20px 5px rgb(1, 41, 41);    
    transition: 0.5s;
  }
  .sidebar .closebtn {
    position: absolute;
    top: 0;
    right: 25px;
    font-size: 36px;
    margin-left: 50px;
  }
  .openbtn {
    font-size: 20px;
    background-color: #111;
    color: white;
    padding: 10px 15px;
    border: none;
  }
  .sidebar nav{
    font-family: Arial;
    display: flex;
    padding: 5%;
    flex-direction: column;
    justify-content:space-evenly;
  }
  .sidebar nav button{ 
    font-family: Arial;
    color: #fff;
    background: #000000;
    border: 1px solid #E5E7E9;
    border-radius: 5px;
    border: 1px solid rgba(1, 98, 98);    
    padding: 10px 20px;
  }
 
  .top_right_vigneta{
    padding: 5px;  
    position: fixed;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: row;
    align-content: space-around;
    border-radius: 0px 0px 0px 10px;
    box-shadow: -10px 10px 20px 5px rgb(1, 41, 41);  
  }
  .top_right_vigneta h2{
    font-family: Arial;
    text-align: center;
    width: 80%;
  }
  .main-component{
    position: fixed;
    top: 100px;
    left: 280px;
    width: 75%;
    height: 86%;
    padding: 10px;  
    background-color: #000000;
    transition: 0.5s;  
  }
  .main-component_2{
    position: fixed;
    top: 100px;
    left: 20px;
    width: 98%;
    height: 86%;
    transition: 0.5s;      
  }


@media screen and (min-width: 700px) {
  body{
    background-color: black;
    color:#fff;    
  }
  .sidebar {
    position: absolute;
    left: 0%;
    top: 5%;  
    width: 15%;
    width: 0;
    position: fixed;
    z-index: 1;
    height: 50%;
    overflow-x: hidden;
    transition: 0.5s;  
  }
  .sidebar nav button{
    font-family: Arial;
    color: #fff;
    background: #000000;
    border: 1px solid rgba(1, 98, 98);
    border-radius: 5px;
    padding: 10px 20px;
  }
  .sidebar nav button:hover{
    color: rgb(3, 161, 161);
    box-shadow: 10px 5px 20px 5px rgb(1, 41, 4);
  }  
  .sidebar_on {
    position: absolute;
    left: 0%;
    top: 5%;  
    width: 15%;
    max-width: 150px;
    min-height: 400px;
    background-color: #000000 ;
    color:#fff ;
    background-color: rgba(0, 0, 0, 0.85);
    display: flex;
    border-radius: 0px 10px 10px 0px;
    box-shadow: 10px 5px 20px 5px rgb(1, 41, 41);
  }
  .sidebar .closebtn {
    position: absolute;
    top: 0;
    right: 25px;
    font-size: 36px;
    margin-left: 50px;
  }
  .openbtn {
    font-size: 20px;
    cursor: pointer;
    background-color: #111;
    color: white;
    padding: 10px 15px;
    border: none;
  }
  .openbtn:hover {
    box-shadow: 10px 5px 20px 5px rgb(1, 41, 41);
  }
  .sidebar nav{
    font-family: Arial;
    display: flex;
    padding: 5%;
    flex-direction: column;
    justify-content:space-evenly;
  }  
  .top_right_vigneta{
    padding: 5px;  
    position: fixed;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: row;
    align-content: space-around;
    border-radius: 0px 0px 0px 10px;
    box-shadow: -10px 10px 20px 5px rgb(1, 41, 41);  
  }
  .top_right_vigneta h2{
    font-family: Arial;
    text-align: center;
    width: 80%;
  }
  .main-component{
    position: fixed;
    top: 100px;
    left: 180px;
    width: 85%;
    height: 86%;
    padding: 10px;  
    background-color: #000000;
    transition: 0.5s;  
  }
  .main-component_2{
    position: fixed;
    top: 100px;
    left: 0px;
    width: 100%;
    height: 86%;
    padding: 10px;
    transition: 0.5s;      
  }
  .cerrar button:hover{
    box-shadow: -10px 10px 20px 5px rgb(255, 0, 212); 
    color: red;
  }
}
</style>
