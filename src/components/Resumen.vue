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
                <div class="left" v-if="alertas.length > 0">
                    <h1> Gastos por Categoria </h1>
                        <table border="1px">
                            <thead>
                                <tr class = "columns">                    
                                    <th> Categoria </th>
                                    <th> Presupuesto </th>
                                    <th> Gasto del mes </th>
                                </tr >
                            </thead>
                            <tbody>
                                <tr v-for="item in alertas" v-bind:key="item.name"
                                    :style="{color: item.value > item.budget ? '#FF00D5' : '#05ff19'}">     
                                    <td> {{item.name}}</td>                                      
                                    <td> ${{item.budget}}</td>
                                    <td> ${{item.value}}</td>                           
                                </tr>
                            </tbody>
                        </table>                                                              
                    <div>
                        <!--
                        <column-chart 
                            :data="alertas"
                            :colors="[ '#79FF00', '#FF00D5']"
                            :library="{animation:{easing:'easeOutQuad'}, 
                            elements: {arc: {borderWidth: 0}}}"
                            >
                        </column-chart>
                        -->
                    </div>                                  
                </div>
                <div class="right">
                    <h1> Pagos Recurrentes </h1>                                  
                    <div v-for="item in recurrents" :key="item.name">
                        <div class="cuadraditos" v-if="item.value < item.budget">
                            <h3>{{item.category}} : ${{item.budget}}</h3>                                
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

}

.barras{
    height: 50%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.otrico{
    height:50%;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}
.left{
    overflow-y: scroll;
    overflow: auto;
    max-height: 50vh; 
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


@media screen and (min-width: 700px) {
.main{    
    font-family: arial;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow-y: scroll;
    overflow: auto;
    max-height: 150vh; 
}
.selector{

}
.barras{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}
.cuadraditos{
    background-color: yellow;
    color: black;
    border:1px solid rgb(0, 107, 107);
    border-radius: 10px;    
}

.chart1{
    display: flex;
    flex-direction: column;
    justify-items: center;
    border:1px solid rgb(0, 107, 107);
    border-radius: 10px;    
}
.chart2{
    display: flex;
    flex-direction: column;
    justify-content: center;
    border:1px solid rgb(0, 107, 107);
    border-radius: 10px;
}
.otrico{
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
.right{
    width: 45%;
    border:1px solid rgb(0, 107, 107);
    border-radius: 10px;
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