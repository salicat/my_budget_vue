<template>
    <b-container fluid> 
        <b-row>
            <b-col cols="12" mx-class="auto" style="border-radius: 10px;  
                                            margin-top: 5%;
                                            margin-bottom: 5%;
                                            padding: 3%;
                                            border:1px solid rgb(0, 107, 107); ">
            <h2 class="act"> Sugerencias </h2>
            <div v-if="gen_budget-gen_exp > 0">
                <h4 class="goo">Segun tu presupuesto tienes ${{Number(gen_budget-gen_exp).toLocaleString()}} mensual disponible para asignar a metas!!!</h4>
                <h4 class="goo"> Que quieres hacer?</h4>
                <select v-model="queHacer" id="">
                    <option value="pagar">      Pagar Deudas </option>
                    <option value="ahorrar">    Ahorrar </option>
                </select>
                <div v-if="queHacer === 'pagar'">
                    <h4 class="act"> Pagarias tus deudas en {{Math.round( passives / (gen_budget-gen_exp))}} meses</h4>
                    <button> Agregar meta </button>
                </div>
                <div v-if="queHacer === 'ahorrar'">
                    <h4 class="act"> Deberias tener un ahorro minimo mensual de ${{Number((gen_budget)*0.1).toLocaleString()}}</h4>
                    <button> Agregar meta</button>
                </div>
            </div>
            <div v-if="gen_budget-gen_exp < 0">
                <h4 class="bad"> Segun tu presupuesto tus gastos son mayores que tus ingresos </h4>
                <p class="act"> Reduce tus Gastos o Aumenta tus ingresos</p>
            </div>
            </b-col>
        </b-row>
        <b-row>
            <b-col cols="10" md="3" class="mx-auto" style=" margin-top:3%;
                                                            padding: 5%;
                                                            border-radius: 10px;
                                                            border:1px solid rgb(0, 107, 107);">
                <h1>Metas</h1> 
                <select id="" v-model="elige">  
                    <option value="1"> Crear Metas </option>                
                    <option v-if="tus_metas.length > 0" value="2"> Actualizar Meta </option>
                    <option v-if="tus_metas.length > 0" value="3"> Borrar Meta </option>
                </select>        
                <b-col cols="10" v-if="elige === '1'" >
                    <form>  
                        <br>                 
                        <input placeholder="Nombre" v-model="name"> 
                        <p>Nombra tu meta</p> 
                        <input type="number" step="0.01" placeholder="$" v-model="final_value">
                        <p>Cuanto $$$ necesitas?</p>
                        <b-form-datepicker dark-true v-model="final_date" size="lg" style="background-color:black; color:white;"></b-form-datepicker>  
                        <p>Cuando vas a cumplirla?</p>
                        <br>
                        <b-button variant="secondary" v-on:click="create_goal" >Crear Meta</b-button>
                    </form>
                </b-col>
                <div class = "actualizar_meta" v-if="elige === '2'"> 
                    <br> 
                    <select v-model="name" >
                        <option v-for="meta in tus_metas" :key="meta.nombre">
                            {{meta.nombre}}
                        </option>
                    </select>
                    <p>Selecciona tu meta</p>   
                    <br>                      
                    <p>Cuanto vas a agregar?</p>
                    <input type="number" placeholder="$" v-model="value"> <br> <br>
                    <p>*Si gastaste dinero, puedes agregar valores negativos</p>
                    <br>
                    <b-button variant="secondary" v-on:click="update_goal"> Actualizar </b-button>                    
                </div>
                <div class="borrar_meta" v-if="elige === '3'" >
                    <p>Escoge la meta que vas a borrar</p>
                    <select v-model="name">
                        <option v-for="meta in tus_metas" :key="meta.nombre">
                            {{meta.nombre}}
                        </option>
                    </select>   <br> <br>
                    <b-button variant="secondary" v-on:click="delete_goal"> Eliminar </b-button>
                </div>
            </b-col>
            <b-col cols="11" md="8" class="mx-auto" style=" margin-top:3%;
                                                            padding: 5%;
                                                            border-radius: 10px;
                                                            border:1px solid rgb(0, 107, 107);">           
                    <div class = "informes" v-if="tus_metas.length > 0">
                        <h1>Mis metas</h1>
                        <table  style="font-size:2vw">
                            <tr>
                                <th class = "act"> Meta </th>
                                <th class = "act"> % </th>
                                <th class = "act"> Valor Final </th>
                                <th class = "act"> Valor Actual </th>                    
                                <th class = "act"> Dias Restantes </th>
                            </tr>
                            <tr v-for="goal in tus_metas" :key="goal.nombre" v-bind:class="{pas: goal.porc < 99,
                                                                                            goo: goal.porc >= 100 
                                    }">
                                <td>{{goal.nombre}}</td>
                                <td>{{goal.porc}}%</td>
                                <td>${{Number(goal.meta).toLocaleString()}}</td>
                                <td>${{Number(goal.actual).toLocaleString()}}</td>
                                <td style="text-aling:right">{{goal.dias}}</td>
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
    name: 'Metas',
    components: {},
    data: function(){
        return {
            name        : "",
            username    : localStorage.getItem('current_username'),
            final_value : 0,
            final_date  : undefined,
            value       : 0,
            tus_metas   : [],            
            elige       : undefined,
            queHacer    : undefined,
            month_exp   : 0,
            month_inc   : 0,
            gen_budget  : 0,
            gen_exp     : 0,
            passives    : 0
        };
    },
    created: function() {
        
        const today = new Date()
        var m = today.getMonth() + 1;
        var y = today.getFullYear();

        this.anio = y

        var data = {
            username    : this.$route.params.username,
            year        : y,
            month       : m,
        }
        var url;
        if (process.env.NODE_ENV === 'development') {
            url = "https://front-24qp.onrender.com";  // URL de producción
        } else {
            url = "http://localhost:8000";  // URL local
        }

        let one     = `${url}/user/goals/track/` + data.username 
        let two     = `${url}/user/month_records/` + data.username + "/" + data.year + "/" + data.month
        let three   = `${url}/user/cats/` + data.username 

        const requestOne    = axios.get(one)
        const requestTwo    = axios.get(two)
        const requestThree  = axios.get(three)

        let self = this
        axios
        .all([requestOne, requestTwo, requestThree])        
        .then(axios.spread((...responses) => {
            
            let responseOne     = responses[0]
            self.tus_metas = responseOne.data

            let responseTwo     = responses[1]
            for (var i = 0; i < responseTwo.data.length; i++) {                 
                    if ( responseTwo.data[i].type == "incomes") {
                    this.month_inc = this.month_inc + responseTwo.data[i].value;
                };
                if (responseTwo.data[i].type == "expenses") {
                    this.month_exp = this.month_exp + responseTwo.data[i].value;
                };  
            }

            let responseThree   = responses[2]
            for (var l = 0; l < responseThree.data["incomes"].length; l++){
                this.gen_budget = this.gen_budget + responseThree.data["incomes"][l].budget
            }
            for (var l = 0; l < responseThree.data["expenses"].length; l++){
                this.gen_exp = this.gen_exp + responseThree.data["expenses"][l].budget
            }
            for (var k = 0; k < responseThree.data["passives"].length; k++){
                this.passives = this.passives + responseThree.data["passives"][k].value
            }
        })

        )
        .catch((error) =>{
            alert(error)
        })
    },    
    methods:{
        create_goal: function () {
            var data = {
                name : this.name,
                username : this.username,
                final_value : this.final_value,
                final_date : this.final_date                
            }            
            var url;
        if (process.env.NODE_ENV === 'development') {
            url = "https://front-24qp.onrender.com";  // URL de producción
        } else {
            url = "http://localhost:8000";  // URL local
        }
            axios
            .post(`${url}/user/goals/set/`, data)
            .then((result) => {
                window.location.reload(); 
            })            
        },
        update_goal: function () {
            var data = {
                name : this.name,
                username : this.username,
                value : this.value
            }
            var self = this;
            var url;
                if (process.env.NODE_ENV === 'development') {
                    url = "https://front-24qp.onrender.com";  // URL de producción
                } else {
                    url = "http://localhost:8000";  // URL local
                }
            axios
            .put(`${url}/user/goals/update`, data)
            .then((result) => {    
                window.location.reload();          
            })
        },
        delete_goal: function () {
            var data = {
                name: this.name,
                username : this.username
            }  
            var url;
                if (process.env.NODE_ENV === 'development') {
                    url = "https://front-24qp.onrender.com";  // URL de producción
                } else {
                    url = "http://localhost:8000";  // URL local
                }          
            axios
            .delete(`${url}/user/goals/delete`, {data})
            .then((result) => {        
                alert(data.name + " borrado")
                window.location.reload();                       
            })
        },
    }
    
}
</script>

