<template>
    <b-container fliud class="main">
        <b-modal ref="wellcome" hide-header content-class="modal">
            <div >
                <p>Acá podras ver graficos e historial de tus gastos en meses anteriores</p>
                <p> Primero debes crear tus categorias y luego registrar gastos</p>
                <b-row>
                    <b-col cols="4">
                        <b-button v-on:click="go_to_cats" size="sm"> Ir a Categorias </b-button>
                    </b-col>
                    <b-col cols="4"></b-col>
                    <b-col cols="4">
                        <b-button v-on:click="go_to_registers" size="sm"> Ir a Registros</b-button>
                    </b-col>
                </b-row> 
            </div>
        </b-modal>
        <b-row align-h="between">
            <b-col cols="4" sm="3" style="border-radius: 10px;
                                    padding: 1%; 
                                    border:1px solid rgb(0, 107, 107);">
                <b-col cols=8>
                    <b-form-select v-model="month" style="background-color:black; color: white;">                        
                        <option selected> {{month}} </option>
                        <option v-for="mes in meses" 
                                :key="mes" > {{mes}} </option>  
                    </b-form-select>   
                </b-col>
                <b-col cols=8>
                    <select v-model="anio" style="background-color:black; color: white;">                        
                        <option selected> {{curr_year}} </option>
                        <option v-for="anio in anios" 
                                :key="anio" > {{anio}} </option>
                    </select>
                </b-col>
                <b-col cols=8>
                    <b-button variant="dark" v-on:click="reload" > Consultar </b-button>
                </b-col>
            </b-col>
            <b-col cols="7"> 

            </b-col>
        </b-row>
        <b-row > 
            <b-col cols="10" class="mx-auto" sm="7" style="border-radius: 10px;
                                            margin-top: 3%;  
                                            padding: 3%; 
                                            border:1px solid rgb(0, 107, 107);">   
                <div v-if="expenses < 1">
                    <p> No tienes registro de gastos en este mes </p>
                    <p>regs {{regs}} recurrents:{{recurrents}} alertas:{{alertas}}</p> 
                </div> 
                <div class="gastorta" v-if="expenses > 0" >
                    <h2 class="act"> Distribucion de Gastos </h2>
                    <pie-chart
                        :donut  ="false"
                        :data   ="exp_pie"
                        :colors ="['Red', 'orange', 'yellow', 'green', 'blue', 'purple', 'black', 'white', 'grey' ]"
                        :library="{animation:{easing:'easeOutQuart'},
                        elements: {arc: {borderWidth: 0},
                        }}"
                        >
                    </pie-chart>
                    <h1>Gasto del mes: ${{Number(expenses).toLocaleString()}}</h1>
                </div>
            </b-col>
            <b-col cols="10" class="mx-auto" sm="4" style="border-radius: 10px;  
                                            margin-top: 3%;
                                            padding: 3%;
                                            border:1px solid rgb(0, 107, 107);">
                <div v-if="incomes||expenses == 0">
                    <p>Aca podrás ver el grafico de Ingresos VS Egresos </p>
                </div>
                <div class="right">
                    <div v-if="incomes||expenses != 0" >
                        <h2 >Ingresos Vs Egresos</h2>
                        <pie-chart                             
                            :donut="true" 
                            :data="[['Ingresos', incomes], ['Gastos', expenses]]"
                            :colors="[ '#79FF00', '#FF00D5']"
                            :library="{animation:{easing:'easeOutQuad'}, 
                            elements: {arc: {borderWidth: 0}}}"
                            >
                        </pie-chart>                                  
                        <h1 v-bind:class="{ goo: incomes > expenses,
                                            bad: expenses > incomes
                            }"
                            >Balance ${{Number(incomes - expenses).toLocaleString()}}
                        </h1>                                       
                    </div>    
                </div>
            </b-col>
        </b-row>      
        <b-row >
            <b-col cols="10" class="mx-auto" sm="5" style="border-radius: 10px;
                                            padding: 3%;  
                                            margin-top: 3%;
                                            border:1px solid rgb(0, 107, 107); ">
                    <div v-if="recurrents.length < 1">
                        <p> Acá se visualizarán tus compromisos mensuales</p>
                    </div>
                    <b-col cols="12">
                        <div v-if="recurrents.length > 0">
                            <h1> Pagos pendientes {{month}} {{anio}}</h1>                                   
                        </div>
                        <b-row v-if="recurrents.length > 0">  
                            <b-col cols="5" lg="5"  style=" padding:3%;
                                                            margin: 3%;
                                                            font-size: 0.8em;"
                                                    v-for="item in recurrents" :key="item.name"
                                                    v-bind:class="{pagok: item.value > 1,
                                                        pagofail: item.value <= 0}">
                                <p style="font-weight:bold;">
                                    {{item.category}} : ${{Number(item.budget).toLocaleString()}}
                                </p>
                                <p style="font-size:0.8em;">
                                    {{item.expires}}
                                </p>                                
                            </b-col> 
                        </b-row>
                    </b-col>
            </b-col>
            <b-col cols="10" class="mx-auto" sm="6" style="border-radius: 10px;  
                                            margin-top: 3%;
                                            padding: 3%;
                                            border:1px solid rgb(0, 107, 107);
                                            max-height:100vh;
                                            overflow-y:scroll; 
                                            overflow:auto;">
                <div v-if="alertas.length < 1">
                    <p> Aca podrás ver el progreso de tus gastos por categoria</p>
                </div>
                <div class="left" v-if="alertas.length != 0">
                    <div class="left_title" >
                        <h1> Gastos por Categoria </h1>
                    </div>
                    <div> 
                        <p v-bind:class="{  goo: expenses/gen_budget < 0.99999,
                                            act: expenses/gen_budget == 1,
                                            bad: expenses/gen_budget > 1                                
                        }"> 
                        Has gastado el {{Math.round(expenses/gen_budget*100)}}% 
                        de tu presupuesto de ${{Number(gen_budget).toLocaleString()}} </p> 
                        <p> Presupuesto restante: ${{Number(gen_budget-expenses).toLocaleString()}}</p>
                        <p> Gasto promedio por dia: ${{Number(expenses/curr_day).toLocaleString("en", {   
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            })}}</p>
                        <p> Tu presupuesto se agotará en  
                            {{Number((gen_budget-expenses)/(expenses/curr_day)).toLocaleString("en", {   
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            })}} dias </p>
                    </div>
                    <div class="exp_cat" >                    
                        <div v-for="item in alertas" v-bind:key="item.name" v-if="item.value > 0">
                            <hr class="divider">                            
                            <div class="nombres">
                                <div>{{item.name}}</div>
                                <div>{{Math.round(item.value/item.budget*100)}}%</div> 
                            </div>                            
                            <div class="progres" >
                                <div class="bar" >
                                    <div v-bind:class="{perce_goo: item.value/item.budget < 0.9999,
                                                        perce_ok: item.value/item.budget == 1,
                                                        perce_bad: item.value/item.budget > 1}"  
                                                        :style="{
                                                        width: (item.value/item.budget*100)+'%'}"> 
                                        ${{Number(item.value).toLocaleString()}}
                                    </div>                                                                                                           
                                </div>
                                <div class="budget">
                                    <p> ${{Number(item.budget).toLocaleString()}} </p>
                                </div>                                                                
                            </div>
                        </div>
                    </div>
                </div>
            </b-col>         
        </b-row>
        
    </b-container>                      
</template>

<script>
import axios from 'axios';
import Datepicker from 'vuejs-datepicker';
import Vue from 'vue'
import Chart from 'chart.js'
import VueChartkick from 'vue-chartkick'

Vue.use(Chartkick.use(Chart))


export default {
    components: {
        Datepicker
    },    
    name: 'Resumen',
    data: function (){
        return {
            assets      : 0,
            expenses    : 0,
            balance     : 0,
            liabilities : 0,
            passives    : 0,
            incomes     : 0,
            gen_budget  : 0,
            cats        : [],
            regs        : [],
            alertas     : [],
            recurrents  : [],
            color_pie   : [],
            curr_year   : new Date().getFullYear(),
            curr_month  : new Date().getMonth(),
            curr_day    : undefined,
            month       : undefined,
            months      : [],
            exp_pie     : [],
            anio        : undefined,
            anios       : [2021, 2022],
            meses       : ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 
                            'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 
                            'Noviembre', 'Diciembre']                        
        }
    },
    created: function(){                       

        const today = new Date()
        today.toLocaleString('default', { month: 'long' })
        
        var n = today.getMonth();
        this.month = this.meses[n]

        var y = today.getFullYear();
        this.anio = y

        var d = String(today.getDate()).padStart(2, '0');
        this.curr_day = d

        var month_cons = this.meses.indexOf(this.month) + 1;

        var data = {
            username    : this.$route.params.username,
            year        : this.anio,
            month       : month_cons
        }               
        
        let one     = "https://mybudgetback.herokuapp.com/user/month_records/" + data.username + "/" + data.year + "/" + data.month
        let two     = "https://mybudgetback.herokuapp.com/user/cats/" + data.username
        let three   = "https://mybudgetback.herokuapp.com/user/month_regs/"+ data.username + "/" +  data.year + "/" + data.month
        let four    = "https://mybudgetback.herokuapp.com/user/cats/" + data.username + "/" + data.year + "/" + data.month
        
        const requestOne    = axios.get(one)
        const requestTwo    = axios.get(two)
        const requestThree  = axios.get(three)
        const requestFour   = axios.get(four)

        let self = this                
        axios
        .all([ requestOne, requestTwo, requestThree, requestFour ])
        .then(axios.spread((...responses) => {                       
            const responseOne = responses[0]                                        
            
            const mes = function(date){
                let fecha = date.split("-");
                return fecha[1]
            }            
            for (var i = 0; i < responseOne.data.length; i++){                
                if (mes(responseOne.data[i].date) == month_cons) {                    
                    if ( responseOne.data[i].type == "incomes") {
                    this.incomes = this.incomes + responseOne.data[i].value;
                };
                if ( responseOne.data[i].type == "expenses") {
                    this.expenses = this.expenses + responseOne.data[i].value;
                };
                }                                                                                 
            }       
            const ano = function (odate){
                let anof = odate.split("-")
                return "" +anof[0] +"-"+ anof[1]
            }
            for(var m = 0; m < responseOne.data.length; m++){
                self.months = ano(responseOne.data[m].date)
            }
            const responseTwo = responses[1]                  
            for (var j = 0; j < responseTwo.data.liabilities.length; j++){
                this.liabilities = this.liabilities + responseTwo.data.liabilities[j].value;       
            }
            for (var k = 0; k < responseTwo.data.passives.length; k++){
                this.passives = this.passives + responseTwo.data.passives[k].value
            }        
            const responseThree = responses[2]
            var estemes = month_cons.toString()                
            var actualiza = function(date){
                var fecha = date.split("-");
                fecha[1] = "0"+estemes;                
                var actualizada = fecha[0]+"-"+fecha[1]+"-"+fecha[2];                
                return actualizada;                                 
            }
            for (var l = 0; l < responseThree.data.length; l++) {                
                if (mes(responseThree.data[l].expires) < month_cons) {
                    responseThree.data[l].expires = actualiza(responseThree.data[l].expires)                                        
                }                
                self.recurrents[l] = responseThree.data[l]
            }       
            const responseFour = responses[3]
                for (var b = 0; b < responseFour.data.length; b++){
                this.gen_budget = this.gen_budget + responseFour.data[b].budget;
                    self.alertas[b] = responseFour.data[b]
                    if (this.alertas[b].value > 0) {
                        self.exp_pie[b] = [this.alertas[b].name, this.alertas[b].value]           
                    }
                }
                for (var f = 0; f < this.exp_pie.length; f++ ) {
                    this.color_pie.push('#'+Math.floor(Math.random()*16777215).toString(16));
                }
                this.$refs.wellcome.focus
        })) 
        .catch((error) => {
            alert(error);
        });        
    },       
    methods : {
        reload : function () {
            this.exp_pie = []
            const today = new Date()
            today.toLocaleString('default', { month: 'long' })
            var new_month = today.getMonth(); 
            var month_cons = this.meses.indexOf(this.month) + 1;

            var datos = {
                username    : this.$route.params.username,
                year        : this.anio,
                month       : month_cons
            }

            let one     = "https://mybudgetback.herokuapp.com/user/month_records/" + datos.username + "/" + datos.year + "/" + datos.month
            let two     = "https://mybudgetback.herokuapp.com/user/month_regs/"+ datos.username + "/" + datos.year + "/" +  datos.month
            let four    = "https://mybudgetback.herokuapp.com/user/cats/" + datos.username + "/" +datos.year + "/" + datos.month
   
            const requestOne    = axios.get(one)
            const requestTwo    = axios.get(two)
            const requestFour   = axios.get(four)
            
            let self = this                
            axios
            .all([ requestOne, requestTwo, requestFour])
            .then(axios.spread((...responses) => {                
                const mes = function(date){
                    let fecha = date.split("-");
                    return fecha[1]
                    }                
                const responseOne = responses[0]  
                this.expenses =  0;
                this.incomes = 0;
                for (var l = 0; l < responseOne.data.length; l++){
                    if (mes(responseOne.data[l].date) == month_cons) {
                        if (responseOne.data[l].type == "incomes") {
                        this.incomes = this.incomes + responseOne.data[l].value;
                        };
                        if ( responseOne.data[l].type == "expenses") {
                            this.expenses = this.expenses + responseOne.data[l].value;
                        };
                    }                                                               
            }
            const responseTwo = responses[1]
            var estemes = new_month.toString()                
            var actualiza = function(date){
                var fecha = date.split("-");
                fecha[1] = "0"+estemes;                
                var actualizada = fecha[0]+"-"+fecha[1]+"-"+fecha[2];                
                return actualizada;                                 
            }
            for (var l = 0; l < responseTwo.data.length; l++) {                
                if (mes(responseTwo.data[l].expires) < new_month) {
                    responseTwo.data[l].expires = actualiza(responseTwo.data[l].expires)
                }                
                self.recurrents[l] = responseTwo.data[l]
            }        
            const responseFour = responses[2]
            this.gen_budget = 0;
                for (var b = 0; b < responseFour.data.length; b++){
                    this.gen_budget = this.gen_budget + responseFour.data[b].budget;
                }    
                self.alertas = responseFour.data
            for (var r = 0; r < this.alertas.length; r++){
                if (this.alertas[r].value > 0) {
                        self.exp_pie[r] = [this.alertas[r].name, this.alertas[r].value]           
                    }
            }
            }))                           
        },
        go_to_cats: function () {
            if (this.$route.name != "Categorias") {
            let username = localStorage.getItem("current_username")
            this.$router.push({name: "Categorias", params: {username: username}});                
            this.open = false;
            }
        },
        go_to_registers: function () {
            if (this.$route.name != "Registros"){
                let username = localStorage.getItem("current_username")
                this.$router.push({name: "Registros", params: {username: username}});
                this.open = false;
            }
        }
    }     
}
</script>
<style>
body{
    background-color: black;
}
.modal{
    background-color: black;
    color: white;
    padding: 3%; 
    border:1px solid rgb(0, 107, 107);
}
.nombres{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-top: 2em;
}
.progres{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.bar{
    position: relative;
    width: 80%;
    height: 25px;
    border-radius: 15px;
    overflow: hidden;
    border-bottom: 1px solid rgb(0, 107, 107);
}
.perce_goo {
    color: rgba(255, 69, 2, 0.692);
    position: absolute;
    top: 1px; left: 1px; right: 1px;
    display: block;
    height: 100%;
    border-radius: 15px;
    background-color:#00E8FF;
    background-size: 25px 25px;
}
.perce.maso{
    color: rgb(255, 226, 226);
    position: absolute;
    top: 1px; left: 1px; right: 1px;
    display: block;
    height: 100%;
    border-radius: 15px;
    background-color:#ff7700;
    background-size: 25px 25px;
}
.perce_ok{
    color: black;
    position: absolute;
    top: 1px; left: 1px; right: 1px;
    display: block;
    height: 100%;
    border-radius: 15px;
    background-color:#09ff00;
    background-size: 25px 25px;
}
.perce_bad{    
    color: white;
    position: absolute;
    top: 1px; left: 1px; right: 1px;
    display: block;
    height: 100%;
    border-radius: 15px;
    background-color:#ff0000;
    box-shadow: 10px 10px 25px rgb(255, 0, 0);
    background-size: 25px 25px;
}
.pagok{     
    text-align: center;
    background-color: #79FF00;
    color: rgb(0, 0, 0);
    border-radius: 60px; 
}
.pagofail{
    text-align: center;
    background-color: #FF00D5;
    color: white;
    border-radius: 60px; 
}
.goo{
    color: #79FF00;
}
.bad{
    color: #FF00D5;
    font-weight: bold;
}
.act{
    color: #00E8FF; 
}
.pas{
    color:#FF8600;
}
</style>
