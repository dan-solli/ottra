<template>
  <v-app>
    <OttraHeader> </OttraHeader>
    <v-content class="mx-4 mb-4">
      <!-- Sup? {{ $t('message') }} Sup? -->
      <router-view></router-view>
    </v-content>
    <OttraFooter> </OttraFooter>
  </v-app>
</template>

<script>
import OttraHeader from "@/components/OttraHeader";
import OttraFooter from "@/components/OttraFooter";

export default {
  name: 'App',
  components: {
    OttraHeader,
    OttraFooter
  },
  data () {
    return {
      // 
    }
  }
}
</script>
