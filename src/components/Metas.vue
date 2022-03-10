<template>
    <div class = "Goals">
        <div class = "las_metas">
            <div class="modif">
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
                        <input type="number" placeholder="$" v-model="final_value">
                        <p>Cuando vas a cumplirla?</p>
                        <input type="date" id="start" name="trip-start" value="2018-07-22"
                            min="2021-03-12" max="2040-12-31" v-model="final_date"> <br>
                        <button v-on:click="create_goal" >Crear Meta</button>
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
                    <button v-on:click="update_goal"> Actualizar </button>                    
                </div>
                <div class="borrar_meta" v-if="elige === '3'" >
                    <p>Escoge la meta que vas a borrar</p>
                    <select v-model="name">
                        <option v-for="meta in tus_metas" :key="meta.nombre">
                            {{meta.nombre}}
                        </option>
                    </select>   <br> <br>
                    <button v-on:click="delete_goal"> Eliminar </button>
                </div>
            </div>
            <div class="los_reportes">            
                <div class = "informes">
                    <h1>Mis metas</h1>
                    <table border = 1px >
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
        </div>
        <div>
            <h1>los reportes</h1>
        </div>
    </div>                               
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
    font-family: arial;    
    display: flex;
    flex-direction: column;
    background: rgb(0, 0, 0);
    color: rgb(255, 255, 255);
    overflow-y: scroll;
    overflow: auto;
    max-height: auto;  
}
.las_metas{
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    padding: 3%;
    margin: 3%;
}
.modif{
    width: 30%;
    padding-left: 3%;
    border-radius: 10px;
    box-shadow: 0 10px 25px rgba(0, 148, 148, 0.774);  
}
.crear_metas{
    border: .5px;   
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: initial;
    background: rgba(0, 0, 0 );
    box-shadow: 0 10px 25px rgba(1, 41, 41, 0.431);
}
.crear_metas button{
    font-family: Arial;
    color: #fff;
    background: #000000;
    border: 1px solid #E5E7E9;
    border-radius: 5px;
    margin: 10px;
    padding: 10px 20px;
}
.crear_metas button:hover{
    color: rgb(0, 249, 249);
    box-shadow: 10px 5px 20px 5px rgb(1, 41, 41);
}
.crear_metas input, select{
    color:#E5E7E9;
    background-color:#000000;
}
.los_reportes{
    width: 60%;
    border-radius: 10px;
    box-shadow: 0 10px 25px rgba(0, 148, 148, 0.774);  
}
.informes{
    padding-left: 6%;
    padding-bottom: 4%;
    border: .5px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    background: rgba(0, 0, 0 );
    box-shadow: 0 10px 25px rgba(1, 41, 41, 0.431);
}
.informes table {
    padding: 2px;
    text-align: center;
    border: 0.5px rgba(1, 41, 41, 0.856)
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
.actualizar_meta{
    font-family: Arial;
    text-align: inherit;
    color: #fff;
    background: #000000;
    margin: 10px;
    padding: 10px 20px;
}
.actualizar_meta input{
    color:#E5E7E9;
    background-color:#000000;
}
.actualizar_meta button{
    font-family: Arial;
    color: #fff;
    background: #000000;
    border: 1px solid #E5E7E9;
    border-radius: 5px;
    padding: 10px 20px;
}
.actualizar_meta button:hover{
    color: rgb(249, 240, 2);
    box-shadow: 10px 5px 20px 5px rgb(72, 72, 0);
}
.borrar_meta{
    padding: 10px 20px;
}
.borrar_meta button{
    font-family: Arial;
    color: #fff;
    background: #000000;
    border: 1px solid #E5E7E9;
    border-radius: 5px;
    padding: 10px 20px;
}
.borrar_meta button:hover{
    color: rgb(255, 8, 8);
    box-shadow: 10px 5px 20px 5px rgb(87, 1, 1);
}
</style>