import { useState, useEffect } from 'react'
import { supabase } from '../api/supabase'
import Link from 'next/link'

export default function Drafts() {

    const [ drafts, setDrafts ] = useState([])

    async function showDrafts(){
        let { data: drafts, error } = await supabase
        .from('drafts')
        .select('id, subject_line, text')
        .eq('writer_id', 1)
        setDrafts(drafts)
        console.log(drafts)
    }

    async function getUserData(){
        let { data: users, error } = await supabase
        .from('users')
        .select('name, newsletter')
    }

    useEffect(() => {
        showDrafts()
    }, [])

    return (
        <div className="h-full py-4 px-2 relative w-full flex flex-col justify-center items-center">
            <h1 className="text-6xl font-bold text-blue-600">Draftmails 📝</h1>
            <div className="mt-24 2xl:w-2/3">
                <h2 className="text-4xl font-bold text-blue-600">Drafts</h2>
                <hr className="w-full h-1 border-0 bg-blue-50 mt-6" />
                <Link href="/new-draft">
                  <button type="button" className="mt-8 hidden bg-blue-50 text-blue-600 font-bold text-2xl px-5 py-5 rounded-md">+ Start a new draft</button>
                </Link>
                <div className="mt-16 grid grid-cols-1 grid-rows-9 xl:grid-cols-3 xl:grid-rows-3 gap-8">
                    <Link href="/new-draft" className='bg-blue-50 text-blue-600 text-2xl font-bold rounded-md h-full flex flex-col justify-center items-center px-5 py-5'>
                        + Start a new draft
                    </Link>
                    {
                        drafts.map(
                            draft =>
                            <Link href={`/my-drafts/${draft.id}`} key={draft.id}>
                            <div id={draft.id} className="rounded-md h-full flex flex-col justify-center items-center bg-blue-700 px-5 py-4">
                                <h3 className="text-2xl text-gray-50 font-bold">{draft.subject_line}</h3>
                                <div className="mt-6 rounded-md bg-gray-50 px-3 py-4">
                                    <p className="text-xl">{draft.text.slice(0, 200)}</p>
                                </div>
                            </div>
                            </Link>
                        )
                    }
                </div>
            </div>
        </div>
    )
}