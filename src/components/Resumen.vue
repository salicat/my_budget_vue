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
                        <pie-chart                             
                            :donut="true" 
                            :data="[['Ingresos', incomes], ['Egresos', expenses]]"
                            :colors="[ '#79FF00', '#FF00D5']"
                            :library="{animation:{easing:'easeOutQuad'}, 
                            elements: {arc: {borderWidth: 0}}}"
                            >
                        </pie-chart>                         
                        <h2 v-bind:class="{ goo: incomes > expenses,
                                            bad: expenses > incomes
                                            }">Balance ${{incomes - expenses}}</h2>
                        
                    </div>                
                    <div class="chart2" v-if="liabilities||passives != 0"                             > 
                        <pie-chart
                            :donut="true" 
                            :data="[['Activos', liabilities], ['Pasivos', passives]]"
                            :colors="[ '#00E8FF', '#FF8600']"
                            :library="{animation:{easing:'easeOutQuad'}, 
                            elements: {arc: {borderWidth: 0}}}"
                            >        
                   </pie-chart>  
                        <h2 v-bind:class="{ act: liabilities > passives,
                                            pas:liabilities < passives
                                            }"> Patrimonio: ${{liabilities-passives}}</h2>
                    </div >            
                </div>                
            <div class="otrico">
                <div class="left">
                    <h1> Gastos por Categoria </h1>
                    <div  v-if="alertas.length > 0" class="exp_cat" >                    
                        <div v-for="item in alertas" v-bind:key="item.name">
                            <div class="nombres">
                                <div>{{item.name}}</div>
                                <div>{{Math.round(item.value/item.budget*100)}}%</div>
                            </div>
                            <div class="bar" >                                
                                <div v-bind:class="{perce_goo: item.value/item.budget < 0.9999,
                                                    perce_bad: item.value/item.budget > 1

                                }" 
                                :style="{width: (item.value/item.budget*100)+'%'}">
                                </div>                                          
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <h1> Pagos Recurrentes </h1>                                  
                    <div class="cuadraditos">
                    <div v-for="item in recurrents" :key="item.name" >
                        <div v-if="item.value < item.budget" class="pagos">
                            <h3>{{item.category}} : ${{item.budget}}</h3>                                
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
            self.recurrents = responseThree.data                
           
            const responseFour = responses[3]
            self.alertas = responseFour.data


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
                self.recurrents = responseTwo.data               

                const responseFour = responses[2]
                self.alertas = responseFour.data              

            }))                       
    
        },
    }     
}
</script>
<style>
.main{
    overflow-y: scroll;
    overflow: auto;
    max-height: 80vh;    
}
.barras{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.otrico{
    font-family: arial;    
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}
.nombres{
    font-size: 0.8em;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.bar{
    position: relative;
    width: 100%;
    height: 25px;
    border-radius: 15px;
    overflow: hidden;
    border-bottom: 1px solid rgb(0, 107, 107);
}
.perce_goo {
    position: absolute;
    top: 1px; left: 1px; right: 1px;
    display: block;
    height: 100%;
    border-radius: 15px;
    background-color:#09ff00;
    background-size: 25px 25px;
}
.perce_bad{    
    position: absolute;
    top: 1px; left: 1px; right: 1px;
    display: block;
    height: 100%;
    border-radius: 15px;
    background-color:#ff0000;
    background-size: 25px 25px;
}
.left{
    overflow-y: scroll;
    overflow: auto;
    max-height: 90vh; 
    width: 80%;
    padding: 5px;    
}
.right{
    overflow-y: scroll;
    overflow: auto;
    max-height: 90vh; 
    padding: 15px;
}
.cuadraditos{
    padding-top: 1em;
    font-display: flex;
    align-content: center;
}
.pagos{
    color: rgb(255, 255, 255);
    border:1px rgb(0, 107, 107);
    border-radius: 10px;        
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


@media screen and (min-width: 700px) {
.main{    
    font-family: arial;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow-y: scroll;
    overflow: auto;
    max-height: 85vh; 
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
    padding: 2px;
}
.pagos{
    background-color: #9fa10c;
    width:auto;
    color: rgb(255, 255, 255);
    border:1px solid rgb(0, 107, 107);
    border-radius: 20px;                    
}
.pagos h3, p{
    margin-left: 10px;
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