// 刚刚封装的axios 
import { post, postJson,postJsonAll, get }   from './mhttp.js'; 

//登录
export const login = param => postJson("/open/login/userview", param); 

//查询项目名称
export const selectitemname = param => postJson("/open/config/selectitemname", param); 
//新增项目名称
export const insetitemname = param => postJson("/open/config/insetitemname", param);
//修改项目名称
export const updeteitemname = param => postJson("/open/config/updeteitemname", param);
//删除项目名称 
export const deleteitemname = param => postJson("/open/config/deleteitemname", param);
//查询成员列表 
export const selectmember = param => postJson("/open/config/selectmember", param);

//查询类别名称
export const selectitemtype = param => postJson("/open/config/selectitemtype", param); 
//新增类别名称
export const insettypename = param => postJson("/open/config/insettypename", param);
//修改类别名称
export const updetetypename = param => postJson("/open/config/updetetypename", param);
//删除类别名称 
export const deleteTypename = param => postJson("/open/config/deleteTypename", param);



//查询接口 
export const selectinterface = param => postJson("/open/interface/selectinterface", param);  
//查询接口  no token
export const selectinterfaceLink = param => post("/open/interface/selectinterfaceLink", param); 
//新增接口 
export const insetiinterface = param => postJson("/open/interface/insetiinterface", param);
//修改接口 
export const updeteinterface = param => postJson("/open/interface/updeteinterface", param);
//删除接口 
export const deleteinterface = param => postJson("/open/interface/deleteinterface", param);
