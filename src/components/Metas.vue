<template>
    <b-container fluid>
        <b-row>
            <b-col cols="10" md="3" class="mx-auto" style="margin-top:3%">
                <h1>Metas</h1> 
                <select id="" v-model="elige"> 
                    <option value="1"> Crear Metas </option>                
                    <option value="2"> Actualizar Meta </option>
                    <option value="3"> Borrar Meta </option>
                </select>        
                <div class = "crear_metas" v-if="elige === '1'">
                    <form>                    
                        <p>Nombra tu meta</p>
                        <input placeholder="Nombre" v-model="name"> 
                        <p>Cuanto $$$ necesitas?</p>
                        <input type="number" step="0.01" placeholder="$" v-model="final_value">
                        <p>Cuando vas a cumplirla?</p>
                        <input type="date" id="start" name="trip-start" value="2018-07-22"
                            min="2021-03-12" max="2040-12-31" v-model="final_date"> 
                        <br>
                        <br>
                        <b-button variant="secondary" v-on:click="create_goal" >Crear Meta</b-button>
                    </form>
                </div>
                <div class = "actualizar_meta" v-if="elige === '2'">
                    <p>Selecciona tu meta</p> 
                    <select v-model="name" >
                        <option v-for="meta in tus_metas" :key="meta.nombre">
                            {{meta.nombre}}
                        </option>
                    </select>   <br> <br> 
                    <p1>Valor</p1>  <br>                     
                    <input type="number" placeholder="$" v-model="value"> <br> <br>
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
            <b-col cols="11" md="9" class="mx-auto" style="margin-top:3% ">
                <div class="los_reportes">            
                    <div class = "informes">
                        <h1>Mis metas</h1>
                        <table  >
                            <tr class = "columnas">
                                <th> Meta </th>
                                <th> % </th>
                                <th> Valor Final </th>
                                <th> Valor Actual </th>                    
                                <th> Dias Restantes </th>
                            </tr>
                            <tr v-for="goal in tus_metas" :key="goal.nombre">
                                <td class="titulos">{{goal.nombre}}</td>
                                <td>{{goal.porc}}%</td>
                                <td>${{goal.meta}}</td>
                                <td>${{goal.actual}}</td>
                                <td>{{goal.dias}}</td>
                            </tr>
                        </table>                
                    </div>            
                </div>   
            </b-col>
        </b-row>
        <b-row>
            <b-col cols="12" mx-class="auto" style="border-radius: 10px;  
                                            margin-top: 5%;
                                            margin-bottom: 5%;
                                            padding: 3%;
                                            border:1px solid rgb(0, 107, 107); ">
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
            name : "",
            username : localStorage.getItem('current_username'),
            final_value : 0,
            final_date : undefined,
            value : 0,
            tus_metas : [],            
            elige : undefined
        };
    },
    created: function() {
        this.username = this.$route.params.username
        var self = this        


        
        axios        
        .get("https://mybudgetback.herokuapp.com/user/goals/track/" + this.username)
        .then((response) =>{
            self.tus_metas = response.data            
        })
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
            axios
            .post("https://mybudgetback.herokuapp.com/user/goals/set/", data)
            .then((result) => {
            })            
        },
        update_goal: function () {
            var data = {
                name : this.name,
                username : this.username,
                value : this.value
            }
            var self = this;
            axios
            .put("https://mybudgetback.herokuapp.com/user/goals/update", data)
            .then((result) => {    
                window.location.reload();          
            })
        },
        delete_goal: function () {
            var data = {
                name: this.name,
                username : this.username
            }            
            axios
            .delete("https://mybudgetback.herokuapp.com/user/goals/delete", {data})
            .then((result) => {        
                alert(data.name + " borrado")
                window.location.reload();                       
            })
        },
    }
    
}
</script>

<style>
.Goals{
    background: rgb(0, 0, 0);
    color: rgb(255, 255, 255);
}
.crear_metas input, select{
    color:#E5E7E9;
    background-color:#000000;
}
.los_reportes{
    border-radius: 10px;
    border:1px solid rgb(0, 107, 107);  
}
.informes{
    padding-left: 6%;
    padding-bottom: 4%;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 25px rgba(1, 41, 41, 0.431);
}
.informes table {
    padding: 2px;
    text-align: center;
}
.columnas {
    color: rgb(0, 107, 107);
    padding: 5px;
    font-size: 90%;
}
.titulos{
    color: rgb(0, 107, 107);
    font-weight: 100;
    text-align: left;
    padding: 4px ;
    font-weight: bold;
    font-size: 0.9em;
}
.actualizar_meta input{
    color:#E5E7E9;
    background-color:#000000;
}
</style>