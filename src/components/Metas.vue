<template>
    <b-container fluid>
        <b-row>
            <b-col cols="10" md="3" class="mx-auto" style=" margin-top:3%;
                                                            padding: 5%;
                                                            border-radius: 10px;
                                                            border:1px solid rgb(0, 107, 107);">
                <h1>Metas</h1> 
                <select id="" v-model="elige">  
                    <option value="1"> Crear Metas </option>                
                    <option value="2"> Actualizar Meta </option>
                    <option value="3"> Borrar Meta </option>
                </select>        
                <b-col cols="10" v-if="elige === '1'" >
                    <form>                    
                        <p>Nombra tu meta</p>
                        <input placeholder="Nombre" v-model="name"> 
                        <p>Cuanto $$$ necesitas?</p>
                        <input type="number" step="0.01" placeholder="$" v-model="final_value">
                        <p>Cuando vas a cumplirla?</p>
                        <b-form-datepicker dark-true v-model="final_date" size="lg" style="background-color:black; color:white;"></b-form-datepicker>  
                        <br>
                        <br>
                        <b-button variant="secondary" v-on:click="create_goal" >Crear Meta</b-button>
                    </form>
                </b-col>
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
            <b-col cols="11" md="8" class="mx-auto" style=" margin-top:3%;
                                                            padding: 5%;
                                                            border-radius: 10px;
                                                            border:1px solid rgb(0, 107, 107);">           
                    <div class = "informes">
                        <h1>Mis metas</h1>
                        <table  style="font-size:2.2vw">
                            <tr class = "act">
                                <th> Meta </th>
                                <th> % </th>
                                <th> Valor Final </th>
                                <th> Valor Actual </th>                    
                                <th> Dias Restantes </th>
                            </tr>
                            <tr v-for="goal in tus_metas" :key="goal.nombre" v-bind:class="{pas: goal.porc < 1,
                                                                                            act: goal.porc > 1 && goal.porc < 99,
                                                                                            goo: goal.porc >= 100 
                                    }">
                                <td>{{goal.nombre}}</td>
                                <td>{{goal.porc}}%</td>
                                <td>${{goal.meta}}</td>
                                <td>${{goal.actual}}</td>
                                <td>{{goal.dias}}</td>
                            </tr>
                        </table>                
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
table{
    border-collapse:separate; 
    border-spacing:1em;
}
tr{
    padding-bottom: 1%;
}
td {
  padding-left: 1%;
  font-weight: 300;
  text-align: left;
}
.goo{
    color: #79FF00;
}
.act{
    color: #00E8FF; 
}
.pas{
    color:#FF8600;
}
</style>