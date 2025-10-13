export interface UserFormModel {
    userName: string,
    userEmail: string,
}

export interface SwitchManageUserModel {
    userId: string,
    manageUserStatus: string,
}

export interface UserActionModel {
    userId: string,
    userStatus: string,
}

export interface ListUserModel {
    user_id: string,
    email: string,
    password: string,
    manageuser: number,
    pwdResetRequired: number,
    isactive: string,
    lastlogin: string,
    createdAt: string,
    updatedAt: string,
}