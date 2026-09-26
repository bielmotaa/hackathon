export interface RegisterHttpParams {
    name: string
    email: string
    password: string
    ssn: string
    birthDate?: string
    phone?: string
    gender?: string
    userTerms?: boolean
    cityId: string
    street?: string
    secretariatId: string
    applicationId: string
    roleId: string
}

export interface SignInHttpParams {
    ssn: string
    password: string
    applicationId: string
}

export interface SignInHttpResponse {
    accessToken: string
    userId: string
    secretariatId: string
    cityId: string
    applicationId: string
    roleId: string
    super?: boolean
}

export interface UserProfileHttpResponse {
    id: string
    name: string
    ssn: string
    email?: string
    phone?: string
    birthDate?: string
    userName?: string
    rg?: string
    gender?: string
    avatarPath?: string
    cityName?: string
    secretariatName?: string
    roleName?: string
    createdAt: string
}