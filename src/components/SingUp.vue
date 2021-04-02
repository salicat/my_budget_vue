<template>
    <div id="SingUp">
        <div>
            <h1>Este es el SingUP!!!</h1>            
            <h2>Crea tu Usuario</h2>
            <form v-on:submit.prevent="user_create">
                <p>Escoge tu nombre de usuario </p>
                <input required type ="text" v-model="username" placeholder="Escribe tu usuario"/>
                <br />
                <p>Elige una contraseña </p>
                <input required type ="password" v-model="password" placeholder="Contraseña" />
                <br>
                <br>
                <button type="submit"> Registro </button>
            </form>        
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
            if(confirm("No olvides tus datos no tenemos como recuperarlos XD")){
                axios
                .post("https://mybudgetback.herokuapp.com//user/create/", data)
                .then((response) => {                                     
                    alert("usuario creado con exito")   
                    this.$router.push({name:"Login"})         
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