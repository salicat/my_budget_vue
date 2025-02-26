<template>
    <div id="SingUp">
        <div class="crea_user">
            <h2>Crea tu Usuario</h2>
            <form v-on:submit.prevent="user_create">  
                <p>Escoge tu nombre de usuario </p>
                <input required type ="text" v-model="username" placeholder="Escribe tu usuario"/>
                <p>Elige una contraseña </p>
                <input required type ="password" v-model="password" placeholder="Contraseña" />
                <br>
                <button type="submit"> Registro </button>
            </form>        
        </div>
        <div>
            <p class="back"> <router-link :to="{ name: 'Login' }">Regresa al login</router-link> </p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'SingUp',
    components: {},
    data: function(){
        return {
            username : "",
            password : ""           
        };
    },           
    methods : {
        user_create: function () {
            var data = {
                username : this.username,
                password : this.password 
            }
            const url = window.location.hostname.includes("localhost") 
            ? "http://localhost:8000" 
            : "https://my-budget-back.onrender.com";


            if(confirm("No olvides tus datos no tenemos como recuperarlos XD")){
                axios
                .post(`${url}/user/create/`, data)
                .then((response) => {                                     
                    alert("usuario creado con exito")   
                    this.$router.push({name:"root"})                             
                })
                .catch((error) => {
                    if (error.response.status =="403")
                        alert("El nombre de usuario ya existe")                        
                   })            
            }    
        },


    }
}
    
</script>
