import { createStore } from "vuex";

export interface AppStore  {
    userRole: string | null;  
}

export const store = createStore<AppStore>({
    state() {
        return {
            userRole: null
        }
    },
    mutations: {
        setUserRole(state: AppStore, role: string) {
            state.userRole = role
        }
    },
    actions: {
    },
    getters: {
        userRole: (state) => {
            return state.userRole;
        }
    }
});
