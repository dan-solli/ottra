<template>
  <div class="weather">
     <h1 class="subheading">
      {{ $t('ui.view.weatherview.heading') }}
    </h1>

     <v-container class="my-5">
     	<v-layout row wrap>
     	</v-layout>
     </v-container>
  </div>
</template>
<script>

export default {
  name: "weather",
  mounted: function() {
  	this.$getLocation()
  		.then(coordinates => {
    		this.$log.debug(coordinates);
  	})
  }
};
</script>
