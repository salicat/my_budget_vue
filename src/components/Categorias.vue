<template> 
    <div id="Categorias">
        <div class="cats">            
            <div class="new_cat">
                <h2>Tus categorias</h2>  
                <select id="" v-model="action">
                    <option value="" selected disabled> Selecciona </option>
                    <option value="crear"> Crear Categoria </option>
                    <option value="eliminar"> Eliminar Categoria </option>
                </select>
                <div v-if="action ==='crear'">
                    <div class = "crear_categorias">
                        <p> Nombra tu categoria </p>
                        <input type="text" v-model="category">
                        <p> Elige un tipo de categoria </p>
                        <select v-model="type">
                            <option value="incomes"> Ingresos </option>
                            <option value="expenses"> Egresos </option>
                            <option value="liabilities"> Activos </option>
                            <option value="passives"> Pasivos </option>
                        </select>
                        <div v-if="type == 'liabilities' || type ==  'passives'">
                            <p> Valor Actual :</p>
                            <input type="text" v-model="value">
                        </div> <br>
                        <div v-if="type == 'incomes'">
                            <p> Meta mensual :</p>
                            <input type="text" v-model="budget">
                        </div> <br>
                        <div v-if="type == 'expenses'">
                            <p> Presupuesto mensual:</p>
                            <input type="text" v-model="budget">
                            <p> Este gasto lo haces cada mes?</p>
                            <input type="checkbox" v-model="recurrency"  v-on:click="recurrency = true">                            
                        </div> <br>
                        <div v-if="recurrency == true">
                            <p> Elige la fecha del proximo vencimiento</p>
                            <input type="date" id="start" name="trip-start" value="2018-07-22"
                                    min="2000-03-12" max="2040-12-31" v-model="day"> <br>
                        </div>
                        <button v-on:click="cat_create"> Crear Categoria</button>
                    </div>                    
                </div>               
                <div v-if="action ==='eliminar'">
                    <div class="del_cat">
                        <p> Elige la categoria que deseas eliminar </p>
                        <select v-model ="type">    
                            <option value= "incomes"> Ingreso </option>
                            <option value= "expenses"> Egreso </option>
                            <option value= "liabilities"> Activo </option>
                            <option value= "passives"> Pasivo </option>
                        </select><br>                    
                        <select v-model="category" v-if="type === 'incomes'">
                            <option  v-for="cat in cats.incomes" :key="cat.type" >
                                {{cat.category}} 
                            </option>
                        </select><br> 
                        <select v-model="category" v-if="type === 'expenses'">
                            <option  v-for="cat in cats.expenses" :key="cat.type" >
                                {{cat.category}} 
                            </option>
                        </select><br>
                        <select v-model="category" v-if="type === 'liabilities'">
                            <option  v-for="cat in cats.liabilities" :key="cat.type" >
                                {{cat.category}} 
                            </option>            
                        </select><br>   
                        <select v-model="category" v-if="type === 'passives'">
                            <option  v-for="cat in cats.passives" :key="cat.type" >
                                {{cat.category}} 
                            </option>
                        </select><br>                        
                        <button v-on:click="delete_cat"> Eliminar </button>
                    </div>
                </div>                
            </div>
            <div class = "ing_egr">        
                <div class ="ingresos">
                    <h1 class="goo"> Ingresos </h1>
                    <h2 class="goo"> ${{Number(t_in).toLocaleString()}} </h2>
                    <table border="1px">
                        <tr class = "columnas">
                            <th>  </th>                            
                            <th> Meta mensual</th>
                        </tr>
                        <tr v-for="cat in cats.incomes" :key="cat.category">                    
                            <td class="titulos"> {{cat.category}} </td> 
                            <td class="goo"> ${{cat.budget}} </td>                                                
                        </tr>
                    </table>                                                                                    
                </div>
                <div class ="egresos">
                    <h1 class="bad"> Egresos </h1>                
                    <h2 class="bad"> ${{Number(t_bud).toLocaleString()}} </h2>
                    <table border="1px" class="tab_egresos">
                        <tr class = "columnas">
                            <th>  </th>
                            <th> Presupuesto </th>
                            <th> Prox Vencimiento </th>
                        <tr>                           
                        <tr v-for="cat in cats.expenses" :key="cat.category">                    
                            <td class="titulos"> {{cat.category}} </td> 
                            <!-- <td v-bind:class="{alert: cat.value > cat.budget}"> ${{cat.value}}</td> -->
                            <td class="bad"> ${{Number(cat.budget).toLocaleString()}} </td>
                            <td v-if="cat.recurrency==true" class="titulos"> {{cat.day}}</td>                                          
                        </tr>                    
                    </table>
                </div>                                                          
            </div>            
            <div class="assets">
                <div class ="activos">
                    <h1 class="act"> Activos </h1>
                    <h2 class="act"> ${{Number(t_lia).toLocaleString()}} </h2>
                    <table border="1px">
                        <tr class = "columnas">
                            <td> </td>
                            <td> Valor </td>
                        </tr>
                        <tr v-for="cat in cats.liabilities" :key="cat.category">                    
                            <th class="titulos"> {{cat.category}} </th> 
                            <th class="act"> ${{Number(cat.value).toLocaleString()}} </th>
                        </tr>                    
                    </table>
                </div>            
                <div class ="pasivos">
                    <h1 class="pas"> Pasivos </h1>
                    <h2 class="pas"> ${{Number(t_pass).toLocaleString()}} </h2>
                    <table border="1px">
                        <tr class = "columnas">
                            <td> </td>
                            <td> Valor </td>
                        </tr>
                        <tr v-for="cat in cats.passives" :key="cat.category">                    
                            <th class="titulos"> {{cat.category}} </th> 
                            <th class="pas"> ${{Number(cat.value).toLocaleString()}} </th>
                        </tr>                    
                    </table>
                </div>
            </div>            
        </div>  
</div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Categorias',    
    data: function (){
        return {
            username : localStorage.getItem("current_username"),
            type        : "",
            category    : "",
            description : "",
            value       : 0,
            budget      : 0,
            recurrency  : false,
            day         : 0,            
            cats        : [],
            action      : undefined,
            t_bud: 0,
            t_in: 0,
            t_lia: 0,
            t_pass: 0
        }
    },    
    created: function(){
        this.username = this.$route.params.username
        let self = this        
        axios
        .get("https://mybudgetback.herokuapp.com/user/cats/" + this.username)
        .then((result) => {
            self.cats = result.data;
            for (var i= 0; i < result.data.incomes.length; i++){
                this.t_in = this.t_in + result.data.incomes[i].budget;
            }
            for (var j = 0; j < result.data.expenses.length; j++) {
                this.t_bud = this.t_bud + result.data.expenses[j].budget;
            } 
            for ( var k = 0; k < result.data.liabilities.length; k++) {
                this.t_lia = this.t_lia + result.data.liabilities[k].value;
            }
            for ( var l = 0; l < result.data.passives.length; l++) {
                this.t_pass = this.t_pass + result.data.passives[l].value;
            }

        })
    },    
    methods : {
        cat_create: function () {
            var data = {
                type        : this.type,
                category    : this.category,
                username    : this.$route.params.username,                
                value       : this.value,  
                budget      : this.budget,
                recurrency  : this.recurrency,
                day         : this.day          
                }        
            let self = this
            axios
            .post("https://mybudgetback.herokuapp.com/user/create/category/", data)
            .then((response) => {
                alert(response.data.message) 
                window.location.reload();                               
            })
            .catch((error) =>{
                alert(error.response.data)
                console.log(error.response.data)                                                             
            })
        },
        delete_cat : function () {
            var data = {
                category : this.category,
                type : this.type,
                username : this.username
            }
            let self = this
            if(confirm("Se eliminará la categoria " + this.category)){
                axios
                .delete("https://mybudgetback.herokuapp.com/user/delete/category/", {data})
                .then((response) => {
                    alert(response.data.message)
                    window.location.reload();
                })
                .catch((error) =>{
                    alert(data.category + data.username + data.type)
                })
            }

        }
    }
    
}
</script>
<style>

.cats{
    overflow-y: scroll;
    overflow: auto;
    max-height: 85vh; 
}
.new_cat{
    width:15%;
    padding: 10px;    
    font-family: arial;
}
.ing_egr table{
    padding: 2px;
    width: 20%;
    text-align: center;
    border: 0.5px rgba(1, 41, 41, 0.856);    
}
.columnas {
    color: rgb(0, 107, 107);
    padding: 5px;
}
.titulos{
    color: rgb(0, 107, 107);
    font-weight: 100;
    text-align: left;
    padding: 4px ;
}
.ing_egr{
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: space-around;
}
.ingresos{
    width: 80%;
    font-family: arial;
    border:1px solid rgb(0, 107, 107);
    border-radius: 10px;
    padding: 10px; 
    overflow:hidden   
}
.ingresos table{
    width: 100%;
}
.egresos{
    margin-top: 20px;    
    width: 80%;
    font-family: arial;
    border:1px solid rgb(0, 107, 107);
    border-radius: 10px;
    padding: 10px;    
    overflow-y: scroll;
    overflow: auto;
    max-height: 40vh; 
    padding-bottom: 30px;  
}
.egresos th{    
    text-align: left;
}
.assets{
    display: flex;
    flex-direction: row;
    width: 95%;
    padding-bottom: 30px;  
}
.assets table {
    padding: 2px;
    width: 20%;
    text-align: center;
    border: 0.5px rgba(1, 41, 41, 0.856);
}
.activos{    
    margin-top: 20px;       
    font-family: arial;
    font-size: 0.85em;
    border:1px solid rgb(0, 107, 107);
    border-radius: 10px;
    padding: 10px;    
}
.activos th{
    text-align: left;
}
.activos table{
    width:100%;
}
.pasivos{    
    margin-top: 20px;   
    width: 40%;
    font-family: arial;
    font-size: 0.85em;
    border:1px solid rgb(0, 107, 107);
    border-radius: 10px;
    padding: 10px; 
}
.pasivos th{
    text-align: left;    
}
.pasivos table{
    width:100%;
}
.crear_categorias button{
    font-family: Arial;
    color: #fff;
    background: #000000;
    border: 1px solid #E5E7E9;
    border-radius: 5px;
    margin: 10px;
    padding: 10px 20px;
}
.barras{
    border-radius: 10px;
    padding: 10px;
    width: 35%;
}
.lineas{
    border-radius: 10px;
    padding: 10px;
    width: 35%;
}
.del_cat button{
    font-family: Arial;
    color: #fff;
    background: #000000;
    border: 1px solid #E5E7E9;
    border-radius: 5px;
    margin: 10px;
    padding: 10px 20px;
}
.del_cat button:hover{
    color: rgb(255, 8, 8);
    box-shadow: 10px 5px 20px 5px rgb(255, 2, 2);
}
.val{
    text-align: right;
}
table .act{
    text-align: right;
}
table .pas{
    text-align: right;
}
.warning{
    color: #9e8e01;
}
.tab_egresos{
    overflow-y: scroll;
    overflow: auto;
    max-height: 50vh;
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
.cats{
    display: flex;
    flex-direction: row;            
}
.new_cat{
    width:20%;
    padding: 5px;    
    font-family: arial;
}
.new_cat button:hover{
    color: rgb(1, 41, 41);
    box-shadow: 10px 5px 20px 10px rgb(1, 41, 41);
}
.new_cat select, input {
    color:#E5E7E9;
    background-color:#000000;
}
.crear_categorias{
    width: 95%;    
    display: flex;   
    flex-direction: column;
}
.crear_categorias input{
    width: 95%;
}
.modificar{    
    width: 95%;        
    display: flex;   
    flex-direction: column;
}
.modificar button{
    font-family: Arial;
    color: #fff;
    background: #000000;
    border: 1px solid #E5E7E9;
    border-radius: 5px;
    margin: 10px;
    padding: 10px 20px;
} 
.del_cat{    
    width: 95%;        
    display: flex;   
    flex-direction: column;
}
.crear_categorias button{
    font-family: Arial;
    color: #fff;
    background: #000000;
    border: 1px solid #E5E7E9;
    border-radius: 5px;
    margin: 10px;
    padding: 10px 20px;    
}
.del_cat button{
    font-family: Arial;
    color: #fff;
    background: #000000;
    border: 1px solid #E5E7E9;
    border-radius: 5px;
    margin: 10px;
    padding: 10px 20px;
}
.del_cat button:hover{
    color: rgb(255, 8, 8);
    box-shadow: 10px 5px 20px 5px rgb(255, 2, 2);
}
.ing_egr table{    
    padding: 2px;
    width: 80%;
    text-align: center;
    border: 0.5px rgba(1, 41, 41, 0.856);    
}
.columnas {
    color: rgb(0, 107, 107);
    padding: 5px;
}
.titulos{
    color: rgb(0, 107, 107);
    font-weight: 100;
    text-align: left;
    padding: 4px ;
}
.ing_egr{
    display: flex;
    flex-direction: column;
    width: 45%;
}
.ingresos{     
    font-size: 1em;  
    width: 90%;
    font-family: arial;
    border:1px solid rgb(0, 107, 107);
    border-radius: 10px;
    overflow-y: scroll;
    overflow: auto;
    max-height: 40vh;  
    display: flex;
    flex-direction: column;
    justify-items: center;   
}
.ingresos table{
    width: 100%;
}
.egresos{
    font-size: 1em;
    width: 90%;
    font-family: arial;
    border:1px solid rgb(0, 107, 107);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-items: center;        
}
.egresos th{    
    text-align: left;
}
.egresos table{
    width:100%;
}
.assets{
    display: flex;
    flex-direction: column;
    width: 40%;
    padding-bottom: 2em;
}
.assets table {
    padding: 2px;
    width: 90%;
    text-align: center;
    border: 0.5px rgba(1, 41, 41, 0.856);
}
.activos{        
    font-size: 1em;
    margin-top: 0px;   
    width: 90%;
    font-family: arial;
    border:1px solid rgb(0, 107, 107);
    border-radius: 10px;
}
.activos th{
    text-align: left;
}
.activos table{    
    width:100%;
}
.pasivos{    
    font-size: 1em;
    width: 90%;
    font-family: arial;
    border:1px solid rgb(0, 107, 107);
    border-radius: 10px;     
}
.pasivos th{
    text-align: left;    
}
.pasivos table{    
    width:100%;
}
.val{
    text-align: right;
}
table .act{
    text-align: right;
}
table .pas{
    text-align: right;
}
.warning{
    color: #9e8e01;
}
.tab_egresos{
    overflow-y: scroll;
    overflow: auto;
    max-height: 50vh;
}
}
</style>