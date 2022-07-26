<template>  
    <b-container class="resume">
        <b-row >
            <b-col cols="1"></b-col>
            <b-col cols="3" class="header">
                <div class="name">
                    <h1>CARLOS CORTES SANCHEZ</h1>
                </div> 
                <div class="contact">
                    <li>+57 350 697 58 12</li>
                    <li>2020carloscortes@gmail.com</li>
                </div>
                <div class="divider">  
                    <p></p>              
                </div>
                <div class="highlights">
                    <h2>HIGHLIGHTS</h2>
                    <li>No University Degree</li>
                    <li>Good at Solving Problems and Decision Making</li>
                    <li>Efficiency and Constant Improvement</li>
                    <li>Compromised on achieving goals</li>
                    <li>Ability to keep self motivated</li>
                </div>
                <br>
                <div class="skills">
                    <h2>PROGRAMMING SKILLS</h2>
                    <li>Python - JavaScript</li>
                    <li>Tableau - Adv Excel - PostgreSQL</li>
                    <li>HTML - CCS - VueJs - Bootstrap</li>
                    <li>Github - Github Desktop - Git Bash</li>
                    <li>Visual Studio Code</li>
                    <li>Windows Shell - IOS Terminal</li>
                </div>
                <br>
                <div class="others">
                    <h2>OTHER SKILLS</h2>
                    <li>Cross Border E-Commerce (Exp:17yrs)</li>
                    <li>Google Ads / Analytics <a href="https://1drv.ms/b/s!ArVqQHHtMkNghDeg5swHQ6mKqAB0">Certificate</a></li>
                    <li></li>
                </div>
            </b-col>
            <b-col cols="1"></b-col>
            <b-col cols="6" class="right-box">
                <div class="education">
                    <div class="tittle">
                        <h2>PROGRAMMING STUDIES</h2>
                    </div>
                    <div class="subtittle"> 
                        <h3>Universidad Nacional De Colombia </h3>
                        <li>Diplomado de Habilidades en Programación</li>
                        <li>December 2020</li>
                        <li>600 hours</li>
                        <li> <a href="https://1drv.ms/b/s!ArVqQHHtMkNglyOy7TMK0XR4VaKC">Certificate</a> </li>
                    </div>
                </div>
                <div class="programming">
                    <div class="tittle">
                        <h2>PROGRAMMING EXPERIENCE</h2>
                    </div>
                    <div class="subtittle">
                        <h3> Web App "My Budget" (FullStack Project)</h3>
                    </div>
                    <b-row class="experience">  
                        <b-col cols="6" class="compo">
                            <li>Database:</li>
                            <li>Back-end:</li>
                            <p></p>
                            <li>Front-end:</li>
                        </b-col>
                        <b-col cols="6" class="tecno">
                            <li>PostgreSQL - Heroku hosted</li>
                            <li>FastAPI</li>
                            <li>Python</li>
                            <li>Vue JS</li>
                            <li>JavaScript</li>
                        </b-col> 
                    </b-row>
                    <br>
                    <b-row class="links"> 
                        <b-col>
                            <li> Take a look at: <a href="https://mybudgetvue.herokuapp.com/"> My_Budget </a></li>
                            <li>User: user</li>
                            <li>Pass: admin</li>
                        </b-col>
                        <b-col>
                            <li>Repositories:</li>
                            <li><a href="https://github.com/salicat/my_budget_back">Back-end</a> </li> 
                            <li><a href="https://github.com/salicat/my_budget_vue">Front-end</a> </li>
                        </b-col>
                    </b-row>
                </div>
                <div class="jobs">
                    <div class="tittle">
                        <h2>WORKING HISTORY</h2>
                    </div>
                    <div class="subtittle">
                        <h3>COVALTEC SAS | Feb 2020 - Present Day</h3>
                        <h3>Industrial Consultant / Owner</h3>
                    </div>
                    <div>
                        <li>Started just before Covid-19 Pandemic but succeed </li>
                        <li>Local and Foreing Trades</li>
                        <li>90% opertaions automated </li>
                    </div>
                    <div class="divider">  
                        <p></p>              
                    </div>
                    <div class="subtittle">
                        <h3>PRECISION PLASMA DE CORTE CNC SAS | Nov 2011 - Dec 2019</h3>
                        <h3>Technical Engineer</h3>
                    </div>
                    <div>
                        <li>Started from scratch, without knowledge on CNC or programming</li>
                        <li>Succesfuly design, fabricate and sold our own CNC machine</li>
                        <li>100% of machines sold still currently working</li>
                        <li>Second model sold to foreing company</li>
                        <li>Ended owning 50% of the company shares</li>
                        <li>Sold to start my own company</li>
                    </div>
                </div>
            </b-col>
            <b-col cols="1"></b-col>
        </b-row> 
    </b-container>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'


export default{
    components: {

    },
    name: 'CarlosCortes',
    data: function(){
            return {

            }
        }, 
    }
</script>
<style>
.resume{
    max-height: 80vh;
    overflow-y: scroll;
    font-family: sans-serif

}
.contact{
    text-align: left;
    line-height: 0.4;
}
.divider{
    background-color: black;
    width: 65%;
    height: 0.5%;
    margin-bottom: 2%;
}
.header{
    margin-top:1%;
    margin-bottom:1%;    
    color:rgb(97, 97, 97);
    background-color: rgb(207, 207, 207);
    padding: 2%;
}
.tittle{
    margin-top: 1%;
    padding: 1%;
    background-color:rgb(207, 207, 207);
    color: black;
}
.subtittle{
    padding-top: 2%;
}
.right-box{
    padding: 1%;
}
.experience, .links, .education, .contact{
    list-style-type: none; 
}
p{
    font-size: 1vw;
    line-height: 0vh;
}
li{
    line-height: 1.5;
    font-size: 1vw;
}
h1{
    font-size: 3vw;
    line-height: 0.9;
    font-style: bold;
    color: black;
}
h2{
    font-size: 2vw;
    color: black;
}
h3{
    font-size: 1.5vw;
}
</style>
