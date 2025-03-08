<template>
    <div ref="lottieContainer" class="lottie-container">
		<h3>Estamos en una plataforma gratuita, 
			tus operaciones pueden tardar un poco</h3>
		<br>
		<h4>Gracias por tu paciencia!</h4>
	</div>
  </template>
  
  <script>
  import lottie from 'lottie-web';
  
  export default {
    name: 'LottieAnimation',
    props: {
      animationData: Object
    },
    mounted() {
      lottie.loadAnimation({
        container: this.$refs.lottieContainer, // the DOM element that will contain the animation
        renderer: 'svg',
        speed:"10",
        loop: true,
        autoplay: true,
        animationData: this.animationData
      });
    },
    beforeDestroy() {
      lottie.destroy(); // Make sure to destroy the lottie instance when the component is destroyed
    }
  };
  </script>