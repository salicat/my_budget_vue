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
                    <div class="chart1">
                        <pie-chart 
                            :donut="true" 
                            :data="[['Ingresos', incomes], ['Egresos', expenses]]"
                            :colors="[ '#79FF00', '#FF00D5']"
                            :library="{animation:{easing:'easeOutQuad'}, 
                            elements: {arc: {borderWidth: 0}}}"
                            >
                        </pie-chart>                                              
                        <p class="goo">Ing: ${{incomes}} </p>
                        <p class="bad">Egr: ${{expenses}}</p>
                        <h2 v-bind:class="{ goo: incomes > expenses,
                                            bad: expenses > incomes
                                            }">Balance ${{incomes - expenses}}</h2>
                        
                    </div>                
                    <div class="chart2">
                        <pie-chart 
                            :donut="true" 
                            :data="[['Activos', liabilities], ['Pasivos', passives]]"
                            :colors="[ '#00E8FF', '#FF8600']"
                            :library="{animation:{easing:'easeOutQuad'}, 
                            elements: {arc: {borderWidth: 0}}}"
                            >        
                   </pie-chart>  
                        <p class="act"> Activos: ${{liabilities}} </p>
                        <p class="pas"> Pasivos: ${{passives}} </p>
                        <h2 v-bind:class="{ act: liabilities > passives,
                                            pas:liabilities < passives
                                            }"> Patrimonio: ${{liabilities-passives}}</h2>
                    </div >            
                </div>                                        
                
            <div class="otrico">
                <div class="left">
                    <h1> Alerta de gastos </h1>
                    <div>
                        <p></p>
                    </div>                                  
                </div>
                <div class="right">
                    <h1> Pendientes de pago </h1>
                   
                </div>
            </div>
            
        </div>        
    </div>               
</template>

<script>
import axios from 'axios';
import Datepicker from 'vuejs-datepicker';
import Vue from 'vue'
import Chartkick from 'vue-chartkick'
import Chart from 'chart.js'

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
            btc : null, 
            date: new Date(2021, 3, 24),
            cats: [],
            regs: [],
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
        
        var month_cons = 1 + this.meses.indexOf(this.month);

        var data = {
            username    : this.$route.params.username,
            month       : month_cons
        }               
        
        let one = "https://mybudgetback.herokuapp.com/user/records/" + data.username 
        let two = "https://mybudgetback.herokuapp.com/user/cats/" + data.username
        
        const requestOne = axios.get(one)
        const requestTwo = axios.get(two)
        let self = this                
        axios
        .all([ requestOne, requestTwo ])
        .then(axios.spread((...responses) => {
            
            const responseOne = responses[0]            
            self.regs = responseOne.data                                            
            for (var i = 0; i < responseOne.data.length; i++){
                if ( responseOne.data[i].type == "incomes") {
                    this.incomes = this.incomes + responseOne.data[i].value;
                };
                if ( responseOne.data[i].type == "expenses") {
                    this.expenses = this.expenses + responseOne.data[i].value;
                };                                                                
            }
            
            const responseTwo = responses[1]       
            self.cats = responseTwo.data                      
            for (var j = 0; j < responseTwo.data.liabilities.length; j++){
                this.liabilities = this.liabilities + responseTwo.data.liabilities[j].value;       
            }
            for (var k = 0; k < responseTwo.data.passives.length; k++){
                this.passives = this.passives + responseTwo.data.passives[k].value
            }

        }))       
        .catch((error) => {
            alert(error);
        });        
    },       
    methods : {
        reload : function () {
            var month_cons = 1 + this.meses.indexOf(this.month);
            var data = {
                username    : this.$route.params.username,
                month       : month_cons
            }
            let self = this
            axios
            .post("https://mybudgetback.herokuapp.com/user/month_regs/", data)  
            .then((response) => {
                self.regs = response.data
                this.incomes = 0;
                this.expenses = 0;
                for (var j = 0; j < response.data.length; j++){
                if (response.data[j].type == "incomes") {
                    this.incomes = this.incomes + response.data[j].value;
                };
                if ( response.data[j].type == "expenses") {
                    this.expenses = this.expenses + response.data[j].value;
                };                                                                
            }
            })
            .catch((error) => {
                alert(data.username + " " + data.month)
                console.log(error.response.data);

            })        
        },
        price : function () {
            let self = this
            axios
            .get("https://api.coindesk.com/v1/bpi/currentprice.json")
            .then((response) => {
                self.btc = response.data.bpi.USD.rate_float
            })
        }           
    } 
}
</script>
<style>
.main{
    overflow-y: scroll;
    overflow: auto;
    max-height: 90vh; 
}

.barras{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.otrico{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
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
    width: 40%;    
    border:1px solid rgb(0, 107, 107);
    border-radius: 10px;
}
.right{
    width: 40%;
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