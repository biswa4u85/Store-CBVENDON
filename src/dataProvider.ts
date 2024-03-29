import { doc, collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase";

export const dataProvider: any = {
    create: async ({ resource, variables, metaData }: any) => {
        let params = variables
        if (resource === 'stores') {
            try {
                let user: any = await createUserWithEmailAndPassword(auth, variables.email, variables.password)
                if (user) {
                    params = { ...params, uid: user.user.uid, type: 'vendor' }
                }
            } catch (error: any) {
                throw new Error(JSON.stringify(error.message));
            }
        }
        if (resource === 'orders') {
            params.isPaid = false
            params.orderStatus = 'Order Received'
            params.orderStatusArray = [{ children: 'Order Received', label: String(new Date()) }]
            params.user = params.user ? params.user : ''
            params.employeeID = params.employeeID ? params.employeeID : ''
        }
        params['createAt'] = String(new Date())
        params['updateAt'] = String(new Date())
        const dbRef = collection(db, resource);
        let q = query(collection(db, resource))
        const querySnapshot = await getDocs(q);
        const recordCount = querySnapshot.size;
        addDoc(dbRef, params)
            .then(docRef => {
                return Promise.resolve();
            })
            .catch(error => {
                history.back()
                return Promise.reject(error);
            })
    },
    createMany: ({ resource, variables, metaData }: any) => {
        return Promise.resolve();
        // return Promise.reject();
    },
    deleteOne: async ({ resource, id, variables, metaData }: any) => {
        try {
            await deleteDoc(doc(db, resource, id));
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    },
    deleteMany: ({ resource, ids, variables, metaData }: any) => {
        return Promise.resolve();
        // return Promise.reject();
    },
    getList: async ({
        resource,
        pagination,
        hasPagination,
        sort,
        filters,
        metaData,
    }: any) => {
        try {
            const USERS_DETAILS = "user details";
            let user = localStorage.getItem(USERS_DETAILS);
            let users: any = user ? JSON.parse(user) : {}
            const queryConstraints = []
            if (resource == 'orders') {
                queryConstraints.push(where('store', '==', users?.id ? users?.id : ''))
            }
            if (filters) {
                for (let item of filters) {
                    if (item.operator == 'boolean') {
                        queryConstraints.push(where(item.field, '==', (item.value == 'true' ? true : false)))
                    } else if (item.operator == 'id' || item.operator == 'in') {
                    } else {
                        if (item.value && Array.isArray(item.value)) {
                            for (let val of item.value) {
                                queryConstraints.push(where(item.field, '==', val))
                            }
                        } else if (item.value) {
                            queryConstraints.push(where(item.field, '==', item.value))
                        }
                    }
                }
            }
            if (sort) {
                for (let item of sort) {
                    queryConstraints.push(orderBy(item.field, item.order))
                }
            }
            // else {
            //     queryConstraints.push(orderBy('updateAt', 'desc'))
            // }
            let q = query(collection(db, resource), ...queryConstraints)
            const querySnapshot = await getDocs(q);
            let collections: any = [];
            querySnapshot.forEach((doc: any) => {
                collections.push({ ...doc.data(), id: doc.id })
            });
            collections.sort((a: any, b: any) => new Date(b.updateAt).getTime() - new Date(a.updateAt).getTime());
            if (resource == 'orders') {
                let filterId = filters.find((item: any) => item.operator == 'id')
                if (filterId && filterId.value) {
                    let collection = collections.filter((item: any) => item.id == filterId.value)
                    collections = collection ? collection : []
                }
                let filterIn = filters.find((item: any) => item.operator == 'in')
                if (filterIn && filterIn.value) {
                    let collection = collections.filter((element: any) => filterIn.value.includes(element.orderStatus))
                    collections = collection ? collection : []
                }
            }
            return Promise.resolve({ data: collections });
        } catch (error) {
            return Promise.reject(error);
        }
    },
    getMany: ({ resource, ids, metaData }: any) => {
        return Promise.resolve();
        // return Promise.reject();
    },
    getOne: async ({ resource, id, metaData }: any) => {
        try {
            const docRef = doc(db, resource, id);
            const docSnap = await getDoc(docRef);
            return Promise.resolve({ data: { ...docSnap.data(), id } });
        } catch (error) {
            return Promise.reject(error);
        }
    },
    update: ({ resource, id, variables, metaData }: any) => {
        variables['updateAt'] = String(new Date())
        if (resource == 'orders') {
            variables.employeeID = variables.employeeID ? variables.employeeID : ''
        }
        const docRef = doc(db, resource, id);
        updateDoc(docRef, variables)
            .then(docRef => {
                if (resource == 'stores') {
                    window.open('/orders', "_self");
                }
                return Promise.resolve();
            })
            .catch(error => {
                return Promise.reject(error);
            })
    },
    updateMany: ({ resource, ids, variables, metaData }: any) => {
        return Promise.resolve();
        // return Promise.reject();
    },
    custom: ({
        url,
        method,
        sort,
        filters,
        payload,
        query,
        headers,
        metaData,
    }: any) => Promise,
    getApiUrl: () => "",
};