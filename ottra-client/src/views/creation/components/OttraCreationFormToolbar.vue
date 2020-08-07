<template>

	<v-card-title>
		<slot>	Heading missing!  </slot>
    
    <v-spacer></v-spacer>

    <slot name="extra_icons"></slot>

    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" text icon @click="$emit('start-tour')">
          <v-icon>help_outline</v-icon>
        </v-btn>
      </template>
      {{ $t('ui.tooltip.starttour') }}
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" text icon @click="$emit('close-dialog')">
          <v-icon>clear</v-icon>
        </v-btn>
      </template>
      {{ $t('ui.text.close') }}                  
    </v-tooltip>

	</v-card-title>
	
</template>

<script>
export default {
	name: "ottra-creation-form-toolbar"
}
</script>