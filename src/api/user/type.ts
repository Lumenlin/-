// 定义用户相关数据的ts类型

// 定义全部接口返回都有的数据的ts类型
export interface ResponseData{
    code:number,
    message:string,
    ok:boolean,
}

// 登录接口需要携带参数ts类型
export interface loginFormData {
    username: string
    password: string
}

// 登录接口返回的数据类型
export interface loginResponseData extends ResponseData {
    data: string
}

// 定义服务器返回的用户信息相关的数据类型
export interface userInfoResponseData extends ResponseData{
    data:{
        routes: string[],
        buttons:string[],
        role:string[],
        name:string,
        avatar:string
    }
}

