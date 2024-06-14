import { atom } from "recoil";

export const note_id = atom({
    key: 'note_id', // unique ID (with respect to other atoms/selectors)
    default: '', // default value (aka initial value)
});

export const table_id = atom({
    key: 'table_id',
    default: false
})

export const doc_created = atom({
    key: 'doc_created',
    default: false
})

export const user_table = atom({
    key: 'user_table',
    default: []
})