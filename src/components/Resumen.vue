<template>
    <div class="main">    
        <div class="selector"><div>
            <select v-model="month">                        
                <option selected> {{month}} </option>
                <option v-for="mes in meses" 
                        :key="mes" > {{mes}} </option>
            </select>
        </div>
        <div>
            <select v-model="anio">                        
                <option selected> {{curr_year}} </option>
                <option v-for="anio in anios" 
                        :key="anio" > {{anio}} </option>
            </select>
        </div>
            <button v-on:click="reload"> Consultar </button>
        </div>
        <div class="barras">   
            <div class="chart1" v-if="incomes||expenses != 0">
                <h2 v-bind:class="{ goo: incomes > expenses,
                    bad: expenses > incomes
                    }"
                    >Balance ${{Number(incomes - expenses).toLocaleString()}}
                </h2>
                <pie-chart                             
                    :donut="true" 
                    :data="[['Ingresos', incomes], ['Gastos', expenses]]"
                    :colors="[ '#79FF00', '#FF00D5']"
                    :library="{animation:{easing:'easeOutQuad'}, 
                    elements: {arc: {borderWidth: 0}}}"
                    >
                </pie-chart>                                                                         
            </div>
            <div class="gastorta" v-if="expenses > 0" >
                <h2> Distribucion de Gastos </h2>
                <pie-chart
                    :donut  ="false"
                    :data   ="exp_pie"
                    :colors ="['Red', 'orange', 'yellow', 'green', 'blue', 'purple', 'black', 'white', 'grey' ]"
                    :library="{animation:{easing:'easeOutQuart'},
                    elements: {arc: {borderWidth: 0},
                    }}"
                    >
                </pie-chart>
                <h1>${{Number(expenses).toLocaleString()}}</h1>
            </div>                                 
        </div>
            <div class="otrico">
                <div class="left">
                    <div class="left_title">
                        <h1> Gastos por Categoria </h1>
                    </div>
                    <div> 
                        <p v-bind:class="{  goo: expenses/gen_budget < 0.99999,
                                            act: expenses/gen_budget == 1,
                                            bad: expenses/gen_budget > 1                                
                        }"> 
                        Has gastado el {{Math.round(expenses/gen_budget*100)}}% 
                        de tu presupuesto: ${{Number(gen_budget).toLocaleString()}} </p> 
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
                        <div v-for="item in alertas" v-bind:key="item.name" >
                            <hr class="divider">                            
                            <div class="nombres" >
                                <div>{{item.name}}</div>
                                <div>{{Math.round(item.value/item.budget*100)}}%</div> 
                            </div>                            
                            <div class="progres" >
                                <div class="bar" v-if="item.value > 0">
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
                <div  class="right">
                    <div>
                        <h1> Pagos pendientes {{month}} {{anio}}</h1>                                  
                    </div>
                        <div class="cua_father" v-if="recurrents.length > 0">  
                        <div class="cuadraditos" v-for="item in recurrents" :key="item.name"
                                        v-bind:class="{pagok: item.value > 1,
                                        pagofail: item.value <= 0}">
                            <h3>{{item.category}} : ${{Number(item.budget).toLocaleString()}}</h3>
                            <h3>{{item.expires}}</h3>                                
                        </div> 
                    </div>
                    <div v-if="!recurrents.length > 0">
                        <h1> NO TIENES PAGOS RECURRENTES </h1>
                    </div>   
                </div>
            </div>
            <div>
                <h1> Rastreo por categoria </h1>
                <p>EN MANTENIMIENTO ;)</p>
                <select >
                    <option >
                    
                    </option>
                </select>
                <line-chart
                    :data="[['Ene', 690000], ['Feb', 1200000], ['Mar', 290000], ['Abril', 540000], ['Mayo', 1100000]]"
                    
                >
                </line-chart>
            </div> 
    </div>                      
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
            assets: 0,
            expenses: 0,
            balance: 0,
            liabilities: 0,
            passives: 0,
            incomes: 0,
            gen_budget : 0,
            cats: [],
            regs: [],
            alertas: [],
            recurrents: [],
            color_pie: [],
            curr_year : new Date().getFullYear(),
            curr_month : new Date().getMonth(),
            curr_day : undefined,
            month : undefined,
            months : [],
            exp_pie : [],
            anio : undefined,
            anios : [2021, 2022],
            meses : ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 
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
    }     
}
</script>
<style>
.main{
    width: 98%;
    overflow-y: scroll;
    overflow: auto;
    max-height: 85vh;  
}
.selector{
    position:fixed;
    z-index: 1;    
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}
.selector select{ 
    color:white;
    background-color: #000000;
}
.barras{
    font-family: arial;
    display: flex;
    width: auto;
    flex-direction:column;
    justify-content: center;
    padding-top: 2em;
    margin: 3%; 
}
.chart1{
    display: flex;
    flex-direction: column;
    align-items: center; 
    max-width: 70%;  
    padding: 10%; 
    border-radius: 10px;  
    box-shadow: 0 10px 25px rgba(0, 148, 148, 0.774);  
}
.gastorta{
    display: flex;
    flex-direction: column;
    align-content: center; 
    max-width: 85%;
    margin-top: 10%;
    padding: 3%;
    border-radius: 10px;  
    border:1px solid rgb(0, 107, 107); 
    box-shadow: 0 10px 25px rgba(0, 148, 148, 0.774);  
}
.otrico{
    font-family: arial;    
    display: flex;
    margin: 2%;
    flex-direction: column;    
    padding-top: 1em;
    padding-bottom: 2em;        
}
.nombres{
    font-size: 0.8em;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-top: 2em;
}
.progres{
    font-family: arial;
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
    color: rgb(254, 167, 129);
    position: absolute;
    top: 1px; left: 1px; right: 1px;
    display: block;
    height: 100%;
    border-radius: 15px;
    background-color:#00E8FF;
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
    background-size: 25px 25px;
}
.left{    
    width: 90%;
    padding: 2%;
    height: auto;
    border-radius: 10px;         
    box-shadow: 0 10px 25px rgba(0, 148, 148, 0.774);  
}
.left_title{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.left_title select{
    color:white;
    background-color: #000000;
}
.right{
    padding: 1em;
    margin-top: 10%;
    min-width: 85%;
    border:1px solid rgb(0, 107, 107);
    border-radius: 10px;        
    box-shadow: 0 10px 25px rgba(0, 148, 148, 0.774);       
}
.divider{
    width: 90%;
    border-color: rgba(0, 148, 148, 0.774);
}  
.cua_father{
    display: grid;
    grid-template-columns: 30% 30% 30%;
    gap: 10px;
} 
.cuadraditos{
    padding: 1em;
    margin-top: 5px;
    max-width: 80%;        
}
.pagok{     
    text-align: center;
    background-color: #79FF00;
    font-size: 0.8em;
    color: rgb(0, 0, 0);
    border-radius: 60px; 
}
.pagofail{
    text-align: center;
    background-color: #FF00D5;
    font-size: 0.8em;
    color: rgb(0, 0, 0);
    border-radius: 60px; 
}

.pagos h3, p{
    margin-left: 30px;
}
.exp_cat{
    padding-top: 1em;
}
.right{
    width: 48%;
}
.goo{
    color: #79FF00;
}
.maso{
    color:#fbff00;
}
.bad{
    color: #FF00D5;
}
.act{
    color: #00E8FF; 
}
.pas{
    color:#FF8600;
}

@media screen and (min-width: 480px) {

.main{    
    font-family: arial;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow-y: scroll;
    overflow: auto;
    max-height: 85vh; 
}
.selector select{
    color:white;
    background-color: black;
}
.barras{    
    width: 95%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.chart1{ 
    min-width: 95%;       
    font-size: 1em;
    display: flex;
    flex-direction: column;
    justify-items: center;
    border:1px solid rgb(0, 107, 107);
    border-radius: 10px;    
    width: 45%;
    padding: 1em;    
}
.gastorta{
    margin-top: 0;
    max-width: 90%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border:1px solid rgb(0, 107, 107);
    border-radius: 10px;
    width: 45%;
    padding: 1em;
}
.otrico{    
    font-size: 1em;
    margin-left: 2%;
    padding-top:2em;
    width: 95%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.left{
    padding: 1em;
    min-width: 45%;
    border:1px solid rgb(0, 107, 107);
    border-radius: 10px;           
}
.left_title{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.left_title select{
    color:white;
    background-color: #000000;
    max-height: 30px;
}
.exp_cat{
    overflow-y: scroll;
    overflow: auto;
    max-height: 40vh;            
}
.nombres{    
    padding-top:1em;
    color: white;
}
.right{
    padding: 1em;
    margin-top: 0;
    margin-left: 5%;
    min-width: 45%;
    border:1px solid rgb(0, 107, 107);
    border-radius: 10px;    
}
.cuadraditos{
    width: 100%;    
    overflow-y: scroll;
    overflow: auto;
    max-height: 40vh;        
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.progres{
    font-family: arial;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.bar{
    width: 80%;
}
.divider{
    width: 90%;
    border-block-color: rgba(255, 255, 255, 0.411);
}
.pagos{
    display: flex;
    flex-direction: column;   
    width:50%;
    font-size: 1em;
    color: rgb(0, 0, 0);
    border-radius: 60px; 
}
.pagos h3, p{
    margin-left: 30px;
}
.goo{
    color: #79FF00;
}
.bad{
    color: #FF00D5;
}
.act{
    color: #00E8FF; 
}
.pas{
    color:#FF8600;
}
}
</style>
