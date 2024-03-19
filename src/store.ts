import mitt, { Emitter, EventType } from "mitt";
import { createStore } from "vuex";
export interface AppStore  {
    userRole: string | null;
    eventBus: Emitter<Record<EventType, unknown>>
}

export const store = createStore<AppStore>({
    state() {
        return {
            userRole: null,
            eventBus: mitt(),
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
        },
    }
});
