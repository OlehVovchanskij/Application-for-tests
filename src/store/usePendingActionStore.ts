// usePendingActionStore.ts
import { create } from 'zustand'

type PendingActionState = {
	pendingAction: (() => void) | null
	setPendingAction: (action: () => void) => void
	executePendingAction: () => void
	clearPendingAction: () => void
}

export const usePendingActionStore = create<PendingActionState>(set => ({
	pendingAction: null,

	setPendingAction: action => set({ pendingAction: action }),

	executePendingAction: () =>
		set(state => {
			state.pendingAction?.()
			return { pendingAction: null }
		}),

	clearPendingAction: () => set({ pendingAction: null }),
}))
