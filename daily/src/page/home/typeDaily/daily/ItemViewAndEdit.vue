<script setup lang="ts">

import { deleteItemByTypes, ItemData, updateItemByType } from '@/services/request'
import { ref } from 'vue';
import { UpdateItemRequest } from '@/type/requestDto/UpdateItemDto';
import { SessionStorage } from '@/constants/storage';
import MarkdownView from "@/page/home/components/content/MarkdownView.vue"
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

// 使用默认值选项
const item = defineModel<ItemData>("item",{
  default: () => ({
    index: "0",
    content:"待写入"
  })
})

const edit_val=ref(false);

const tempContent=ref<String>('')

function editStatus(){
    edit_val.value=true
    tempContent.value=item.value.content
}

function save(){
    edit_val.value=false
    // 如果tempContent为空，说明没有进入过编辑模式，直接使用item.content
    if (tempContent.value === '') {
        tempContent.value = item.value.content || ''
    }
    item.value.content = String(tempContent.value);
    // 保存api调用
    const  data:UpdateItemRequest={index:item.value.index,content:item.value.content}
    updateItemByType(data)

}

function deleteItem(item: ItemData) {
  deleteItemByTypes(item.index)
  location.reload() 
}





</script>

<template>


    <div  class="sqlit">
        <!--按扭区 -->
        <div>
            <button  @click="editStatus">{{ $t('editItem') }}</button>
            <button  @click="save">{{ $t('saveItem') }}</button>
            <button  @click="deleteItem(item)">{{ $t('deleteItem') }}</button>
        </div>
      
        <!-- 编辑与预览区 -->
        <div>
                <div v-if="!edit_val">
        
              
                 <MarkdownView   v-model="item.content"></MarkdownView>
                    </div>
                <div v-else  class="editor-wrap">
                     <el-input
                        v-model="tempContent"
                        type="textarea"
                        :autosize="{ minRows: 16, maxRows: 40 }"
                        class="edit_input"
                        spellcheck="false"
                        placeholder="Please input"
                        />
                </div>
        </div>
      
       

            
    </div>


</template>

<style>
.sqlit{
    width:  100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.editor-wrap {
  flex: 1;
  display: flex;
  align-items: stretch;
  width: 100%;
}
.edit_input { width: 100%; }
.edit_input textarea {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  line-height: 1.5;
}

</style>