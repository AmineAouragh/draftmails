import { useState, useEffect } from 'react'
import { supabase } from '../api/supabase'
import Link from 'next/link'

export default function Drafts() {

    const [ drafts, setDrafts ] = useState([])

    async function showDrafts(){
        let { data: drafts, error } = await supabase
        .from('drafts')
        .select('id, subject_line, text, status')
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
            <h1 className="text-6xl font-bold text-blue-600">Draftmails</h1>
            <p className="text-lg font-bold text-blue-800">by Amine</p>
            <div className="mt-24 2xl:w-2/3">
                <h2 className="text-4xl font-bold text-blue-600">Drafts</h2>
                <hr className="w-full h-1 border-0 bg-blue-50 mt-6" />
                <Link href="/new-draft">
                  <button type="button" className="mt-8 hidden bg-blue-50 text-blue-600 font-bold text-2xl px-5 py-5 rounded-md">+ Start a new draft</button>
                </Link>
                <div className="mt-16 grid grid-cols-1 grid-rows-9 xl:grid-cols-3 xl:grid-rows-3 gap-8">
                    <Link href="/new-draft" className='bg-blue-50 transition duration-700 hover:scale-105 hover:bg-blue-500 hover:text-gray-50 hover:shadow-lg hover:shadow-blue-300 text-blue-600 text-2xl font-bold rounded-md h-full flex flex-col justify-center items-center px-5 py-5'>
                        + Start a new draft
                    </Link>
                    {
                        drafts.map(
                            draft =>
                            <Link href={`/my-drafts/${draft.id}`} key={draft.id}>
                                <div id={draft.id} className="h-full transition duration-700 hover:shadow-lg hover:shadow-blue-500 flex flex-col justify-between bg-blue-700 rounded-md px-5 py-4">
                                  <div className="flex flex-col justify-center items-center">
                                    <h3 className="text-2xl text-gray-50 font-bold">{draft.subject_line}</h3>
                                    <div className="mt-4 rounded-md bg-gray-50 px-3 py-4">
                                      <p className="text-xl">{draft.text.slice(0, 200)}</p>
                                    </div>
                                  </div>
                                  <div className="flex flex-row items-center justify-between">
                                    {
                                      (draft.status == "planning") &&
                                      <div className="mt-4 rounded-3xl text-lg bg-gray-50 text-gray-800 px-3 py-2 font-semibold">{draft.status}</div>
                                    }
                                    {
                                      (draft.status == "drafting") &&
                                      <div className="mt-4 rounded-3xl text-lg bg-blue-50 text-blue-800 px-3 py-2 font-semibold">{draft.status}</div>
                                    }
                                    {
                                      (draft.status == "finished") &&
                                      <div className="mt-4 rounded-3xl text-lg bg-green-50 text-green-800 px-3 py-2 font-semibold">{draft.status}</div>
                                    }
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