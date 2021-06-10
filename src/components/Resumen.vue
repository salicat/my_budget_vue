<template>
    <div id="Resumen">
        <div class="main">    
                <div class="selector">
                    <select v-on:change="reload" v-model="month">                        
                        <option selected> {{month}} </option>
                        <option v-for="mes in meses" 
                                :key="mes" > {{mes}} </option>
                    </select>
                </div>
            <div class="barras">                
                    <div class="chart1" v-if="incomes||expenses != 0">
                        <h2 v-bind:class="{ goo: incomes > expenses,
                                            bad: expenses > incomes
                                            }">Balance ${{Number(incomes - expenses).toLocaleString()}}</h2>
                        <pie-chart                             
                            :donut="true" 
                            :data="[['Ingresos', incomes], ['Egresos', expenses]]"
                            :colors="[ '#79FF00', '#FF00D5']"
                            :library="{animation:{easing:'easeOutQuad'}, 
                            elements: {arc: {borderWidth: 0}}}"
                            >
                        </pie-chart>                                                                         
                    </div>                
                    <div class="chart2" v-if="liabilities||passives != 0"                             > 
                        <h2 v-bind:class="{ act: liabilities > passives,
                                            pas:liabilities < passives
                                            }"> Patrimonio: ${{Number(liabilities-passives).toLocaleString() }}</h2>
                        <pie-chart
                            :donut="true" 
                            :data="[['Activos', liabilities], ['Pasivos', passives]]"
                            :colors="[ '#00E8FF', '#FF8600']"
                            :library="{animation:{easing:'easeOutQuad'}, 
                            elements: {arc: {borderWidth: 0}}}"
                            >        
                        </pie-chart>                          
                    </div >            
                </div>                
            <div class="otrico">
                <div class="left">
                    <h1> Gastos por Categoria </h1>
                    <div> 
                        <p v-bind:class="{   goo: expenses/gen_budget < 0.99999,
                                                    act: expenses/gen_budget == 1,
                                                    bad: expenses/gen_budget > 1                                
                            }"> 
                            Has gastado el {{Math.round(expenses/gen_budget*100)}}% 
                            de tu presupuesto: ${{Number(gen_budget).toLocaleString()}} </p> 
                        
                    </div>
                    <div  v-if="alertas.length > 0" class="exp_cat" >                    
                        <div v-for="item in alertas" v-bind:key="item.name" >
                            <hr class="divider">                            
                            <div class="nombres">
                                <div>{{item.name}}</div>
                                <div>{{Math.round(item.value/item.budget*100)}}%</div>                                    
                            </div>                            
                            <div class="progres">
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
                <div class="right" >
                    <h1> Pagos pendientes {{month}} </h1>                                  
                    <div class="cuadraditos" v-if="recurrents.length > 0">
                        <div v-for="item in recurrents" :key="item.name">
                            <div v-if="item.value < 1" class="pagos">
                                <h3>{{item.category}} : ${{Number(item.budget).toLocaleString()}}</h3>
                                <p>{{item.expires}}</p>                                
                            </div> 
                        </div>                                         
                    </div>
                </div>
            </div>
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
            date: new Date(2021, 3, 24),
            cats: [],
            regs: [],
            alertas: [],
            recurrents: [],
            month : undefined,
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
        
        var month_cons = this.meses.indexOf(this.month) + 1;

        var data = {
            username    : this.$route.params.username,
            month       : month_cons
        }               
        
        let one     = "https://mybudgetback.herokuapp.com/user/records/" + data.username
        let two     = "https://mybudgetback.herokuapp.com/user/cats/" + data.username
        let three   = "https://mybudgetback.herokuapp.com/user/month_regs/"+ data.username + "/" +  data.month
        let four    = "https://mybudgetback.herokuapp.com/user/cats/" + data.username + "/" + data.month
        
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
            }
            self.alertas = responseFour.data.sort(function(a,b){return b.value - a.value});

        }))       
        .catch((error) => {
            alert(error);
        });        
    },       
    methods : {
        reload : function () {            
          
            var new_month = this.meses.indexOf(this.month) + 1;             

            var datos = {
                username    : this.$route.params.username,
                month       : new_month
            }

            let one     = "https://mybudgetback.herokuapp.com/user/records/" + datos.username
            let two     = "https://mybudgetback.herokuapp.com/user/month_regs/"+ datos.username + "/" +  datos.month
            let four    = "https://mybudgetback.herokuapp.com/user/cats/" + datos.username + "/" + datos.month
   
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
                    if (mes(responseOne.data[l].date) == new_month) {
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
            self.alertas = responseFour.data.sort(function(a,b){return b.value - a.value});
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
    max-height: 80vh;    
}
.selector{
    position:fixed;
    z-index: 1;    
}
.selector select{    
    color:white;
    background-color: #000000;
}
.barras{
    font-family: arial;
    display: flex;
    flex-direction:column;
    justify-content: space-evenly;    
    padding-top: 1em;           
    width: 90%;
}
.chart1{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: left;    
    padding-bottom: 1em; 
}
.chart2{    
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: left;    
    padding-bottom: 1em; 
}
.otrico{
    font-family: arial;    
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-top: 1em;
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
    color: black;
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
    width: 80%;
    padding: 5px;
    border:1px solid rgb(0, 107, 107);
    border-radius: 10px;     
}
.right{
    width: 80%;
    padding: 15px;
    border:1px solid rgb(0, 107, 107);
    border-radius: 10px;         
}
.divider{
    width: 90%;
    border-block-color: rgba(0, 107, 107, 0.411);
}
.cuadraditos{
    width: 100%;
    padding-top: 1em;
    font-display: flex;
    align-content: center;
}
.pagos{    
    display: flex;
    flex-direction: column;    
    background-color: #b40196;
    width:90%;
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

@media screen and (min-width: 500px) {
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
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}
.chart1{
    display: flex;
    flex-direction: column;
    justify-items: center;
    border:1px solid rgb(0, 107, 107);
    border-radius: 10px;    
    width: 45%;
}
.chart2{
    display: flex;
    flex-direction: column;
    justify-content: center;
    border:1px solid rgb(0, 107, 107);
    border-radius: 10px;
    width: 45%;
}
.otrico{
    padding-top:2em;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}
.left{
    width: 45%;
    border:1px solid rgb(0, 107, 107);
    border-radius: 10px;            
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
    width: 45%;
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
    background-color: #b40196;    
    width:50%;
    font-size: 0.8em;
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