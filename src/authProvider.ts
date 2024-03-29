import { AuthProvider } from "@pankod/refine-core";
import { notification } from "@pankod/refine-antd";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { signInWithEmailAndPassword, sendPasswordResetEmail, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase";

export const TOKEN_KEY = "auth";
export const USERS = "user";
export const USERS_DETAILS = "user details";

export const authProvider: AuthProvider = {
    login: async ({ email, password }) => {
        try {
            let user: any = await signInWithEmailAndPassword(auth, email, password)
            const q = query(collection(db, "stores"), where("uid", "==", user.user.uid));
            const querySnapshot: any = await getDocs(q);
            if (querySnapshot?.docs?.length == 0) {
                throw new Error("Your account has been suspended due to a violation of our policies. To reactivate your account, please contact our support team and provide additional information.");
            }
            return querySnapshot.forEach((doc: any) => {
                let userData = doc.data()
                if (userData.isActive) {
                    userData['id'] = doc.id
                    localStorage.setItem(TOKEN_KEY, `${user.user.accessToken}`);
                    localStorage.setItem(USERS, `${JSON.stringify(user.user)}`);
                    localStorage.setItem(USERS_DETAILS, `${JSON.stringify(userData)}`);
                } else {
                    throw new Error("Your account has been suspended due to a violation of our policies. To reactivate your account, please contact our support team and provide additional information.");
                }
            });

        } catch (error) {
            throw new Error("Your account has been suspended due to a violation of our policies. To reactivate your account, please contact our support team and provide additional information.");
        }
    },
    register: async (values) => {
        try {
            let user: any = await createUserWithEmailAndPassword(auth, values.email, values.password)
            const dbRef = collection(db, 'stores');
            addDoc(dbRef, { ...values, uid: user.user.uid, id: user.user.uid, type: 'vendor', isActive: false, createAt: String(new Date()), updateAt: String(new Date()) })
                .then(docRef => {
                    notification.success({
                        message: "",
                        description: "Congratulations! You have successfully registered store.",
                    });
                    history.back()
                    return Promise.resolve();
                })
                .catch(error => {
                    return Promise.reject(error);
                })
        } catch (error) {
            notification.error({
                message: "Error",
                description: `This email has account with “CarryBags”, please try login.`,
            });
            return Promise.reject(error);
        }
    },
    updatePassword: async () => {
        notification.success({
            message: "Updated Password",
            description: "Password updated successfully",
        });
        return Promise.resolve();
    },
    forgotPassword: async ({ email }) => {
        try {
            await sendPasswordResetEmail(auth, email)
            notification.success({
                message: "Reset Password",
                description: `Reset password link sent to "${email}"`,
            });
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    },
    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USERS);
        localStorage.removeItem(USERS_DETAILS);
        return Promise.resolve();
    },
    checkError: () => Promise.resolve(),
    checkAuth: () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            return Promise.resolve();
        }
        return Promise.reject();
    },
    getPermissions: () => Promise.resolve(),
    getUserIdentity: async () => {
        const user = localStorage.getItem(USERS);
        if (!user) {
            return Promise.reject();
        }
        let users = JSON.parse(user)
        const q = query(collection(db, "stores"), where("uid", "==", users.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            let userData: any = { ...doc.data(), id: doc.id }
            localStorage.setItem(USERS_DETAILS, `${JSON.stringify(userData)}`);
            return Promise.resolve({
                id: userData.id,
                name: userData.title,
                avatar: userData.avatar,
            });
        });
    },
};
