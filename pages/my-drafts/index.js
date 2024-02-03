import { useState, useEffect } from 'react'
import { supabase } from '../api/supabase'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Drafts() {

    const [ drafts, setDrafts ] = useState([])
    const [ filteredBy, setFilteredBy ] = useState('all')
    const [ plannedCount, setPlannedCount ] = useState(0)
    const [ draftingCount, setDraftingCount ] = useState(0)
    const [ finishedCount, setFinishedCount ] = useState(0)
    const router = useRouter()


    async function showDrafts(){
        let { data: drafts, error } = await supabase
        .from('drafts')
        .select('id, subject_line, text, status, length')
        .eq('writer_id', 1)
        setDrafts(drafts)
        let planning = 0
        let drafting = 0
        let finished = 0
        for (var draft of drafts){
          if (draft.status == "planning"){
            planning++
          } else if (draft.status == "drafting"){
            drafting++
          } else if (draft.status == "finished"){
            finished++
          }
        }
        setPlannedCount(planning)
        setDraftingCount(drafting)
        setFinishedCount(finished)
        console.log(drafts)
    }

    async function getUserData(){
        let { data: users, error } = await supabase
        .from('users')
        .select('name, newsletter')
    }

    async function editDraft(draft_id) {
      router.push(`/my-drafts/${draft_id}/edit`)
    }

    useEffect(() => {
        showDrafts()
    }, [])

    return (
      <>
        <Head>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500&family=Rubik+Doodle+Shadow&display=swap" rel="stylesheet" />
            <title>Draftmails</title>
        </Head>
        <div className="h-full py-4 px-2 relative w-full flex flex-col justify-center items-center">
            <h1 className="text-8xl font-bold font-poppins text-blue-600">Draftmails</h1>
            <p className="text-2xl font-bold text-blue-800">by Amine</p>
            <div className="mt-24 2xl:w-2/3">
                <div className="flex flex-row items-center justify-between">
                  <p className="text-4xl font-bold text-blue-600">
                    Drafts 
                    <span className="bg-blue-600 text-gray-50 rounded-xl ml-2 px-4 py-1">
                      { filteredBy == "all" && drafts.length }
                      { filteredBy == "planning" && plannedCount }
                      { filteredBy == "drafting" && draftingCount }
                      { filteredBy == "finished" && finishedCount }
                    </span>
                  </p>
                  <div className="rounded-md py-2">
                      <label htmlFor="status" className="font-bold text-2xl text-blue-600 mr-2">Filter by:</label> 
                      <select 
                        id="status" 
                        value={filteredBy}
                        onChange={e => setFilteredBy(e.target.value)}
                        className="outline-none font-bold border-2 border-blue-100 focus:border-blue-500 bg-blue-50 text-blue-600 text-2xl px-3 py-2 rounded-xl">
                        <optgroup label="Status">
                        <option value="all" className="font-semibold">/all </option>
                        <option value="planning" className="font-semibold">/planning</option>
                        <option value="drafting" className="font-semibold">/drafting</option>
                        <option value="finished" className="font-semibold">/finished</option>
                        </optgroup>
                      </select>
                  </div>
                </div>
                <hr className="w-full h-1 border-0 bg-blue-50 mt-6" />
                {
                  filteredBy == "all" && <p className="mt-4 text-gray-600 text-lg">All your drafts</p>
                }
                {
                  filteredBy == "planning" && <p className="mt-4 text-gray-600 text-lg">You have <span className="text-blue-600">{plannedCount} drafts</span> in early stage: brainstorming, writing notes down, outlining...</p>
                }
                {
                  filteredBy == "finished" && <p className="mt-4 text-gray-600 font-bold text-lg"><span className="font-bold text-green-600">{finishedCount} drafts</span> are finished and ready to be sent. One last review and you&apos;re good to go!</p>
                }
                <Link href="/new-draft">
                  <button type="button" className="mt-8 hidden bg-blue-50 text-blue-600 font-bold text-2xl px-5 py-5 rounded-md">+ Start a new draft</button>
                </Link>
                <div className="mt-10 grid grid-cols-1 grid-rows-9 xl:grid-cols-3 xl:grid-rows-3 gap-8">
                    <Link href="/new-draft" className='bg-blue-50 transition duration-700 hover:bg-blue-500 hover:text-gray-50 hover:shadow-lg hover:shadow-blue-300 text-blue-600 text-2xl font-bold rounded-md h-full flex flex-col justify-center items-center px-5 py-5'>
                        + Start a new draft
                    </Link>
                    {
                      filteredBy == "all" &&
                        drafts.map(
                            draft =>
                            <Link href={`/my-drafts/${draft.id}`} key={draft.id}>
                                <div id={draft.id} className="h-full flex flex-col justify-between bg-blue-600 border-2 border-blue-600 rounded-md px-5 py-4">
                                  <div className="flex flex-col justify-center items-center">
                                    <h3 className="text-xl text-center font-poppins text-blue-600 bg-gray-50 rounded-md px-3 py-1 shadow-md shadow-blue-700 font-bold">{draft.subject_line}</h3>
                                    <div className="mt-4 bg-gray-50 rounded-md px-3 py-4">
                                      <p className="text-xl font-poppins font-medium">{draft.text.length > 200 ? draft.text.slice(0, 200) + "... SEE MORE" : draft.text}</p>
                                    </div> 
                                  </div>
                                  <div className="flex flex-row mt-4 items-center justify-between">
                                    {
                                      (draft.status == "planning") &&
                                      <div className="rounded-xl text-lg bg-gray-50 text-gray-800 px-3 py-2 font-semibold">{draft.status + " 🤔"}</div>
                                    }
                                    {
                                      (draft.status == "drafting") &&
                                      <div className="rounded-xl text-lg bg-blue-50 text-blue-800 px-3 py-2 font-semibold">{draft.status + " ✏️"}</div>
                                    }
                                    {
                                      (draft.status == "finished") &&
                                      <div className="rounded-xl text-lg bg-green-500 text-gray-50 px-3 py-2 font-semibold">{draft.status + " 🎉"}</div>
                                    }
                                    <p className="text-blue-50 bg-blue-500 rounded-xl px-3 py-2 text-lg font-bold">{draft.length + " words"}</p>
                                  </div>
                                </div>
                            </Link>
                        )
                    }
                    {
                      filteredBy == "planning" &&
                        drafts.map(
                            draft =>
                            
                            <Link href={`/my-drafts/${draft.id}`} key={draft.id} className={`${draft.status == "planning" ? '' : 'hidden'}`}>
                                <div id={draft.id} className="h-full flex flex-col justify-between bg-blue-600 border-2 border-blue-600 rounded-md px-5 py-4">
                                  <div className="flex flex-col justify-center items-center">
                                    <h3 className="text-xl text-center font-poppins text-blue-600 bg-gray-50 rounded-md px-3 py-1 shadow-md shadow-blue-700 font-bold">{draft.subject_line}</h3>
                                    <div className="mt-4 bg-gray-50 rounded-md px-3 py-4">
                                      <p className="text-xl font-medium font-poppins">{draft.text.length > 200 ? draft.text.slice(0, 200) + "... SEE MORE" : draft.text}</p>
                                    </div>
                                  </div>
                                  <div className="flex mt-4 flex-row items-center justify-between">
                                    <div className="rounded-xl text-lg bg-gray-50 text-gray-800 px-3 py-2 font-semibold">{draft.status + " 🤔"}</div>
                                    <p className="text-blue-50 bg-blue-500 rounded-xl px-3 py-2 text-lg font-bold">{draft.length + " words"}</p>
                                    <p className="text-gray-800 bg-yellow-400 rounded-xl px-3 py-2 text-lg font-bold">Edit ✏️</p>
                                  </div>
                                </div>
                            </Link>
                            
                        )   
                    }
                    {
                      filteredBy == "drafting" &&
                        drafts.map(
                            draft =>
                            
                                <div id={draft.id} className={`${draft.status == "drafting" ? '' : 'hidden'} h-full flex flex-col justify-between bg-blue-600 border-2 border-blue-600 rounded-md px-5 py-4`}>
                                  <div className="flex flex-col justify-center items-center">
                                    <h3 className="text-xl text-center font-poppins text-blue-600 bg-gray-50 rounded-md px-3 py-1 shadow-md shadow-blue-700 font-bold">{draft.subject_line}</h3>
                                    <Link href={`/my-drafts/${draft.id}`} key={draft.id}>
                                    <div className="mt-4 bg-gray-50 rounded-md px-3 py-4">
                                      <p className="text-xl font-medium font-poppins">{draft.text.length > 200 ? draft.text.slice(0, 200) + "... SEE MORE" : draft.text}</p>
                                    </div>
                                    </Link>
                                  </div>
                                  <div className="flex mt-4 flex-row items-center justify-between">
                                    <div className="rounded-xl text-lg bg-blue-50 text-blue-800 px-3 py-2 font-semibold">{draft.status + " ✏️"}</div>
                                    <p className="text-blue-50 bg-blue-500 rounded-xl px-3 py-2 text-lg font-bold">{draft.length + " words"}</p>
                                    <button type="button" onClick={() => editDraft(draft.id)} className="text-gray-800 border-2 border-yellow-400 bg-yellow-400 rounded-xl px-3 py-2 text-lg font-bold">Edit ✏️</button>
                                  </div>
                                </div>
                            
                        )   
                    }
                    {
                      filteredBy == "finished" &&
                        drafts.map(
                            draft =>
                            
                            <Link href={`/my-drafts/${draft.id}`} key={draft.id} className={`${draft.status == "finished" ? '' : 'hidden'}`}>
                                <div id={draft.id} className="h-full flex flex-col justify-between bg-blue-600 border-2 border-blue-600 rounded-md px-5 py-4">
                                  <div className="flex flex-col justify-center items-center">
                                    <h3 className="text-xl text-center font-poppins text-blue-600 bg-gray-50 rounded-md px-3 py-1 shadow-md shadow-blue-700 font-bold">{draft.subject_line}</h3>
                                    <div className="mt-4 bg-gray-50 rounded-md px-3 py-4">
                                      <p className="text-xl font-medium font-poppins">{draft.text.length > 200 ? draft.text.slice(0, 200) + "... SEE MORE" : draft.text}</p>
                                    </div>
                                  </div>
                                  <div className="flex mt-4 flex-row items-center justify-between">
                                    <div className="rounded-xl text-lg bg-green-500 text-gray-50 px-3 py-2 font-semibold">{draft.status + " 🎉"}</div>
                                    <p className="text-blue-50 text-lg font-bold bg-blue-500 px-3 py-2 rounded-xl">{draft.length + " words"}</p>
                                  </div>
                                </div>
                            </Link>
                            
                        )   
                    }
                </div>
            </div>
        </div>
        
      </>
    )
}