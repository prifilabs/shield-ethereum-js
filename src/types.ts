export type User = { roles: string[]; addr: string }
export type Credentials = {
    to: string
    call: string
    timestamp: number
    approvals: string[]
}
