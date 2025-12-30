import { defineStore } from 'pinia'



/**
 * 该pinia用于管理home页面的状态
 */
export const useCounterStore = defineStore('DocsView', {
  state: () => (
    { 
        homeModel: HomeModels.DEFAULT as number,
        currentTypeId: '',
        currentDocsId: '',
        currentItemIndex: '',
        refreshTrigger: 0,
    }),
  getters: {
    getCurrentModel: (state) => state.homeModel as number,
    getCurrentTypeId: (state) => state.currentTypeId,
    getCurrentDocsId: (state) => state.currentDocsId,
    getCurrentItemIndex: (state) => state.currentItemIndex,
    getRefreshTrigger: (state) => state.refreshTrigger,
  },
  actions: {
    setHomeModel(model: number) {
      this.homeModel = model as number;
    },
    setCurrentTypeId(typeId: string) {
      this.currentTypeId = typeId;
    },
    setCurrentDocsId(docsId: string) {
      this.currentDocsId = docsId;
    },
    setCurrentItemIndex(itemIndex: string) {
      this.currentItemIndex = itemIndex;
    },
    triggerRefresh() {
      this.refreshTrigger++;
    },
  },
})





export type HomeModel = number;

export const HomeModels = Object.freeze({
  
  DEFAULT: 1 as HomeModel,
  DOCS_LIST: 2 as HomeModel,
  DOC_CONTENT: 3 as HomeModel,
  PREVIEW: 4 as HomeModel,
  CONFIGURATION: 5 as HomeModel,

});

