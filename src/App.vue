<template>
  <div id = "app" >
    <div class = "top_right_vigneta" v-if="is_auth">
      <h2>{{username}}</h2>    
      </div>
    <div class = "sidebar" v-if="is_auth"> 
      <nav>  
        <h2>Menú</h2 >
        <button v-on:click="go_to_resumen">Resumen</button>
        <button v-on:click="go_to_goals">Metas</button>
        <button v-on:click="go_to_cats">Categorias</button>
        <button v-on:click="go_to_reg">Registros</button>
        <button v-on:click="logOut"> Cerrar Cesión </button>       
      </nav>
    </div>
    <div class = "main-component">  
      <router-view v-on:log-in="logIn"> </router-view>
    </div>    
    <div class = "footer" v-on:click="logOut">
      <p> Este es el footer </p>         
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
              username: localStorage.getItem("current_username")
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
      }
    },
    go_to_reg: function () {
      if (this.$route.name != "Registros"){
        let username = localStorage.getItem("current_username")
        this.$router.push({name: "Registros", params: {username: username}});
      }
    },
    go_to_resumen: function () {
      if (this.$route.name != "Resumen") {
      let username = localStorage.getItem("current_username")
      this.$router.push({name: "Resumen", params: {username: username}});        
      }
    },
    go_to_cats: function () {
      if (this.$route.name != "Categorias") {
      let username = localStorage.getItem("current_username")
      this.$router.push({name: "Categorias", params: {username: username}});                
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
    }
  }
}

</script>

<style>
body{
  background-color: black;
  color:#fff;
}
.sidebar{
  position: absolute;
  left: 0%;
  top: 10%;  
  width: 15%;
  max-width: 150px;
  min-height: 400px;
  background-color: #000000 ;
  color:#fff ;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content:space-around;
  border-radius: 0px 10px 10px 0px;
  box-shadow: 10px 5px 20px 5px rgb(1, 41, 41);
}
.sidebar nav{
  font-family: Arial;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
}
.sidebar nav button{
  font-family: Arial;
  color: #fff;
  background: #000000;
  border: 1px solid #E5E7E9;
  border-radius: 5px;
  padding: 10px 20px;
}
.sidebar nav button:hover{
  color: rgb(1, 41, 41);
  box-shadow: 10px 5px 20px 5px rgb(1, 41, 41);
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
  background-image: url("https://i.pinimg.com/originals/58/8c/4b/588c4ba75cbd6dd9fe3c5bfafaaccdea.jpg");  
}
.footer{
  width: 100%;
  height: 5%;
  position: absolute;
  bottom: 0%;
  left: 0%;
  min-height: 100px;  
  color:#E5E7E9;
  display: flex;
  justify-content:flex-end;
  align-items: center;
  background: #000000;
  box-shadow: 0px -5px 20px 5px rgb(1, 41, 41);
}
.top_right_vigneta button{
  font-family: Arial;
  max-height: 50%;
  color: #fff;
  background: #000000;
  border: 1px solid #E5E7E9;
  border-radius: 5px;
  padding: 10px 20px;
}
.top_right_vigneta button:hover{
  color: rgb(255, 0, 76);
  box-shadow: 10px 5px 20px 5px rgba(255, 2, 99, 0.452);  
}
</style>
