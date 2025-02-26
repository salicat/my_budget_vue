<template>
  <b-container fluid>
    <b-row>
        <b-col cols="10" md="10" class="mx-auto"> 
          <h1 style="text-align:center;"> Bienvenido a My Budget!!</h1>
        </b-col>
        <b-col cols="2" md="4"></b-col>
        <b-col cols="8" md="4" class="vh-100 text-center" align-v="center">
            <b-col>
              <p> Ingresa o crea tu usuario </p> 
            </b-col>
            <b-col cols="11" style="border-radius: 10px;
                            height: 50vh;
                            margin: 1%;  
                            padding: 1%;
                            justify-content: center; 
                            font-size: 1.5em;
                            border:1px solid rgb(0, 107, 107); 
                            box-shadow: 0 5px 15px rgba(0, 148, 148, 0.774);">
              
              <div style="margin-top:5%;">
                <p>Ingresar</p>
              </div>
              <div >
                <input class="input" type ="text" v-model="user_in.username" placeholder="Usuario"/>
              </div>
              <div>
                <input class="input" type ="password" v-model="user_in.password" placeholder="Contraseña" />
              </div>
                <button class="input" v-on:click="processAuthUser"> Iniciar Sesión </button>
            </b-col>
            <b-col cols="11" style="justify-items: center;">
              <button class="input" v-on:click="to_singup"> Crea tu usuario </button>
            </b-col>
          </b-col>
        <b-col cols="2" md="4"></b-col>
    </b-row>
  </b-container>
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
      console.log("autenticando...")
      axios
      .post("http://localhost:8000/user/auth/", self.user_in, { headers: {} })
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

