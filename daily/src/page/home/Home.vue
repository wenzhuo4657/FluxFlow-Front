<script setup>
import ButtonBar from '@/page/home/components/button/ButtonBar/ButtonBar.vue'
import Banner from '@/page/home/typeDaily/banner.vue'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()

</script>

<template>
 
    <div class="any">
 


    <div  class="bar">      
             <h1>{{t('title')}}</h1>
        <div>
          <ButtonBar></ButtonBar>
     
        </div>
    </div>
      
        <div  class="banner">

          <Banner></Banner>
          

        </div>
        


  </div>

</template>

<style scoped>
.bar{
  justify-items: center;
  display: grid;
  grid-template-rows:  10vh 10vh;
}

.any{
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-rows:  20vh 80vh;
  background: rgb(222, 215, 171);
  justify-items: center;

}
.banner{
  display: block;
  width: 80vw;
  overflow: auto; 
}
</style>

