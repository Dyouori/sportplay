
<template>
  <div>
     
    <el-calendar>
  <template v-slot:dateCell="{ date, data }">
    <p :class="data.isSelected ? 'is-selected' : ''">
      {{ date.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : '' }}
    </p>
  </template>
</el-calendar>

  </div>
</template>

<script>
import calendar from './calendar.js'
export default {
 
    data() {
        return {
         
        }
    },
}
</script>
<style>
  .is-selected {
    color: #1989FA;
  }
</style>