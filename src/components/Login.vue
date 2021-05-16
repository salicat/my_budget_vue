<template>
  <div id = "Login" >
    <div class="auth_user">
      <div class="bienvenida">
        <h1> Bienvenido a <span id="app"> My Budget!! </span> </h1> 
      </div>
      <div class="ingresa">
        <p> Ingresa o crea tu usuario </p> 
      </div>
      <div class = "container_auth_user">
        <p>Ingresar</p>
        <form v-on:submit.prevent="processAuthUser">
          <input type ="text" v-model="user_in.username" placeholder="Usuario" />
          <br />
          <input type ="password" v-model="user_in.password" placeholder="Contraseña" />
          <br />
          <button type="submit"> Iniciar Sesión </button>
        </form>
        <button v-on:click="to_singup"> Crea tu usuario </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Login',
  data: function() {
    return {
      user_in: {
        username:"",
        password:""
      },
    };
  },  
  
  methods: {
    processAuthUser : function () {
      var self = this;
      axios
      .post("https://mybudgetback.herokuapp.com/user/auth/", self.user_in, { headers: {} })
      .then ((response) => {
        alert("Bienvendo " + self.user_in.username);
        self.$emit("log-in", self.user_in.username)        
      })
      .catch((error) => {
        if (error.response.status == "404")
          alert("ERROR 404: Usuario no encontrado");
        if (error.response.status == "403")
          alert("ERROR 403 Contraseña errada")
      })
    },
    to_singup : function (){           
      if (this.$route.name != "SingUp"){
        this.$router.push({name:"SingUp"})        
      }
    } 


  }
}
</script>

<style>

.auth_user{
  display:flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  padding: 3%;
  margin-left: 35%;
}
.bienvenida{
  font-family:Arial, Helvetica, sans-serif;
  color: white;
}
.ingresa{
  color: white;
}
#app{
  font-family: Tahoma; 
  color:darkturquoise
}
.container_auth_user{
    max-width: 190px;
    max-height: 250px;
    border: 1px solid #3b3b3b;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50%;
    border-radius: 10px;    
    box-shadow: 10px 10px 45px 5px rgb(0, 107, 107);
  }
.auth_user h2{
    color: #ffffff;
}
.auth_user form{
    width:60%;    
}
.auth_user input{
    height: 40px;
    width: 100%;
    box-sizing: border-box;
    padding: 10px 20px;
    margin: 5px 0;
    border: 1px solid #383747;
    background-color: #181818;
    color: #a0a0a0;    
}
.auth_user button{
    width: 100%;
    height: 40px;
    color: #818181;
    background: #000000;
    border-radius: 12px;
    padding: 10 px 25px;
    margin:5px 0;
    border: 1px solid rgba(1, 98, 98);
}
.auth_user button:hover{
    color: rgb(3, 161, 161);
    box-shadow: 10px 5px 20px 5px rgb(1, 41, 4);    
}
</style>