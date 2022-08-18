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
            if(confirm("No olvides tus datos no tenemos como recuperarlos XD")){
                axios
                .post("https://mybudgetback.herokuapp.com/user/create/", data)
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
<style>
#SingUp{
    height: 80%;
    width: 95%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.crea_user{
    padding: 2%;
    display: flex;
    flex-direction: column;
    max-width: 290px;
    max-height: 600px;    
    align-items: center;
    border-radius: 10px;    
    box-shadow: 10px 10px 45px 5px rgb(107, 70, 0);
}
.crea_user form{
    width: 90%;
}
.crea_user input{
    height: 40px;
    width: 90%;
    box-sizing: border-box;
    padding: 10px 20px;
    margin: 5px 0;
    border: 1px solid #383747;
    background-color: #181818;
    color: #a0a0a0;    
}
.crea_user button{
    height: 40px;
    width: 40%;
    color: #ffffff;
    background: #000000;
    border-radius: 12px;
    padding: 10 px 25px;
    margin:5px 0;
    border: 1px solid rgba(1, 98, 98);
}
.crea_user button:hover{
    color: rgb(106, 173, 4);
    box-shadow: 5px 5px 15px 5px rgb(7, 107, 0);
}
.back{
    color: rgb(255, 255, 255);
}

</style>
