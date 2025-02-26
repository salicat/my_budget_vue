<template> 
    <b-container fluid> 
        <b-row>
            <b-col cols="12" mx-class="auto" style="border-radius: 10px;  
                                            margin-top: 5%;
                                            margin-bottom: 5%;
                                            padding: 3%;
                                            border:1px solid rgb(0, 107, 107);">
                <div>
                    <h1 class="act">Alertas:</h1>
                    <h2 v-if="t_bud < t_in" class="act"> Tus finanzas lucen saludables</h2>
                    <h2 v-if="t_pass > t_lia" class="bad"> Tus Pasivos son mayores que tus activos en ${{Number(t_pass-t_lia).toLocaleString()}}</h2>
                    <h2 v-if="t_bud > t_in " class="bad"> Tus egresos exceden tus ingresos en ${{Number(t_bud - t_in).toLocaleString()}}</h2>
                </div>
            </b-col>
        </b-row>
        <b-row align-h="between">
            <b-col cols="9" sm="3" class="mx-auto" style="border-radius: 10px;
                                            margin-top: 3%;  
                                            padding: 3%; 
                                            border:1px solid rgb(0, 107, 107);">
                    <h2>Tus categorias </h2>  
                    <select id="" v-model="action" style="background-color:black; color: white;">
                        <option value="" selected disabled> Selecciona </option>
                        <option value="crear"> Crear Categoria </option>
                        <option value="modificar"> Modificar Categoria</option>
                        <option value="eliminar"> Eliminar Categoria </option>
                    </select>
                    <div v-if="action ==='crear'">
                        <div class = "crear_categorias">
                            <br>
                            <input type="text" v-model="category" style="background-color:black; color: white;">
                            <p> Nombra tu categoria </p>
                            <select v-model="type" style="background-color:black; color: white;">
                                <option value="incomes"> Ingresos </option>
                                <option value="expenses"> Egresos </option>
                                <option value="liabilities"> Activos </option>
                                <option value="passives"> Pasivos </option>
                            </select> 
                            <p> Elige un tipo de categoria </p>
                            <div v-if="type == 'liabilities' || type ==  'passives'">
                                <input type="text" v-model="value" style="background-color:black; color: white;">
                                <p> Valor</p>
                            </div> 
                            <div v-if="type == 'incomes'">
                                <input type="text" v-model="budget" style="background-color:black; color: white;">
                                <p> Meta mensual</p>
                            </div> 
                            <div v-if="type == 'expenses'">
                                <input type="text" v-model="budget" style="background-color:black; color: white;">
                                <p> Presupuesto mensual</p>
                                <input type="checkbox" v-model="recurrency"  v-on:click="recurrency = true" style="background-color:black; color: white;">                            
                                <p>Selecciona si este es un gasto que haces cada mes</p>
                            </div> 
                            <div v-if="recurrency == true">
                                <p> Elige la fecha del proximo vencimiento</p>
                                <b-form-datepicker id="datepicker" v-model="day" size="sm" dark="true" style="background-color:black; color:white;"></b-form-datepicker> <br>
                            </div>
                            <button v-on:click="cat_create"> Crear Categoria</button>
                        </div>                    
                    </div>       
                    <div v-if="action === 'modificar'">
                        <div class="mod_class">
                            <br>
                            <select v-model ="type" style="background-color:black; color: white;">    
                                <option value= "incomes"> Ingreso </option>
                                <option value= "expenses"> Egreso </option>
                                <option value= "liabilities"> Activo </option>
                                <option value= "passives"> Pasivo </option>
                            </select>
                            <p>Elige tipo de categoria que quieres modificar</p>
                            <div v-if="type === 'incomes'">
                                <select id="category" v-model="category" style="background-color:black; color: white;">
                                    <option value="income" v-for="cat in cats.incomes" :key="cat.type">
                                        {{cat.category}} 
                                    </option>
                                </select>
                                <p>Elige tu categoria</p>
                            </div>
                            <div v-if="type === 'expenses'">
                                <select v-model="category" style="background-color:black; color: white;">
                                    <option value="expense" v-for="cat in cats.expenses" :key="cat.type" >
                                        {{cat.category}} 
                                    </option>
                                </select>
                                <p>Elige tu categoria</p>
                            </div>                         
                            <div v-if="type === 'liabilities'">
                                <select v-model="category" style="background-color:black; color: white;">
                                    <option value="liability" v-for="cat in cats.liabilities" :key="cat.type" >
                                        {{cat.category}} 
                                    </option>            
                                </select>
                                <p>Elige tu categoria</p>
                            </div>
                            <div v-if="type === 'passives'">
                                <select v-model="category" style="background-color:black; color: white;">
                                    <option value="passive" v-for="cat in cats.passives" :key="cat.type" >
                                        {{cat.category}} 
                                    </option>
                                </select>
                                <p>Elige tu categoria</p>
                            </div>
                        </div>
                        <div v-if="category === 'income'">
                            <br>
                            <div>
                                <input type="number" v-model="budget" cols="12" rows="1" style="background-color:black; color: white;">
                                <p>Ingresa el nuevo valor de tu categoria</p>
                            </div>
                            <button v-on:click="modify_cat"> Guardar </button>
                        </div>
                        <div v-if="category === 'expense'">
                            <div>
                                <input type="number" v-model="budget" cols="12" rows="1" style="background-color:black; color: white;"> 
                                <p>Ingresa el nuevo valor de tu categoria</p>
                            </div>
                            <br>
                            <button v-on:click="modify_cat"> Guardar </button>
                        </div>
                        <div v-if="category === 'liability'">
                            <div>
                                <input type="number" v-model="value" cols="12" rows="1" style="background-color:black; color: white;">
                                <p>Ingresa el nuevo valor de tu categoria</p>
                            </div>
                            <br>
                            <button v-on:click="modify_cat"> Guardar </button>
                        </div>
                        <div v-if="category === 'passive'">
                            <div>
                                <input type="number" v-model="value" cols="12" rows="1" style="background-color:black; color: white;">
                                <p>Ingresa el nuevo valor de tu categoria</p>
                            </div>
                            <br>
                            <button v-on:click="modify_cat"> Guardar </button>
                        </div>
                    </div>
                    <div v-if="action ==='eliminar'">
                        <div class="del_cat">
                            <br>
                            <select v-model ="type" style="background-color:black; color: white;">    
                                <option value= "incomes"> Ingreso </option>
                                <option value= "expenses"> Egreso </option>
                                <option value= "liabilities"> Activo </option>
                                <option value= "passives"> Pasivo </option>
                            </select>
                             <p>Que tipo deseas eliminar </p>   
                            <div v-if="type === 'incomes'">
                                <select v-model="category"  style="background-color:black; color: white;">
                                    <option  v-for="cat in cats.incomes" :key="cat.type" >
                                        {{cat.category}} 
                                    </option>
                                </select>
                                <p>Elige la categoria</p>
                            </div>                 
                            <div v-if="type === 'expenses'">
                                <select v-model="category" style="background-color:black; color: white;">
                                    <option  v-for="cat in cats.expenses" :key="cat.type" >
                                        {{cat.category}} 
                                    </option>
                                </select>
                                <p>Elige la categoria</p>
                            </div>
                            <div v-if="type === 'liabilities'">
                                <select v-model="category" style="background-color:black; color: white;">
                                    <option  v-for="cat in cats.liabilities" :key="cat.type" >
                                        {{cat.category}} 
                                    </option>            
                                </select> 
                                <p>Elige la categoria</p>
                            </div>
                            <div v-if="type === 'passives'">
                                <select v-model="category" style="background-color:black; color: white;">
                                    <option  v-for="cat in cats.passives" :key="cat.type" >
                                        {{cat.category}} 
                                    </option>
                                </select>
                                <p>Elige la categoria</p>
                            </div>
                            <br> 
                            <button v-on:click="delete_cat"> Eliminar </button>
                        </div>
                    </div>               
            </b-col>
            <b-col cols="10" class="mx-auto" sm="4" style="margin-top: 3%;">
                <div class = "ing_egr" style="border-radius: 10px;  
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
                                <td class="goo"> ${{Number(cat.budget).toLocaleString()}} </td>                                                
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
                                <th> Presupuesto </th>
                            </tr>                           
                            <tr v-for="cat in cats.expenses" :key="cat.category">                    
                                <td class="titulos"> {{cat.category}} </td> 
                                <!-- <td v-bind:class="{alert: cat.value > cat.budget}"> ${{cat.value}}</td> -->
                                <td class="bad"> ${{Number(cat.budget).toLocaleString()}} </td>                                          
                            </tr>                    
                        </table>
                    </div>                                                        
            </b-col>
            <b-col cols="10" class="mx-auto" sm="4" style="margin-top: 3%;">
                    <div class ="activos" style="border-radius: 10px;
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
            t_bud       : 0,
            t_in        : 0,
            t_lia       : 0,
            t_pass      : 0
        }
    },    
    created: function(){ 
        this.username = this.$route.params.username
        let self = this   
        const url = window.location.hostname.includes("localhost") 
            ? "http://localhost:8000" 
            : "https://my-budget-back.onrender.com";
     
        axios
        .get(`${url}/user/cats/` + this.username)
        .then((result) => {
            console.log(result.data)
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
            const url = window.location.hostname.includes("localhost") 
            ? "http://localhost:8000" 
            : "https://my-budget-back.onrender.com";

            axios
            .post(`${url}/user/create/category/`, data)
            .then((response) => {
                window.location.reload()
            })
            .catch((error) =>{
                alert(error.response.data)                                                         
            })
        },
        modify_cat : function () {
            var data = {
                category    : this.category,
                username    : this.$route.params.username,
                budget      : this.budget,
                value       : this.value
            }
            const url = window.location.hostname.includes("localhost") 
            ? "http://localhost:8000" 
            : "https://my-budget-back.onrender.com";

            axios
            .patch(`${url}/user/modify/category/`, data)
            .then((response) => {
                
            })
            .catch((error) =>{
                alert(error.response.data)                                                         
            })
        },
        delete_cat : function () {
            var data = {
                category    : this.category,
                type        : this.type,
                username    : this.$route.params.username
            }
            const url = window.location.hostname.includes("localhost") 
            ? "http://localhost:8000" 
            : "https://my-budget-back.onrender.com";

            let self = this
            axios
            .delete(`${url}/user/delete/category/`, {data})
            .then((response) => { 
                window.location.reload();
            })
            .catch((error) =>{
            alert(error.response.data)                                                         
            })
        }
    }
    
}
</script>
