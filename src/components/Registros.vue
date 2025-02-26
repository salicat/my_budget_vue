<template>
    <b-container fluid>
        <b-row >
            <b-row>
            <b-col cols="10" class="mx-auto" sm="12" style="border-radius: 10px;
                                            margin-top: 3%;
                                            margin-bottom: 5%;
                                            padding: 3%;  
                                            border:1px solid rgb(0, 107, 107); ">
                <div v-if="cats.expenses.length > 0">
                    <h1>Variaciones en Gastos</h1>
                    <select v-model="track" v-on:change="track_months">
                        <option v-for="cat in cats.expenses" v-bind:key="cat.name">
                        {{cat.category}} 
                        </option>
                    </select>
                    <area-chart :colors="['#00E8FF']"
                                label="Value"    
                                :curve="false"                         
                                :discrete="true"
                                prefix="$"
                                thousands=","
                                :messages="{empty: 'Selecciona la categoria'}"
                                :legend="false"
                                xtitle="Meses" ytitle="Valor"
                                :data="datos">
                    </area-chart>
                </div>
            </b-col>
        </b-row>
            <b-col cols="10"  sm="4" class = "mx-auto" style="border-radius: 10px;  
                                            padding: 3%;
                                            margin-top: 3%;
                                            border:1px solid rgb(0, 107, 107); "> 
                <b-row>
                   <h2 class ="act">Registrar Transaccion</h2><br>
                </b-row>               
                <b-row>
                    <b-col cols="10">
                        <p>Selecciona tipo de Transaccion</p>
                        <b-form-select v-model ="type" style="background-color:black; color: white;">    
                            <option value= "incomes"> Ingreso </option>
                            <option value= "expenses"> Egreso </option>
                        </b-form-select>
                    </b-col>
                    <b-col cols="10">
                        <p> Selecciona la Categoria </p>     
                        <b-form-select v-model="category" v-if="type === 'incomes'" style="background-color:black; color: white;">
                            <option  v-for="cat in cats.incomes" :key="cat.type" >
                                {{cat.category}} 
                            </option>
                        </b-form-select>        
                    </b-col>
                    <b-col cols="10">
                        <b-form-select v-model="category" v-if="type === 'expenses'" style="background-color:black; color: white;">
                            <option  v-for="cat in cats.expenses" :key="cat.category" >
                                {{cat.category}}
                            </option>
                        </b-form-select>
                    </b-col>
                    <b-col cols="10">
                        <b-form-select v-model="category" v-if="type === 'liabilities'" style="background-color:black; color: white;">
                            <option  v-for="cat in cats.liabilities" :key="cat.type" >
                                {{cat.category}} 
                            </option>            
                        </b-form-select>   
                    </b-col>
                    <b-col cols="10">
                        <b-form-select v-model="category" v-if="type === 'passives'" style="background-color:black; color: white;">
                            <option  v-for="cat in cats.passives" :key="cat.type" >
                                {{cat.category}} 
                            </option>
                        </b-form-select> 
                    </b-col>
                    <b-col cols="7">
                        <p>Descripcion</p>
                        <b-form-input placeholder="Descripcion" size="sm" type= "text" v-model ="descripcion" style="background-color:black; color: white;"> </b-form-input>
                    </b-col>            
                    <b-col cols="7">
                        <p>Ingresa el valor</p>
                        <b-form-input placeholder="0.00" v-model ="value" style="background-color:black; color: white;"> </b-form-input><br>            
                    </b-col>
                    <b-col cols="7">
                        <p>Elige la fecha del registro</p>
                        <b-form-datepicker id="datepicker" v-model="day" size="sm" dark="true"></b-form-datepicker> <br>
                    </b-col>
                    <b-col cols="8">
                        <b-button v-on:click="save_reg" variant="dark"> Guardar Registro </b-button>            
                    </b-col>
                </b-row>
            </b-col>
                     <b-col cols="10" sm="7" mx-class="auto" style="border-radius: 10px;  
                                            padding: 3%;
                                            margin-left: 8%;
                                            margin-top: 3%;
                                            border:1px solid rgb(0, 107, 107);">
                <h2 class="act">Consultar Registros</h2>
                <b-row class="botones" align-h="between">
                    <b-col cols="5">
                        <b-form-select v-model="month" style="background-color:black; color: white;">
                            <option v-for="mes in meses" :key="mes"> 
                                {{mes}} 
                            </option>
                        </b-form-select >
                    </b-col>
                    <b-col cols="6">
                        <select v-model="year" style="background-color:black; color: white;">
                            <option value="2021"> 2021 </option>
                            <option value="2022"> 2022 </option>
                            <option value="2023"> 2023 </option>
                            <option value="2024"> 2024 </option>
                            <option value="2025"> 2025 </option>
                        </select>
                    </b-col>
                    <b-col cols="6" >
                        <b-button v-on:click="get_regs" variant="dark"> Consultar </b-button>                    
                    </b-col>
                    <b-col cols="5" >
                        <b-button id="del" v-if="selected.length" v-on:click="reg_del" variant="dark"> Eliminar  </b-button>
                    </b-col>               
                </b-row>
                <b-row >
                    <h2 class="act">Mis Registros</h2>  
                    <div>
                        <table style="font-size:01.8vw">
                            <thead>
                                <tr>                    
                                    <label>
                                        <input type="checkbox" v-model="selectedAll" v-on:click="select">
                                    </label>
                                    <th class="act"> Categoria </th>
                                    <th class="act"> Descripción </th>
                                    <th class="act"> Valor </th>
                                    <th class="act"> Fecha </th>
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
                                    <td> {{reg.category}}</td>                                      
                                    <td>{{reg.description}} </td>                        
                                    <td>${{Number(reg.value).toLocaleString()}}</td>
                                    <td>{{reg.date}}</td>                           
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </b-row>                                          
            </b-col>
        </b-row>
        
    </b-container> 
</template>
<script>
import axios from "axios";
import { cat } from "shelljs";


export default {
    name: "Registros", 
    components: {},
    data: function (){
        return {
            username    : localStorage.getItem('current_username'),
            category    : "",
            day         : "",
            type        : "",
            descripcion : "",
            value       : 0,
            cats        : [],
            registers   : [],
            selected    : [], 
            selectedAll : false,
            id          : undefined,
            month       : undefined,
            track       : undefined,
            alertas     : [],
            datos       : [],
            year        : [2021, 2022, 2023, 2024, 2025],
            meses       : ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 
                        'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 
                        'Noviembre', 'Diciembre']            
        };       
    },
        created: function() {
            this.username = localStorage.getItem("current_username");
            var self = this;            
            var url;
            if (process.env.NODE_ENV === 'production') {
                url = "https://front-24qp.onrender.com";  // URL de producción
            } else {
                url = "http://localhost:8000";  // URL local
            }

            axios            
            .get(`${url}/user/cats/` + this.username)
            .then((response) => {                
                self.cats = response.data;                
            })            
        },
    methods:{
        get_regs: function (){            
            
            var month_cons = this.meses.indexOf(this.month) + 1;

            var data = {
            username    : this.$route.params.username,
            year        : this.year,
            month       : month_cons
            }  
            var url;
            if (process.env.NODE_ENV === 'production') {
                url = "https://front-24qp.onrender.com";  // URL de producción
            } else {
                url = "http://localhost:8000";  // URL local
            }
            var self = this  
            axios
            .get(`${url}/user/month_records/` + data.username + "/" + data.year + "/" + data.month)
            .then((response) => {
                self.registers = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
            })  
            .catch((error) => {
            alert(error + username + " ERROR en el server!")
            })      
        },
        save_reg: function () {
            var data = {
                username    : this.username,
                date        : this.day,
                type        : this.type,
                category    : this.category,
                description : this.descripcion,
                value       : this.value
            }
            var url;
            if (process.env.NODE_ENV === 'production') {
                url = "https://front-24qp.onrender.com";  // URL de producción
            } else {
                url = "http://localhost:8000";  // URL local
            }
            axios
            .post(`${url}/user/register/`, data)
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
            var url;
            if (process.env.NODE_ENV === 'production') {
                url = "https://front-24qp.onrender.com";  // URL de producción
            } else {
                url = "http://localhost:8000";  // URL local
            }
            if(confirm("Eliminar registros afectara otros datos en la aplicación")){
                axios
                .delete(`${url}/user/records/delete/`, {data})
                .then((response) => {
                    alert("Regristos borrados " + response.data)
                    window.location.reload()
            }) 
            }            
        },
        track_months : function () {
            const d = new Date();
            let month = d.getMonth(); 
            this.month = month+1


            var data = {
                username    : this.$route.params.username,
                month       : this.month,
                category    : this.track
            }
            console.log(data.month)
            var self = this
            var url;
            if (process.env.NODE_ENV === 'production') {
                url = "https://front-24qp.onrender.com";  // URL de producción
            } else {
                url = "http://localhost:8000";  // URL local
            }
            axios
            .get(`${url}/user/track/`+ data.username + "/" + 2025 + "/" + data.month + "/" + data.category)
            .then((response) => {
                self.datos = response.data
            })
        }       
    }        
}

</script>
