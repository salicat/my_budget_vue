<template>  
    <div class="resume">
        <div class="header">
            <div class="name">
                <h1>CARLOS CORTES SANCHEZ</h1>
            </div> 
            <div class="contact">
                <p>+57 350 6 97 58 12</p>
                <p>2020carloscortes@gmail.com</p>
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
                <li>PostgreSQL - Python - JavaScript</li>
                <li>Tableau - VueJs - Wordpress</li>
                <li>HTML - CCS</li>
                <li>Git - Github - Github Desktop</li>
                <li>Visual Studio Code</li>
                <li>Windows - Bash Shell - Gitbash</li>
            </div>
            <br>
            <div class="others">
                <h2>OTHER SKILLS</h2>
                <li>Cross Border E-Commerce (Exp:17yrs)</li>
                <li>Google Ads / Analytics <a href="https://1drv.ms/b/s!ArVqQHHtMkNghDeg5swHQ6mKqAB0">Certificate</a></li>
                <li></li>
            </div>
        </div>
        <div class="right-box">
            <div class="education">
                <div class="tittle">
                    <h2>PROGRAMMING STUDIES</h2>
                </div>
                <div class="subtittle"> 
                    <h2>Universidad Nacional De Colombia </h2>
                    <p>Diplomado de Habilidades en Programación</p>
                    <p>December 2020</p>
                    <p>600 hours</p>
                    <br>
                    <p> <a href="https://1drv.ms/b/s!ArVqQHHtMkNglyOy7TMK0XR4VaKC">Certificate</a> </p>
                </div>
            </div>
            <div class="programming">
                <div class="tittle">
                    <h2>PROGRAMMING EXPERIENCE</h2>
                </div>
                <div class="subtittle">
                    <h3> Web App "My Budget" </h3>
                </div>
                <div class="experience">  
                    <div class="compo">
                        <p>Database:</p>
                        <p>Back-end:</p>
                        <br>
                        <p>Front-end:</p>
                    </div>
                    <div class="tecno">
                        <p>PostgreSQL - Heroku hosted</p>
                        <p>FastAPI</p>
                        <p>Python</p>
                        <p>Vue JS</p>
                        <p>JavaScript</p>
                    </div> 
                </div>
                <div> 
                    <p> Take a look at: <a href="https://mybudgetvue.herokuapp.com/"> My_Budget </a></p>
                    <p>User: user</p>
                    <p>Pass: admin</p>
                    <br>
                    <p>Repositories:</p>
                    <p>https://github.com/salicat/my_budget_back</p>
                    <p>https://github.com/salicat/my_budget_vue</p>
                </div>
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
        </div>
    </div>
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
        background-color: red;
        font-family: arial;
        color: white;
        display: flex;
        flex-direction: row;
        padding:3%;
        height:95%;
        width: 90%;
        margin-bottom: 10%;
    }
    .header a{
        color:black;
        font-style: italic;
    }
    .header{
        width: 40%;
        background-color:rgb(205, 205, 205);
        display: flex;
        flex-direction: column;    
        justify-content: left;
        height: 90%;
    }
    .highlights{
        line-height: 1.2;
        margin-left:5%;
        padding: 1%;
        font-size: 1.4vw;
        color:rgb(97, 97, 97);
    }
    .skills{
        margin-left:5%;
        font-size: 1.4vw;
        color:rgb(97, 97, 97);
    }
    .skills li{
        line-height: 1.2;
    }
    .others{
        font-size: 1.4vw;
        line-height: 1.2;
        margin-left:5%;
        color:rgb(97, 97, 97);
    }
    .education{
        font-size: 1.4vw;
        margin-left: 5%;
        margin-right: 3%;    
    }
    .name{
        line-height: 0.9;
        margin-left:5%;
        font-size: 2vw;
        color: black;
    }
    .divider{
        background-color: rgb(66, 66, 66);
        margin-left:2%;
        width: 65%;
        height: 0.4vh;
    }
    .contact {
        font-size: 1.4vw;
        line-height: 0.3;
        font-style: bold;
        color:rgb(97, 97, 97);

    }
    .right-box{
        line-height: 0.4;
        width: 60%;
        background-color: rgb(0, 0, 0);
        flex-direction: column;
        height: 90%;
    }
    .programming{
        font-size: 1vw;
        margin: 1%;
        padding: 1%;
    }
    .experience{
        margin: 1%;
        padding: 1%;
        display: flex;
        flex-direction: row;
    }
    .compo{
        
    }
    .tecno{

    }
    .jobs{
        font-size: 1vw;
        margin: 1%;
        padding: 1%;
    }
    .jobs li{
        line-height: 1.3;
    }
    .tittle{
        color:black;
        background-color: rgb(205, 205, 205);
        min-height: 5px;
        overflow: hidden;
        font-size: 1.4vw;
    }
    .subtittle{

    }


@media screen and (min-width: 400px) {
    .resume{
        background-color: rgb(12, 245, 144);
        overflow-y: scroll;
        overflow: auto;
    }
}
</style>
