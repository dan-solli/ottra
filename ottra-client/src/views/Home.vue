<!-- Denna ser inte ut att användas -->
<template>
	<div>
	  <HelloWorld />
	  Sup? {{ $t('message') }} Sup?
	 	<HelloLocal />
	 </div>
</template>

<script>
  import HelloWorld from '../components/HelloWorld'
  import HelloLocal from '../components/HelloI18n'

  export default {
    components: {
      HelloWorld, 
      HelloLocal
    }
  }
</script>
