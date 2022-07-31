<template> 
    <b-container fluid> 
        <b-row align-h="between">
            <b-col cols="11" sm="3" class="mx-auto" style="border-radius: 10px;
                                            margin-top: 3%;  
                                            padding: 3%; 
                                            border:1px solid rgb(0, 107, 107);">
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
            </b-col>
            <b-col cols="11" class="mx-auto" sm="4">
                <div class = "ing_egr" style="border-radius: 10px;
                                            margin-top: 3%;  
                                            padding: 3%; 
                                            border:1px solid rgb(0, 107, 107);" >
                        <h1 class="goo"> Ingresos </h1>
                        <h2 class="goo"> ${{Number(t_in).toLocaleString()}} </h2>
                        <table >
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
                    <div class ="egresos" style="border-radius: 10px;
                                            margin-top: 3%;  
                                            padding: 3%; 
                                            border:1px solid rgb(0, 107, 107);">
                        <h1 class="bad"> Egresos </h1>                
                        <h2 class="bad"> ${{Number(t_bud).toLocaleString()}} </h2>
                        <table class="tab_egresos">
                            <tr class = "columnas">
                                <th>  </th>
                                <th> Presupuesto </th>
                            <tr>                           
                            <tr v-for="cat in cats.expenses" :key="cat.category">                    
                                <td class="titulos"> {{cat.category}} </td> 
                                <!-- <td v-bind:class="{alert: cat.value > cat.budget}"> ${{cat.value}}</td> -->
                                <td class="bad"> ${{Number(cat.budget).toLocaleString()}} </td>                                          
                            </tr>                    
                        </table>
                    </div>                                                        
            </b-col>
            <b-col cols="11" sm="4">
                    <div class ="activos" style="border-radius: 10px;
                                            margin-top: 3%;  
                                            padding: 3%; 
                                            border:1px solid rgb(0, 107, 107);">
                        <h1 class="act"> Activos ${{Number(t_lia).toLocaleString()}} </h1>
                        <table>
                            <thead>
                                <tr class = "columnas">
                                    <td> </td>
                                    <td> Valor </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="cat in cats.liabilities" :key="cat.category">                    
                                    <th class="titulos"> {{cat.category}} </th> 
                                    <th class="act"> ${{Number(cat.value).toLocaleString()}} </th>
                                </tr>
                            </tbody>                    
                        </table>
                    </div>            
                    <div class ="pasivos" style="border-radius: 10px;
                                            margin-top: 3%;  
                                            padding: 3%; 
                                            border:1px solid rgb(0, 107, 107);">
                        
                        <h1 class="pas"> Pasivos ${{Number(t_pass).toLocaleString()}} </h1>
                        <table>
                            <thead>
                                <tr class = "columnas">
                                    <td> </td>
                                    <td> Valor </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="cat in cats.passives" :key="cat.category">                    
                                    <th class="titulos"> {{cat.category}} </th> 
                                    <th class="pas"> ${{Number(cat.value).toLocaleString()}} </th>
                                </tr>                    
                            </tbody>
                        </table>
                    </div> 
            </b-col>
        </b-row>
        <b-row>
            <b-col cols="12" mx-class="auto" style="border-radius: 10px;  
                                            margin-top: 5%;
                                            padding: 3%;
                                            border:1px solid rgb(0, 107, 107); 
                                            box-shadow: 0 10px 25px rgba(0, 148, 148, 0.774);">
                <div>
                    <h1 class="act">Alertas:</h1>
                    <h2 v-if="t_pass < t_lia && t_bud < t_in" class="act"> Tus finanzas lucen saludables</h2>
                    <h2 v-if="t_pass > t_lia" class="bad"> Tus Pasivos son mayores que tus activos</h2>
                    <h2 v-if="t_bud > t_in " class="bad"> Tus egresos exceden tus ingresos </h2>
                </div>
            </b-col>
        </b-row>
    </b-container>
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
            axios
            .delete("https://mybudgetback.herokuapp.com/user/delete/category/", {data})
            .then((response) => {
                alert(response.data.message); 
                window.location.reload();
            })
            .catch((error) =>{
                alert(data.category + data.username + data.type)
            })
        }
    }
    
}
</script>
<style>
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
.titulos{
    font-weight: bold;
}
td:nth-child(2){
    text-align: right;
}
table{
    justify-content: space-between;
}


</style>