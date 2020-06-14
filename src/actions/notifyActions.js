import { NOTIFY_USER, CLEAR_NOTIFY } from './types'

export const notifyUser = (message, messageType) => {
    return {
        type: NOTIFY_USER,
        message, messageType
    }
}
export const clearNotify = () => {
    return {
        type: CLEAR_NOTIFY
    }
}