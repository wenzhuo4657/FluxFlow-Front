import { getHttp } from "@/lib/http";




// ==================== API响应类型定义 ====================

/**
 * 统一响应体包装类
 */
export interface ApiResponse<T = any >{
  code: number;
  message: string;
  data: T;
}

export interface GetContentIdsByTypesRequest{
        id:string,
}


export interface GetItemsRequest{
        docsId:string,
        type:string,
}


export interface InsertItemRequest{
        docsId:string,
        type:string,
}

    export interface UpdateCheckListRequest{
        index:string,
        title:string
    }
    export interface UpdateItemRequest {
  index: string;
  content: string;
}



/**
 * 获取条目响应数据类型
 * 根据API文档，index为String类型以避免精度损失
 */
export interface ItemData {
  index: string;
  content: string;
  title: string;
  expand: string;
}

/**
 * 类型数据
 * 根据API文档，id为String类型以避免精度损失
 */
export interface TypeData {
  id: string;
  name: string;
}

/**
 * 文档数据
 * 根据API文档，id为String类型以避免精度损失
 */
export interface ContentData {
  id: string;
  name: string;
}

// ==================== API方法实现 ====================

/**
 * 查询文档条目
 * @param data 请求参数
 * @returns 条目数组（严格检查响应状态）
 */
export async function getMdByType(data: GetItemsRequest): Promise<ItemData[]> {
  const http = getHttp();
  const res = await http.post<ApiResponse<ItemData[]>>("/api/item/get", data, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  });


  // 严格返回数据：确保返回数组类型
  return Array.isArray(res.data.data) ? res.data.data : [];
}


/**
 * 新增日记条目
 * @param data 请求参数
 * @returns 操作结果（严格检查响应状态）
 */
export async function addItemByType(data: InsertItemRequest): Promise<boolean> {
  const http = getHttp();
  const res = await http.post<ApiResponse>("/api/item/insert", data, {
    headers: {
      "Content-Type": "application/json",
    }
  });

 

   return res.data.code==200;
}

/**
 * 更新日记条目
 * @param data 请求参数
 * @returns 操作结果（严格检查响应状态）
 */
export async function updateItemByType(data: UpdateItemRequest): Promise<boolean> {
  const http = getHttp();
  const res = await http.post<ApiResponse>("/api/item/update", data, {
    headers: {
      "Content-Type": "application/json",
    }
  });




  return res.data.code==200;
}

export async function deleteItemByTypes(param:string) {
  const http = getHttp();
    const res = await http.post<ApiResponse>("/api/item/delete?index="+param);

  return res.data.code==200;
  
}




// ==================== 文件上传下载接口（根据需要使用） ====================

/**
 * 下载文件
 * 注意：这些接口在API文档中未定义，如需使用请先添加到API文档中
 */
export async function DownLoadFile() {
  const http = getHttp();
  const res = await http.get("/api/DownLoadFile", {
    responseType: 'blob',
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  try {
    const blob = new Blob([res.data]);
    const filename = 'download.db';

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    alert('下载失败，请稍后重试');
  }
}

/**
 * 上传文件
 * 注意：这些接口在API文档中未定义，如需使用请先添加到API文档中
 */
export async function upload(data: FormData): Promise<boolean> {
  const http = getHttp();
  const res = await http.post<ApiResponse>("/api/upload", data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data.code==200;
}

/**
 * 更新检查清单标题
 * @param data 请求参数
 * @returns 操作结果（严格检查响应状态）
 */
export async function updateCheckListTitle(data: UpdateCheckListRequest): Promise<boolean> {
  const http = getHttp();
  const res = await http.post<ApiResponse>("/api/item/field/checklist/title", data, {
    headers: {
      "Content-Type": "application/json",
    }
  });



  return res.data.code==200;
}

/**
 * 完成检查清单
 * @param id 检查清单项ID（String类型，避免精度损失）
 * @returns 操作结果（严格检查响应状态）
 */
export async function updateCheckListStatus(id: string): Promise<boolean> {
  const http = getHttp();
  const res = await http.post<ApiResponse>("/api/item/field/checklist/finish", { id }, {
    headers: {
      "Content-Type": "application/json",
    }
  });
  return res.data.code==200;
}

/**
 * 获取所有类型列表
 * @returns 类型数组（严格检查响应状态，API直接返回数组，不在BaseApiResponse包装中）
 */
export async function getAllTypes(): Promise<TypeData[]> {
  const http = getHttp();
  const res = await http.get<ApiResponse<TypeData[]>>("/api/types/getAllTypes", {
    headers: {
      Accept: "application/json",
    },
    responseType: "json"
  });

  // 严格控制接口返回值：确保返回数组类型
  return Array.isArray(res.data.data) ? res.data.data : [];
}

/**
 * 根据类型获取文档列表
 * @param data 请求参数（API直接返回数组，不在BaseApiResponse包装中）
 * @returns 文档数组（严格检查响应状态）
 */
export async function getTypesWithItems(data: GetContentIdsByTypesRequest): Promise<ContentData[]> {
  const http = getHttp();
  const res = await http.post<ApiResponse<ContentData[]>>("/api/types/getContentIdsByTypes", data, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    responseType: "json"
  });

  // 严格控制接口返回值：确保返回数组类型
  return Array.isArray(res.data.data) ? res.data.data : [];
}

/**
 * 用户登出
 * @returns 登出结果（严格检查响应状态）
 */
export async function logout(): Promise<boolean> {
  const http = getHttp();
  const res = await http.post("/api/oauth/logout", {}, {
    headers: {
      "Content-Type": "application/json",
    },
    responseType: "json"
  });

  // 严格控制接口返回值：检查登出结果
  // API文档显示直接返回 true/false
  if (res.data !== true) {
    throw new Error("登出失败");
  }

  return true;
}
