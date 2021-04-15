<template>
    <div id = "Registros" class="compo_transaction">
        <div class = "container_transaction">            
            <h2 class ="usuario">Registrar Transaccion</h2><br>
            <p>Selecciona:</p>
            <select v-model ="type">    
                <option value= "incomes"> Ingreso </option>
                <option value= "expenses"> Egreso </option>
                <option value= "liabilities"> Activo </option>
                <option value= "passives"> Pasivo </option>
            </select>
            <p>Selecciona la Categoria </p>            
            <select v-model="category" v-if="type === 'incomes'">
                <option  v-for="cat in cats.incomes" :key="cat.type" >
                    {{cat.category}} 
                </option>
            </select> 
            <select v-model="category" v-if="type === 'expenses'">
                <option  v-for="cat in cats.expenses" :key="cat.type" >
                    {{cat.category}} 
                </option>
            </select>
            <select v-model="category" v-if="type === 'liabilities'">
                <option  v-for="cat in cats.liabilities" :key="cat.type" >
                    {{cat.category}} 
                </option>            
            </select>   
            <select v-model="category" v-if="type === 'passives'">
                <option  v-for="cat in cats.passives" :key="cat.type" >
                    {{cat.category}} 
                </option>
            </select>             
            <p>Descripcion</p>
            <input type= "text" v-model ="descripcion"><br>

             <p>Ingresa el valor</p>
            <input type= "number" v-model ="value"><br>
            
            <button v-on:click="save_reg"> Guardar Registro </button>
            <div>
                <p>Aqui poner una torta para ver ingresos/gastos con periodos de año</p>                
            </div>      

        </div>
         <div class = "tarjeta">
            <h1>Mis Registros</h1> 
            <button id="del" v-if="selected.length" v-on:click="reg_del"> Eliminar Seleccion </button>            
            <table border="1px">
                <thead>
                    <tr class = "columns">                    
                        <label >
                            <input type="checkbox" v-model="selectedAll" v-on:click="select">
                        </label>
                        <th> Tipo </th>
                        <th> Categoria </th>
                        <th> Descripción </th>
                        <th> Valor </th>
                        <th> Fecha </th>
                    </tr >
                </thead>
                <tbody>
                    <tr v-for="reg in registers" :key="reg.id">     
                        <td>
                        <label> <input type="checkbox" :value="reg.id" v-model="selected"> </label>
                        </td>               
                        <td class= "titls1">{{reg.type}}</td>
                        <td class= "titls2">{{reg.category}}</td>                                      
                        <td class= "titls5">{{reg.description}} </td>
                        <td class= "titls3">${{reg.value}}</td>
                        <td class= "titls4">{{reg.date}}</td>                           
                    </tr>
                </tbody>
            </table>             
                <button v-on:click="get_regs"> Ver mis ultimos movimientos </button>            
        </div>
    </div> 
</template>
<script>
import axios from "axios";

export default {
    name: "Registros", 
    components: {},
    data: function (){
        return {
            username: localStorage.getItem('current_username'),
            category: "",
            type: "",
            descripcion: "",
            value: 0,
            cats: [],
            registers : [],
            selected : [], 
            selectedAll : false,
            id : undefined
        };       
    },
        created: function() {
            this.username = localStorage.getItem("current_username");
            var self = this;            
            axios            
            .get("http://localhost:8000/user/cats/" + this.username)
            .then((response) => {
                self.cats = response.data;                
            })            
        },

    methods:{
        get_regs: function (){            
            this.username = localStorage.getItem("current_username")
            var self = this  
            axios
            .get("http://localhost:8000/user/records/" + this.username)
            .then((response) => {
                self.registers = response.data
            })  
            .catch((error) => {
            alert(error + username + " ERROR en el server!")
            })      
        },
        save_reg: function () {
            var data = {
                username    : this.username,
                type        : this.type,
                category    : this.category,
                description : this.descripcion,
                value       : this.value
            }
            axios
            .post("http://localhost:8000/user/register/", data)
            .then((response) => {   
                window.location.reload();         
            })
        }, 
        select : function () {
            this.selected = [];
            if(!this.selectedAll){
                for (let i in this.registers) {
                    this.selected.push(this.registers[i].id)
                }
            }
        },
        reg_del : function () {
            var data = {
                username : this.username,
                id : this.selected
            }
            var self = this;
            if(confirm("Eliminar registros afectara otros datos en la aplicación")){
                axios
                .delete("http://localhost:8000/user/records/delete/", {data})
                .then((response) => {
                    alert("Regristos borrados " + response.data)
                    window.location.reload()
            })
            }            
        },       
    }        
}

</script>
<style>
#Registros{
    padding: 15px;
}
#del:hover{
    color: rgb(255, 8, 8);
    box-shadow: 10px 5px 20px 5px rgb(255, 2, 2);
}
.compo_transaction{
    font-family: arial;    
    display: flex;
    justify-content: space-around;
    align-items: center;   
    background: rgb(0, 0, 0);
    color: rgb(255, 255, 255);
}
.container_transaction{
    min-width: 150px;
    max-width: 30%;
    padding: 6%;
    border: .5px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.1);
    box-shadow: 0 10px 25px rgba(1, 41, 41, 0.431);
}
.container_transaction button{
    font-family: Arial;
    color: #fff;
    background: #000000;
    border: 1px solid #E5E7E9;
    border-radius: 5px;
    padding: 10px 20px;
}
.container_transaction button:hover{
    color: rgb(1, 41, 41);
    box-shadow: 10px 5px 20px 5px rgb(1, 41, 41);
}
.tarjeta{
    min-width: 150px;
    max-width: 40%;
}
.tarjeta table{
    padding: 2px;
    text-align: center;
    border: 0.5px rgba(1, 41, 41, 0.856)
}
.columns {
    color: rgb(0, 107, 107);
    padding: 5px;
}
.titls1{
    font-weight: 100;
    text-align: left;
    padding: 4px ;
}
.titls2{
    font-weight: 100;
    text-align: left;
    padding: 4px ;
}
.titls3{
    font-weight: 100;
    text-align: right;
    padding: 4px ;
}
.titls4{
    font-weight: 100;
    padding: 4px ;
}


.tarjeta button{
    font-family: Arial;
    color: #fff;
    background: #000000;
    border: 1px solid #E5E7E9;
    border-radius: 5px;
    padding: 10px 20px;    
}
.tarjeta button:hover{
    color: rgb(1, 41, 41);
    box-shadow: 10px 5px 20px 5px rgb(1, 41, 41);    
}

</style>