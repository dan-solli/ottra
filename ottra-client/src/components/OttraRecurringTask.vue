<template>
	<v-container>
		<v-row>
			<v-col class="d-flex align-center" cols="1">
				(*) Every 
			</v-col>
			<v-col class="d-flex align-center" cols="1">
				<v-text-field 
					v-model="payload.howOften"
					v-on:change="$emit('set-recurrance-how-often', payload.howOften)"
					type="number"> 
				</v-text-field>
			</v-col>
			<v-col class="d-flex align-center" cols="2">
		    <v-radio-group 
		    	v-model="payload.recurrance"
					v-on:change="$emit('set-recurrance-what', payload.recurrance)">
		      <v-radio v-for="item in recurranceOptions"
		      	:key="item.option"
		        :label="item.title"
		        :value="item.option">
		      </v-radio>
		    </v-radio-group>				
			</v-col>
<!--			
			<v-col cols="3">
		    <v-radio-group v-model="payload.recurrance">
		      <v-radio v-for="item in recurranceOptions"
		      	:key="item.option"
		        :label="item.title"
		        :value="item.option">
		      </v-radio>
		    </v-radio-group>				
			</v-col>


			<v-col cols="9">
				<v-container>
					<div v-if="payload.recurrance === RECURRANCE_DAY">
						<v-row>
							<v-col>
								<v-radio-group v-model="payload.everyday">
									<v-radio key="1" label="(*) Every " value="1"></v-radio>
									<v-text-field v-model="payload.oneveryday" type="number"> 
          				</v-text-field>
										(* :a day)
          				<v-radio key="2" label="(*) Every work day"></v-radio>
          			</v-radio-group>
          		</v-col>
          	</v-row>
					</div>

					<div v-else-if="payload.recurrance === RECURRANCE_WEEK">
						<v-row>
							<v-col>
								(*) Repeat every <v-text-field v-model="payload.oneeveryweek"> </v-text-field>
									(* :a week on:)
								<v-checkbox v-model="payload.onweekday" label="(*) Monday" value="1"></v-checkbox>
								<v-checkbox v-model="payload.onweekday" label="(*) Tuesday" value="2"></v-checkbox>
								<v-checkbox v-model="payload.onweekday" label="(*) Wednesday" value="3"></v-checkbox>
								<v-checkbox v-model="payload.onweekday" label="(*) Thursday" value="4"></v-checkbox>
								<v-checkbox v-model="payload.onweekday" label="(*) Friday" value="5"></v-checkbox>
								<v-checkbox v-model="payload.onweekday" label="(*) Saturday" value="6"></v-checkbox>
								<v-checkbox v-model="payload.onweekday" label="(*) Sunday" value="7"></v-checkbox>
							</v-col>
						</v-row>
					</div>

					<div v-else-if="payload.recurrance === RECURRANCE_MONTH">
						<v-radio-group v-model="payload.everymonth">
							<v-row>
								<v-col>
									<v-radio key="1" label="(*) Day"></v-radio>
									<v-text-field v-model="payload.onday" type="number">
									</v-text-field>
									(*) every
									<v-text-field v-model="payload.oneverymonth" type="number">
									</v-text-field>
									(* a: month)
								</v-col>
							</v-row>
						</v-radio-group>
					</div>

					<div v-else-if="payload.recurrance === RECURRANCE_YEAR">
						YEAR
					</div>

					<div v-else>
					</div>
				</v-container>
			</v-col>
-->			
		</v-row>
	</v-container>
</template>

<script>

import {
	RECURRANCE_DAY, RECURRANCE_WEEK, RECURRANCE_MONTH, RECURRANCE_YEAR
} from '@/common/recurrance.types'

export default {
	name: 'ottra-recurring-task',
	data: function() {
		return {
			payload: {
				recurrance: this.RECURRANCE_DAY,
				howOften: 1,
			},
			recurranceOptions: [
				{ title: '(*) Day', option: this.RECURRANCE_DAY },
				{ title: '(*) Week', option: this.RECURRANCE_WEEK },
				{ title: '(*) Month', option: this.RECURRANCE_MONTH },
				{ title: '(*) Year', option: this.RECURRANCE_YEAR },
			],
		}
	},
}
</script>