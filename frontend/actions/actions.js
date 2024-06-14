
export const handleDel = async (t, table, setTable) => {
    const req = await fetch(`${import.meta.env.VITE_PORT}/table/delete`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ table_id: t[Object.keys(t)][0].table_id })
    })
    const response = await req.json()

    setTable(table.filter(tab => tab[Object.keys(tab)][0].table_id !== t[Object.keys(t)][0].table_id))
}

export const createTable = async (name, content, id, setDialog, set_table_changed) => {
    const req = await fetch(`${import.meta.env.VITE_PORT}/table/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            content: content,
            user_id: id
        })
    })
    const response = await req.json()
    setDialog(false)
    set_table_changed(p => !p)
}

export const user_data = async (u) => {

    if (u.user) {

        const table_req = await fetch(`${import.meta.env.VITE_PORT}/table/get-table`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'user_id': u.user.id })
        })
        const req = await table_req.json()

        const docs_req = await fetch(`${import.meta.env.VITE_PORT}/docs/get-docs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: u.user.id })
        })

        const docs = await docs_req.json()
        const new_table = new Set()

        // for each table, adding all the notes/docs with the same table id and adding to the table state
        req.user_tables.forEach((t) => {
            const table_docs = { [t.name]: [] }
            docs.docs.forEach((d) => {
                if (d.table_id === t.id) {
                    table_docs[t.name].push(d)
                }
            })
            if (table_docs[Object.keys(table_docs)].length == 0) {
                table_docs[Object.keys(table_docs)[0]].push({ table_id: t.id })
            }
            new_table.add(table_docs);
        })

        return new_table
    }
}
