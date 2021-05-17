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
        </div>
        <div class = "tarjeta">
            <div class="botones">
                <select v-model="month">
                    <option v-for="mes in meses" :key="mes"> {{mes}} </option>
                </select>
                <button v-on:click="get_regs"> Ver mis ultimos movimientos </button>
                <button id="del" v-if="selected.length" v-on:click="reg_del"> Eliminar Seleccion </button>                        
            </div>
            <h1>Mis Registros</h1>  
            <div class="tabla">
                <table border="1px">
                    <thead>
                        <tr class = "columns">                    
                            <label >
                                <input type="checkbox" v-model="selectedAll" v-on:click="select">
                            </label>
                            <th> Categoria </th>
                            <th> Descripción </th>
                            <th> Valor </th>
                            <th> Fecha </th>
                        </tr >
                    </thead>
                    <tbody>
                        <tr v-for="reg in registers" :key="reg.id"
                            v-bind:class="{ goo: reg.type == 'incomes',
                                            bad: reg.type == 'expenses',
                                            pas: reg.type == 'passives',
                                            act: reg.type == 'liabilities'

                            }">     
                            <td>
                            <label> <input type="checkbox" :value="reg.id" v-model="selected"> </label>
                            </td>               
                            <td class= "titls2">{{reg.category}}</td>                                      
                            <td class= "titls5">{{reg.description}} </td>                        
                            <td class= "titls3" >${{Number(reg.value).toLocaleString()}}</td>
                            <td class= "titls4">{{reg.date}}</td>                           
                        </tr>
                    </tbody>
                </table>
            </div>                                             
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
            id : undefined,
            month: undefined,
            meses : ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 
                    'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 
                    'Noviembre', 'Diciembre']
        };       
    },
        created: function() {
            this.username = localStorage.getItem("current_username");
            var self = this;            
            axios            
            .get("https://mybudgetback.herokuapp.com/user/cats/" + this.username)
            .then((response) => {
                self.cats = response.data;                
            })            
        },
    methods:{
        get_regs: function (){            
            
            var month_cons = this.meses.indexOf(this.month) + 1;

            var data = {
            username    : this.$route.params.username,
            month       : month_cons
            }  
            var self = this  
            axios
            .get("https://mybudgetback.herokuapp.com/user/month_records/" + data.username +"/"+ data.month)
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
            .post("https://mybudgetback.herokuapp.com/user/register/", data)
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
                .delete("https://mybudgetback.herokuapp.com/user/records/delete/", {data})
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


#del:hover{
    color: rgb(255, 8, 8);
    box-shadow: 10px 5px 20px 5px rgb(255, 2, 2);
}
.compo_transaction{
    width: 100%;
    font-family: arial;    
    display: flex;
    flex-direction: column;
    align-items:center;   
    color: rgb(255, 255, 255);
    overflow-y: scroll;
    overflow: auto;
    max-height: 85vh;           
}
.container_transaction{    
    width: 50%;
    padding: 6%;
    border: .5px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 25px rgba(0, 148, 148, 0.774);
}
.container_transaction select, input{    
    color:white;
    background-color: #000000;
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
    box-shadow: 10px 5px 20px 5px rgb(1, 41, 4);
}
.tarjeta{
    width: 90%;  
    font-size: 0.75em;        
    border:1px solid rgb(0, 107, 107);
    border-radius: 10px; 
    padding: 2px;
}
.tarjeta table{
    padding: 2px;    
    text-align: center;
    border: 0.5px rgba(1, 41, 41, 0.856);           
}
.tarjeta select{
    color:white;
    background-color: #000000;
}
.tabla{
    
}
.columns {
    color: rgb(255, 255, 255);
    padding: 5px;
    font-weight: Bold;
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
.botones{
    display: flex;
    flex-direction: row;    
}
.goo{
    color: #79FF00;
}
.bad{
    color: #FF00D5;
}
.act{
    color: #00E8FF; 
}
.pas{
    color:#FF8600;
}

@media screen and (min-width: 500px) {

#Registros{
    padding: 15px;
}
#del:hover{
    color: rgb(255, 8, 8);
    box-shadow: 10px 5px 20px 5px rgb(134, 0, 0);
}
.compo_transaction{
    font-family: arial;    
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: top;   
    color: rgb(255, 255, 255);    
}
.container_transaction{
    min-width: 150px;
    max-width: 15%;
    padding: 6%;
    border: .5px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 25px rgba(1, 41, 41, 0.774);
}
.container_transaction select, input{
    background-color: #000000;
    color: #E5E7E9;
}

.container_transaction button{
    font-family: Arial;
    color: #fff;
    background: #000000;
    border: 1px solid #E5E7E9;
    border-radius: 5px;        
    border: 1px solid rgba(1, 98, 98);
    padding: 10px 20px;
}
.container_transaction button:hover{
    color: rgb(3, 161, 161);
    box-shadow: 10px 5px 20px 5px rgb(1, 41, 4);
}
.tarjeta{
    width: 50%;
    max-width: 40%;    
}
.tarjeta table{
    padding: 2px;    
    text-align: center;
    border: 0.5px rgba(1, 41, 41, 0.856);           
}
.tabla{
    overflow-y: scroll;
    overflow: auto;
    max-height: 65vh;
}
.columns {
    color: rgb(255, 255, 255);
    padding: 5px;
    font-weight: Bold;
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
    border: 1px solid rgba(1, 98, 98);
    padding: 10px 20px;        
}
.tarjeta button:hover{
    color: rgb(3, 161, 161);
    box-shadow: 10px 5px 20px 5px rgb(1, 98, 98);
}
.botones{    
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}
.botones select{
    background-color: #000000;
    color: #E5E7E9;
    border: 1px solid rgba(1, 98, 98);
}
.goo{
    color: #79FF00;
}
.bad{
    color: #FF00D5;
}
.act{
    color: #00E8FF; 
}
.pas{
    color:#FF8600;
}

}
</style>