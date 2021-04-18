<template> 
    <div id="Categorias">
        <h1>Estas son tus categorias</h1>            
        <div class="cats">
            <div class="new_cat">
                <h2>Editar mis categorias</h2>  
                <select id="" v-model="action">
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
                            <input type="checkbox" v-model="recurrency"  v-on:click="recurrency = true" >                            
                        </div> <br>
                        <div v-if="recurrency == true">
                            <p> Elige la fecha del proximo vencimiento</p>
                            <input type="date" id="start" name="trip-start" value="2018-07-22"
                                    min="2000-03-12" max="2040-12-31" v-model="day"> <br>
                        </div>
                        <button v-on:click="cat_create"> Crear Categoria</button>
                    </div>                    
                </div>               
                <div v-if="action ==='eliminar'" >
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
                    <h1> Ingresos </h1>
                    <table border="1px">
                        <tr class = "columnas">
                            <th>  </th>                            
                            <th> Meta mensual</th>
                        </tr>
                        <tr v-for="cat in cats.incomes" :key="cat.category">                    
                            <td class="titulos"> {{cat.category}} </td> 
                            <td> ${{cat.budget}} </td>                                                
                        </tr>
                    </table>                                                                                    
                </div>
                <div class ="egresos">
                    <h1> Egresos </h1>                
                    <table border="1px">
                        <tr class = "columnas">
                            <th>  </th>
                            <th> Presupuesto </th>
                            <th> Prox Vencimiento </th>
                        <tr>                           
                        <tr v-for="cat in cats.expenses" :key="cat.category">                    
                            <td class="titulos"> {{cat.category}} </td> 
                            <!-- <td v-bind:class="{alert: cat.value > cat.budget}"> ${{cat.value}}</td> -->
                            <td > ${{cat.budget}} </td>
                            <td v-if="cat.recurrency==true"> {{cat.day}}</td>                                          
                        </tr>                    
                    </table>
                </div>                                                          
        </div>            
    </div>
        <div class="assets">
                <div class ="activos">
                    <h1> Activos </h1>
                    <table >
                        <tr class = "columnas">
                            <td> </td>
                            <td> Valor </td>
                        </tr>
                        <tr v-for="cat in cats.liabilities" :key="cat.category">                    
                            <th class="titulos"> {{cat.category}} </th> 
                            <th> ${{cat.value}} </th>
                        </tr>                    
                    </table>
                </div>
                <div class ="pasivos">
                    <h1>Pasivos</h1>
                    <table >
                        <tr class = "columnas">
                            <td> </td>
                            <td> Valor </td>
                        </tr>

                        <tr v-for="cat in cats.passives" :key="cat.category">                    
                            <th class="titulos"> {{cat.category}} </th> 
                            <th > ${{cat.value}} </th>
                        </tr>                    
                    </table>
                </div>
            </div>
        <div class="warning">*Recuerda que los valores de Activos y Pasivos los actualizas desde la seccion registros</div>    
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
            
        }
    },    
    created: function(){
        this.username = this.$route.params.username
        let self = this        
        axios
        .get("https://mybudgetback.herokuapp.com/user/cats/" + this.username)
        .then((result) => {
            self.cats = result.data
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
            console.log(data.recurrency, data.day)
            axios
            .post("https://mybudgetback.herokuapp.com/user/create/category/", data)
            .then((response) => {
                alert(response.data.message )
                window.location.reload();
            })
            .catch((error) =>{
                if (error.response.status == "403"){
                    alert("Ya tienes una categoria con nombre " + data.category)
                }
                
            })
        },
        delete_cat : function () {
            var data = {
                category : this.category,
                type : this.type,
                username : this.username
            }
            let self = this
            if(confirm("Se eliminarán todos los registros de la categoria " + this.category)){
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
    display: flex;
    flex-direction: row;
    justify-content: space-between; 
}
.new_cat{
    max-width:20%;
    padding: 10px;    
    font-family: arial;
    overflow:hidden;
}
.new_cat button:hover{
    color: rgb(1, 41, 41);
    box-shadow: 10px 5px 20px 10px rgb(1, 41, 41);
}
.ing_egr table{
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
.ing_egr{
    width: 80%;
    display: flex;
    flex-direction: row;
}
.ingresos{
    min-width: 20%;
    font-family: arial;
    border:1px solid rgb(0, 107, 107);
    border-radius: 10px;
    padding: 10px; 
    overflow:hidden   
}
.alert{
    color: red;
}
.success{
    color: rgb(0, 255, 0)
}
.egresos{
    min-width: 20%;
    font-family: arial;
    border:1px solid rgb(0, 107, 107);
    border-radius: 10px;
    padding: 10px;       
    overflow:hidden
}
.egresos th{    
    text-align: left;
}
.assets{
    display: flex;
    flex-direction: row;
}
.activos{
    min-width: 20%;
    font-family: arial;
    border:1px solid rgb(0, 107, 107);
    border-radius: 10px;
    padding: 10px;    
}
.activos th{
    text-align: left;
}
.pasivos{
    min-width: 20%;
    font-family: arial;
    border:1px solid rgb(0, 107, 107);
    border-radius: 10px;
    padding: 10px; 
}
.pasivos th{
    text-align: left;    
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
.warning{
    color: #9e8e01;
}

</style>