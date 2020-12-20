export const foo = 123;

export interface Project {
    status: "ONGOING" | "ERROR" | "DONE"
}

interface UserInfo {
    userId: number;
    userName: string;
    email: string;
    userStatus: "A" | "B" | "C" | "D";
    phone: string;
    registerDate: string;
    accountNumber: string;
    photo: string;
}

// export type ProfileState = {
//     [K in "userName" | "email" | "phone"]: UserInfo[K];
// };

export type ProfileState = Pick<UserInfo, "userName" | "email" | "phone">;
