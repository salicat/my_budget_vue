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
                            <p> Presupuesto mensual :</p>
                            <input type="text" v-model="budget">
                        </div> <br>
                        <div v-if="type == 'expenses'">
                            <p> Presupuesto mensual :</p>
                            <input type="text" v-model="budget">
                        </div> <br>
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
                                {{cat.category | formatNumber}} 
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
            <div class = "tablas">
            <div class ="ingresos">
                <h1> Ingresos </h1>
                <table >
                    <tr v-for="cat in cats.incomes" :key="cat.category">                    
                        <th> {{cat.category}} </th> 
                        <th class="val"> ${{cat.budget}} </th>
                    </tr>                    
                </table>                                                                                    
            </div>
            <div class ="egresos">
                <h1> Egresos </h1>                
                <table>
                    <tr v-for="cat in cats.expenses" :key="cat.category">                    
                        <th> {{cat.category}} </th> 
                        <th class="val"> ${{cat.budget}} </th>
                    </tr>                    
                </table>
            </div>
            <div class ="activos">
                <h1> Activos </h1>
                <table >
                    <tr v-for="cat in cats.liabilities" :key="cat.category">                    
                        <th> {{cat.category}} </th> 
                        <th class="val"> ${{cat.value}} </th>
                    </tr>                    
                </table>
            </div>
            <div class ="pasivos">
                <h1>Pasivos</h1>
                <table >
                    <tr v-for="cat in cats.passives" :key="cat.category">                    
                        <th> {{cat.category}} </th> 
                        <th class="val"> ${{cat.value}} </th>
                    </tr>                    
                </table>
            </div>
            </div>
        </div>
        <div class="inferior">
            <div class="barras">
                <h2>Barras ACUMULADOS</h2>
            </div>
            <div class = "lineas">
                <h2>Lineas de crecimiento en el tiempo</h2>
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
            type : "",
            category : "",
            description : "",
            value : 0,
            budget : 0,
            cats : [],
            action : undefined
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
                budget      : this.budget          
                }        
            let self = this
            axios
            .post("https://mybudgetback.herokuapp.com/create/category/", data)
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
    border-radius: 10px;
    padding: 10px;    
    font-family: arial;
    overflow:hidden
}
.new_cat button:hover{
    color: rgb(1, 41, 41);
    box-shadow: 10px 5px 20px 10px rgb(1, 41, 41);
}
.tablas{
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    width: 80%;
    max-height: 40%;
}
.ingresos{
    min-width: 20%;
    font-family: arial;
    border:1px solid rgb(0, 107, 107);
    border-radius: 10px;
    padding: 10px; 
    overflow:hidden   
}
.ingresos th{
    text-align: left;
   
}
.egresos{
    min-width: 20%;
    font-family: arial;
    border:1px solid rgb(0, 107, 107);
    border-radius: 10px;
    padding: 10px;       
    overflow:hidden
}
.egresos table{
    
    text-align: left;
}
.activos{
    min-width: 20%;
    font-family: arial;
    border:1px solid rgb(0, 107, 107);
    border-radius: 10px;
    padding: 10px;
    overflow:hidden    
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
    overflow:hidden   
}
.pasivos th{
    text-align: left;    
}
.inferior{
    display: flex;
    flex-direction: row;  
    justify-content: space-around;
    padding: 10px;      
    font-family: arial;
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

</style>