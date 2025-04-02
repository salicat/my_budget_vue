<template> 
    <b-container fluid> 
        <b-row>
            <b-col cols="12"  class="module">
                <div>
                    <h1 class="act">Alertas:</h1>
                    <h2 v-if="t_pass > t_lia" class="bad"> Tus Pasivos son mayores que tus activos en ${{Number(t_pass-t_lia).toLocaleString()}}</h2>
                    <h2 v-if="t_bud > t_in " class="bad"> Tus egresos exceden tus ingresos en ${{Number(t_bud - t_in).toLocaleString()}}</h2>
                </div>
            </b-col>
        </b-row>
        <b-row align-h="between">
            <b-col cols="12" sm="12" md="3" class="module">
                <div class="form-container">
                <h2 class="form-title">Tus Categorías</h2>
                <div class="form-group">
                <label for="action">Selecciona una acción</label>
                <select id="action" v-model="action" class="form-select">
                    <option value="" disabled>Selecciona</option>
                    <option value="crear">Crear Categoría</option>
                    <option value="modificar">Modificar Categoría</option>
                    <option value="eliminar">Eliminar Categoría</option>
                </select>
                </div>
                
                <!-- Crear Categoría -->
                <div v-if="action === 'crear'" class="create-category">
                <div class="form-group">
                    <label for="category">Nombra tu categoría</label>
                    <input type="text" id="category" v-model="category" class="form-input" placeholder="Nombre de la categoría">
                </div>
                
                <div class="form-group">
                    <label for="type">Elige un tipo de categoría</label>
                    <select id="type" v-model="type" class="form-select">
                    <option value="incomes">Ingresos</option>
                    <option value="expenses">Egresos</option>
                    <option value="liabilities">Activos</option>
                    <option value="passives">Pasivos</option>
                    </select>
                </div>

                <!-- Campos dinámicos según tipo -->
                <div v-if="type === 'liabilities' || type === 'passives'" class="form-group">
                    <label for="value">Valor</label>
                    <input type="number" id="value" v-model="value" class="form-input" placeholder="Valor de la categoría">
                </div>

                <div v-if="type === 'incomes'" class="form-group">
                    <label for="budget">Meta mensual</label>
                    <input type="number" id="budget" v-model="budget" class="form-input" placeholder="Meta mensual">
                </div>

                <div v-if="type === 'expenses'" class="form-group">
                    <label for="budget">Presupuesto mensual</label>
                    <input type="number" id="budget" v-model="budget" class="form-input" placeholder="Presupuesto mensual">
                    
                    <div class="form-group">
                    <label for="recurrency">¿Gasto recurrente?</label>
                    <input type="checkbox" id="recurrency" v-model="recurrency" class="form-checkbox" />
                    </div>
                </div>

                <!-- Fecha de vencimiento si es recurrente -->
                <div v-if="recurrency" class="form-group">
                    <label for="day">Elige la fecha del próximo vencimiento</label>
                    <input type="date" id="day" v-model="day" class="form-input" />
                </div>

                <button @click="cat_create" class="form-button">Crear Categoría</button>
                </div>

                <!-- Modificar Categoría -->
                <div v-if="action === 'modificar'" class="modify-category">
                <div class="form-group">
                    <label for="type">Selecciona tipo de categoría</label>
                    <select id="type" v-model="type" class="form-select">
                    <option value="incomes">Ingreso</option>
                    <option value="expenses">Egreso</option>
                    <option value="liabilities">Activo</option>
                    <option value="passives">Pasivo</option>
                    </select>
                </div>

                <div v-if="type === 'incomes'" class="form-group">
                    <label for="category">Selecciona una categoría</label>
                    <select id="category" v-model="category" class="form-select">
                    <option v-for="cat in cats.incomes" :key="cat.type" :value="cat.category">{{ cat.category }}</option>
                    </select>
                </div>

                <!-- Otros tipos de categoría -->
                <div v-if="type === 'expenses'" class="form-group">
                    <label for="category">Selecciona una categoría</label>
                    <select id="category" v-model="category" class="form-select">
                    <option v-for="cat in cats.expenses" :key="cat.type" :value="cat.category">{{ cat.category }}</option>
                    </select>
                </div>
                
                <div v-if="type === 'liabilities'" class="form-group">
                    <label for="category">Selecciona una categoría</label>
                    <select id="category" v-model="category" class="form-select">
                    <option v-for="cat in cats.liabilities" :key="cat.type" :value="cat.category">{{ cat.category }}</option>
                    </select>
                </div>

                <div v-if="type === 'passives'" class="form-group">
                    <label for="category">Selecciona una categoría</label>
                    <select id="category" v-model="category" class="form-select">
                    <option v-for="cat in cats.passives" :key="cat.type" :value="cat.category">{{ cat.category }}</option>
                    </select>
                </div>

                <div v-if="category">
                    <div class="form-group">
                    <label for="budget">Nuevo valor</label>
                    <input type="number" id="budget" v-model="budget" class="form-input" placeholder="Nuevo valor">
                    </div>
                    <button @click="modify_cat" class="form-button">Guardar</button>
                </div>
                </div>

                <!-- Eliminar Categoría -->
                <div v-if="action === 'eliminar'" class="delete-category">
                <div class="form-group">
                    <label for="type">Selecciona tipo de categoría a eliminar</label>
                    <select id="type" v-model="type" class="form-select">
                    <option value="incomes">Ingreso</option>
                    <option value="expenses">Egreso</option>
                    <option value="liabilities">Activo</option>
                    <option value="passives">Pasivo</option>
                    </select>
                </div>

                <div v-if="type">
                    <div class="form-group">
                    <label for="category">Selecciona una categoría</label>
                    <select id="category" v-model="category" class="form-select">
                        <option v-for="cat in cats[type]" :key="cat.type" :value="cat.category">{{ cat.category }}</option>
                    </select>
                    </div>
                    <button @click="delete_cat" class="form-button">Eliminar Categoría</button>
                </div>
                </div>
            </div>             
            </b-col>
            <b-col cols="12" sm="4" md="4" >
                <div class = "module" >
                    <h1 class="goo"> Ingresos </h1>
                    <h2 class="goo"> ${{Number(t_in).toLocaleString()}} </h2>
                    <table class="tab_egresos">
                        <tr class = "columnas">
                            <th>  </th>                            
                            <th> Valor Mensual</th>
                        </tr>
                        <tr v-for="cat in cats.incomes" :key="cat.category">                    
                            <td class="titulos"> {{cat.category}} </td> 
                            <td class="goo"> ${{Number(cat.budget).toLocaleString()}} </td>                                                
                        </tr>
                    </table>                                                                                    
                </div>
                <div class ="module" >
                    <h1 class="bad"> Egresos </h1>                
                    <h2 class="bad"> ${{Number(t_bud).toLocaleString()}} </h2>
                    <table class="tab_egresos">
                        <tr class = "columnas">
                            <th>  </th>
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
            <b-col cols="12" sm="4" md="4">
                    <div class="module">
                        <h1 class="act"> Activos </h1>
                        <h2 class="act"> ${{Number(t_lia).toLocaleString()}} </h2>
                        <table class="tab_egresos">
                                <tr class = "columnas">
                                    <th> </th>
                                    <th> Valor </th>
                                </tr>
                                <tr v-for="cat in cats.liabilities" :key="cat.category">                    
                                    <td class="titulos"> {{cat.category}} </td> 
                                    <td class="act"> ${{Number(cat.value).toLocaleString()}} </td>
                                </tr>                 
                        </table>
                    </div>            
                    <div class="module">
                        <h1 class="pas"> Pasivos </h1>
                        <h2 class="pas"> ${{Number(t_pass).toLocaleString()}} </h2>
                        <table class="tab_egresos">
                                <tr class = "columnas">
                                    <th> </th>
                                    <th> Valor </th>
                                </tr>
                                <tr v-for="cat in cats.passives" :key="cat.category">                    
                                    <td class="titulos"> {{cat.category}} </td> 
                                    <td class="pas"> ${{Number(cat.value).toLocaleString()}} </td>
                                </tr>                    
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
                window.location.reload();
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
