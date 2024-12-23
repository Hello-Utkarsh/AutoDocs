
export const handleDel = async (t, table, setTable) => {
    try {
        const req = await fetch(`${import.meta.env.VITE_PORT}/table/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ table_id: t[Object.keys(t)][0].table_id })
        })
        const response = await req.json()
        if (response) {
            const new_table = table.filter(x => Object.keys(x)[0] != Object.keys(t)[0])  
            setTable(new_table)
        }
    } catch (error) {
        console.log(error.message)
    }
}

export const createTable = async (name, id, setDialog, set_table_changed, setErr) => {
    try {
        const req = await fetch(`${import.meta.env.VITE_PORT}/table/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                user_id: id
            })
        })
        const response = await req.json()
        setDialog(false)
        set_table_changed(p => !p)
    } catch (error) {
        setErr("Some error occured, Please try again")
        setTimeout(() => {
            setErr("")
        }, 4000)
    }
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
