import { useState, useEffect } from 'react'
import { supabase } from '../api/supabase'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { IoGridOutline } from "react-icons/io5";
import { CiCircleList } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import { CiCircleInfo } from "react-icons/ci";
import { BsThreeDots } from "react-icons/bs";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"




export default function Drafts() {

    const [ drafts, setDrafts ] = useState([])
    const [ filteredBy, setFilteredBy ] = useState('all')
    const [ plannedCount, setPlannedCount ] = useState(0)
    const [ draftingCount, setDraftingCount ] = useState(0)
    const [ finishedCount, setFinishedCount ] = useState(0)
    const [ searchKeyword, setSearchKeyword ] = useState('')
    const [ timestamp, setTimestamp ] = useState()
    const [ days, setDays ] = useState('')
    const [ totalWordsCount, setTotalWordsCount ] = useState(0)
    const [ view, setView ] = useState('grid')

    const router = useRouter()

    async function searchDrafts(search_keyword){
      let { data: drafts, error } = await supabase
      .from('drafts')
      .select('id, subject_line, text, status, length')
      .ilike('text', `%${search_keyword}%`)
      setDrafts(drafts)
      console.log(drafts)
    }

    function convertTimestampToDate(timestamp){
      return timestamp.toString().split(" ")[0]
    }

    function daysCounter(timestamp){
      let date = timestamp
      let today_day = new Date().getDate()
      let today_month = new Date().getMonth()
      return number_of_days 
    }

    function countTotalWords(arr){
      let sum = 0
      for (var i = 0; i < arr.length; i++){
        sum += i 
      }
      setTotalWordsCount(sum)
      return sum
    }


    async function showDrafts(){
        let { data: drafts, error } = await supabase
        .from('drafts')
        .select('id, created_at, subject_line, text, status, length')
        .eq('writer_id', 1)
        .order('created_at', { ascending: false });
        setDrafts(drafts)
        let planning = 0
        let drafting = 0
        let finished = 0
        let timestamps = []
        let wordcount_arr = []
        for (var draft of drafts){
          if (draft.status == "planning"){
            planning++
          } else if (draft.status == "drafting"){
            drafting++
          } else if (draft.status == "finished"){
            finished++
          }
          timestamps.push(draft.created_at)
          wordcount_arr.push(draft.length)
        }
        setTimestamp(timestamps)
        setTotalWordsCount(wordcount_arr)
        setPlannedCount(planning)
        setDraftingCount(drafting)
        setFinishedCount(finished)
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
            <div className="mt-24 2xl:w-2/3">
                <div className="flex flex-row items-center justify-between">
                  <p className="text-4xl w-fit font-bold text-blue-600">
                    Drafts 
                    <span className="bg-blue-600 text-gray-50 rounded-xl ml-2 px-4 py-1">
                      { filteredBy == "all" && drafts.length }
                      { filteredBy == "planning" && plannedCount }
                      { filteredBy == "drafting" && draftingCount }
                      { filteredBy == "finished" && finishedCount }
                    </span>
                  </p>
                  <div className="flex relative flex-row items-center w-1/2 justify-center my-4">
                    <input type="search" id="search" value={searchKeyword} onChange={e => setSearchKeyword(e.target.value)} className="relative rounded-full px-6 w-full py-4 border-2 text-blue-700 font-medium font-poppins border-gray-300 focus:border-blue-600 w-1/3 outline-none text-xl mr-3" placeholder='Search drafts by keyword...' />
                    <button type="button" onClick={() => searchDrafts(searchKeyword)} className="absolute right-6 rounded-full p-3 text-xl border-2 border-blue-600 font-medium bg-blue-600 text-gray-50 font-poppins">
                      <CiSearch />
                    </button>
                  </div>
                  <div className='flex flex-row items-center'>
                    <button type='button' onClick={() => setView('grid')} className='p-2 text-blue-700 bg-slate-50 text-xl mr-3 border border-blue-200 rounded-md'>
                      <IoGridOutline size={36} />
                    </button>
                    <button type='button' onClick={() => setView('list')} className='p-2 text-blue-700 bg-slate-50 text-xl border border-blue-200 rounded-md'>
                      <CiCircleList size={36} />
                    </button>
                  </div>
                  <div className="rounded-md py-2">
                      <select 
                        id="status" 
                        value={filteredBy}
                        onChange={e => setFilteredBy(e.target.value)}
                        className="outline-none font-bold border border-blue-200 focus:border-blue-500 bg-slate-50 text-blue-600 text-2xl px-3 py-2 rounded-xl">
                        <optgroup label="Status">
                        <option value="all" className="font-semibold">/all </option>
                        <option value="planning" className="font-semibold">/planning</option>
                        <option value="drafting" className="font-semibold">/drafting</option>
                        <option value="finished" className="font-semibold">/finished</option>
                        </optgroup>
                      </select>
                  </div>
                </div>
                <hr className="w-full h-1 border-none bg-blue-100 mt-6 mb-6" />
                <Link href="/new-draft">
                  <button type="button" className="mt-8 hidden bg-blue-50 text-blue-600 font-bold text-2xl px-5 py-5 rounded-md">+ Start a new draft</button>
                </Link>
                <Link href="/new-draft" className={`mb-4 border border-blue-400 bg-gradient-to-b from-blue-700 to-blue-500 font-poppins text-white hover:bg-blue-700 text-2xl font-bold rounded-md h-full flex flex-col justify-center items-center px-5 py-5`}>
                        + Start a new draft
                </Link>
                <div className={`mt-8 ${view == 'grid' ? "grid grid-cols-1 xl:grid-cols-3 gap-8" : "w-full flex flex-col"}`}>
                    
                    {
                      filteredBy == "all" &&
                        drafts.map(
                            draft =>
                                <div id={draft.id} className={`${view == 'list' ? 'mb-8 flex flex-row items-stretch' : 'flex flex-col px-5 py-4'} h-full justify-between border-2 border-blue-500 rounded-lg`}>
                                  <div className={`${view == 'list' ? 'flex flex-row items-stretch w-4/5 justify-between' : 'flex flex-col justify-center'}`}>
                                    <div className={`${view == 'list' ? 'bg-blue-500 text-white w-1/3 border-r border-blue-600' : 'bg-slate-50 text-blue-600'} flex flex-col justify-center items-center px-3 py-1 rounded-md`}>
                                      <h3 className={`text-lg text-center font-poppins`}>
                                        {draft.subject_line}
                                      </h3>
                                    </div>
                                    <Link href={`/my-drafts/${draft.id}`} key={draft.id} className={`${view == 'list' && 'w-2/3'}`}>
                                    <div className={`${view == 'grid' && "mt-4"} bg-slate-50 rounded-md p-5`}>
                                      <p className="text-lg font-poppins text-blue-600">
                                        {
                                          draft.text.length > 100 && (
                                            view == 'list' ? draft.text.slice(0, 100) + "... SEE MORE" : draft.text.slice(0, 200) + "... SEE MORE"
                                          )
                                        }
                                        {
                                          draft.text.length <= 100 && draft.text
                                        }
                                      </p>
                                    </div> 
                                    </Link>
                                  </div>
                                  <div className={`${view == 'grid' && 'mt-4'} flex flex-row items-center justify-between`}>
                                    {
                                      (draft.status == "planning") &&
                                      <>
                                      <div className="rounded-xl bg-gray-50 border text-lg font-poppins px-3 py-2 font-medium">
                                        {draft.status}
                                      </div>
                                      {
                                        view == 'list'
                                        ?
                                        <>
                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger>
                                                <button type='button'>
                                                  <CiCircleInfo size={42} className='text-blue-500 mx-4' />
                                                </button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p className='font-poppins text-lg'>{draft.length + " words"}</p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        </>
                                        :
                                        <>
                                          <p className="text-blue-500 rounded-xl px-3 py-2 font-poppins text-lg">
                                            {draft.length + " words"}
                                           </p>
                                        </>
                                      }
                                      {
                                        view == 'list'
                                        ?
                                        <>
                                         <DropdownMenu>
                                           <DropdownMenuTrigger>
                                             <BsThreeDots size={36} className='mr-4 text-blue-500' />
                                           </DropdownMenuTrigger>
                                           <DropdownMenuContent>
                                             <DropdownMenuItem className='font-poppins text-lg text-slate-700'>Edit</DropdownMenuItem>
                                             <DropdownMenuItem className='font-poppins text-lg text-slate-700'>Delete draft</DropdownMenuItem>
                                           </DropdownMenuContent>
                                         </DropdownMenu>
                                        </>
                                        :
                                        <>
                                          <button type="button" onClick={() => editDraft(draft.id)} className=" font-poppins text-gray-800 border-2 border-yellow-400 bg-yellow-400 rounded-lg px-3 py-2 text-lg font-bold">
                                            Edit 
                                          </button>
                                        </>
                                      }
                                      
                                      </>
                                    }
                                    {
                                      (draft.status == "drafting") &&
                                      <>
                                      <div className="rounded-xl font-poppins border text-lg bg-blue-600 text-blue-50 px-3 py-2 font-medium">{draft.status}</div>
                                      {
                                        view == 'list'
                                        ?
                                        <>
                                        <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger>
                                                <button type='button'>
                                                  <CiCircleInfo size={42} className='text-blue-500 mx-4' />
                                                </button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p className='font-poppins text-lg'>{draft.length + " words"}</p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        </>
                                        :
                                        <>
                                          <p className="text-blue-500 rounded-xl px-3 py-2 font-poppins text-lg">
                                            {draft.length + " words"}
                                           </p>
                                        </>
                                      }
                                      {
                                        view == 'list'
                                        ?
                                        <>
                                        <DropdownMenu>
                                           <DropdownMenuTrigger>
                                             <BsThreeDots size={36} className='mr-4 text-blue-500' />
                                           </DropdownMenuTrigger>
                                           <DropdownMenuContent>
                                             <DropdownMenuItem className='font-poppins text-lg text-slate-700'>Edit</DropdownMenuItem>
                                             <DropdownMenuItem className='font-poppins text-lg text-slate-700'>Delete draft</DropdownMenuItem>
                                           </DropdownMenuContent>
                                         </DropdownMenu>
                                        </>
                                        :
                                        <>
                                          <button type="button" onClick={() => editDraft(draft.id)} className=" font-poppins text-gray-800 border-2 border-yellow-400 bg-yellow-400 rounded-lg px-3 py-2 text-lg font-bold">
                                            Edit 
                                          </button>
                                        </>
                                      }
                                      </>
                                    }
                                    {
                                      (draft.status == "finished") &&
                                      <>
                                        <div className="rounded-xl border font-poppins text-lg bg-green-600 text-green-50 px-3 py-2 font-medium">{draft.status}</div>
                                        {
                                        view == 'list'
                                        ?
                                        <>
                                        <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger>
                                                <button type='button'>
                                                  <CiCircleInfo size={42} className='text-blue-500 mx-4' />
                                                </button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p className='font-poppins text-lg'>{draft.length + " words"}</p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        </>
                                        :
                                        <>
                                          <p className="text-blue-500 rounded-xl px-3 py-2 font-poppins text-lg">
                                            {draft.length + " words"}
                                           </p>
                                        </>
                                      }
                                      </>
                                    }
                                  </div>
                                </div>
                        )
                    }
                    {
                      filteredBy == "planning" &&
                        drafts.map(
                            draft =>
                                <div id={draft.id} className={`${draft.status == "planning" ? '' : 'hidden'} ${view == 'list' ? 'mb-8 flex flex-row items-stretch' : 'flex flex-col px-5 py-4'} h-full justify-between border-2 border-blue-500 rounded-lg`}>
                                  <div className={`${view == 'list' ? 'flex flex-row items-stretch w-4/5 justify-between' : 'flex flex-col justify-center'}`}>
                                    <div className={`${view == 'list' ? 'bg-blue-500 text-white w-1/3 border-r border-blue-600' : 'bg-slate-50 text-blue-600'} flex flex-col justify-center items-center px-3 py-1 rounded-md`}>
                                      <h3 className="text-lg text-center font-poppins">
                                        {draft.subject_line}
                                      </h3>
                                    </div>
                                    
                                    <Link href={`/my-drafts/${draft.id}`} key={draft.id} className={`${view == 'list' && 'w-2/3'}`}>
                                    <div className={`${view == 'grid' && 'mt-4'} bg-slate-50 rounded-md p-5`}>
                                      <p className="text-lg text-blue-600 font-poppins">
                                        {
                                          draft.text.length > 100 && (
                                            view == 'list' ? draft.text.slice(0, 100) + "... SEE MORE" : draft.text.slice(0, 200) + "... SEE MORE"
                                          )
                                        }
                                        {
                                          draft.text.length <= 100 && draft.text
                                        }
                                      </p>
                                    </div>
                                    </Link>
                                  </div>
                                  <div className={`${view == 'grid' && 'mt-4'} flex flex-row items-center justify-between`}>
                                    <div className="rounded-xl text-lg bg-gray-50 text-slate-800 px-3 py-2 font-poppins">{draft.status}</div>
                                      {
                                        view == 'list'
                                        ?
                                        <>
                                        <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger>
                                                <button type='button'>
                                                  <CiCircleInfo size={42} className='text-blue-500 mx-4' />
                                                </button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p className='font-poppins text-lg'>{draft.length + " words"}</p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        </>
                                        :
                                        <>
                                          <p className="text-blue-500 rounded-xl px-3 py-2 font-poppins text-lg">
                                            {draft.length + " words"}
                                           </p>
                                        </>
                                      }
                                      {
                                        view == 'list'
                                        ?
                                        <>
                                        <DropdownMenu>
                                           <DropdownMenuTrigger>
                                             <BsThreeDots size={36} className='mr-4 text-blue-500' />
                                           </DropdownMenuTrigger>
                                           <DropdownMenuContent>
                                             <DropdownMenuItem className='font-poppins text-lg text-slate-700'>Edit</DropdownMenuItem>
                                             <DropdownMenuItem className='font-poppins text-lg text-slate-700'>Delete draft</DropdownMenuItem>
                                           </DropdownMenuContent>
                                         </DropdownMenu>
                                        </>
                                        :
                                        <>
                                          <button type="button" onClick={() => editDraft(draft.id)} className=" font-poppins text-gray-800 border-2 border-yellow-400 bg-yellow-400 rounded-lg px-3 py-2 text-lg font-bold">
                                            Edit 
                                          </button>
                                        </>
                                      }
                                  </div>
                                </div>
                            
                        )   
                    }
                    {
                      filteredBy == "drafting" &&
                        drafts.map(
                            draft =>
                            
                                <div id={draft.id} className={`${draft.status == "drafting" ? '' : 'hidden'} ${view == 'list' ? 'mb-8 flex flex-row items-stretch' : 'flex flex-col px-5 py-4'} h-full justify-between border-2 border-blue-500 rounded-lg`}>
                                  <div className={`${view == 'list' ? 'flex flex-row items-stretch w-4/5 justify-between' : 'flex flex-col justify-center'}`}>
                                    <div className={`${view == 'list' ? 'bg-blue-500 text-white w-1/3 border-r border-blue-600' : 'bg-slate-50 text-blue-600'} flex flex-col justify-center items-center px-3 py-1 rounded-md`}>
                                    <h3 className="text-lg text-center font-poppins">
                                      {draft.subject_line}
                                    </h3>
                                    </div>
                                    <Link href={`/my-drafts/${draft.id}`} key={draft.id} className={`${view == 'list' && 'w-2/3'}`}>
                                    <div className={`${view == 'grid' && 'mt-4'} bg-slate-50 rounded-md p-5`}>
                                      <p className="text-lg text-blue-600 font-poppins">
                                        {
                                          draft.text.length > 100 && (
                                            view == 'list' ? draft.text.slice(0, 100) + "... SEE MORE" : draft.text.slice(0, 200) + "... SEE MORE"
                                          )
                                        }
                                        {
                                          draft.text.length <= 100 && draft.text
                                        }
                                      </p>
                                    </div>
                                    </Link>
                                  </div>
                                  <div className={`${view == 'grid' && 'mt-4'} flex flex-row items-center justify-between`}>
                                    <div className="rounded-xl text-lg bg-blue-50 text-blue-800 px-3 py-2 font-poppins">{draft.status}</div>
                                      {
                                        view == 'list'
                                        ?
                                        <>
                                        <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger>
                                                <button type='button'>
                                                  <CiCircleInfo size={42} className='text-blue-500 mx-4' />
                                                </button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p className='font-poppins text-lg'>{draft.length + " words"}</p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        </>
                                        :
                                        <>
                                          <p className="text-blue-500 rounded-xl px-3 py-2 font-poppins text-lg">
                                            {draft.length + " words"}
                                           </p>
                                        </>
                                      }
                                      {
                                        view == 'list'
                                        ?
                                        <>
                                        <DropdownMenu>
                                           <DropdownMenuTrigger>
                                             <BsThreeDots size={36} className='mr-4 text-blue-500' />
                                           </DropdownMenuTrigger>
                                           <DropdownMenuContent>
                                             <DropdownMenuItem className='font-poppins text-lg text-slate-700'>Edit</DropdownMenuItem>
                                             <DropdownMenuItem className='font-poppins text-lg text-slate-700'>Delete draft</DropdownMenuItem>
                                           </DropdownMenuContent>
                                         </DropdownMenu>
                                        </>
                                        :
                                        <>
                                          <button type="button" onClick={() => editDraft(draft.id)} className=" font-poppins text-gray-800 border-2 border-yellow-400 bg-yellow-400 rounded-lg px-3 py-2 text-lg font-bold">
                                            Edit 
                                          </button>
                                        </>
                                      }
                                  </div>
                                </div>
                            
                        )   
                    }
                    {
                      filteredBy == "finished" &&
                        drafts.map(
                            draft =>
                                <div id={draft.id} className={`${draft.status == "finished" ? '' : 'hidden'} ${view == 'list' ? 'mb-8 flex flex-row items-stretch' : 'flex flex-col px-5 py-4'} h-full justify-between border-2 border-blue-500 rounded-lg`}>
                                  <div className={`${view == 'list' ? 'flex flex-row items-stretch w-4/5 justify-between': 'flex flex-col justify-center'}`}>
                                    <div className={`${view == 'list' ? 'bg-blue-500 text-white w-1/3 border-r border-blue-600' : 'bg-slate-50 text-blue-600'} flex flex-col justify-center items-center px-3 py-1 rounded-md`}>
                                    <h3 className="text-lg text-center font-poppins">{draft.subject_line}</h3>
                                    </div>
                                    <Link href={`/my-drafts/${draft.id}`} key={draft.id} className={`${view == 'list' && 'w-2/3'}`}>
                                    <div className={`${view == 'grid' && 'mt-4'} bg-slate-50 rounded-md p-5`}>
                                      <p className="text-lg text-blue-600 font-poppins">
                                        {
                                          draft.text.length > 100 && (
                                            view == 'list' ? draft.text.slice(0, 100) + "... SEE MORE" : draft.text.slice(0, 200) + "... SEE MORE"
                                          )
                                        }
                                        {
                                          draft.text.length <= 100 && draft.text
                                        }
                                      </p>
                                    </div>
                                    </Link>
                                  </div>
                                  <div className={`${view == 'grid' && 'mt-4'} flex flex-row items-center justify-between`}>
                                    <div className="rounded-xl text-lg bg-green-600 text-white px-3 py-2 font-poppins">{draft.status}</div>
                                      {
                                        view == 'list'
                                        ?
                                        <>
                                        <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger>
                                                <button type='button'>
                                                  <CiCircleInfo size={42} className='text-blue-500 mx-4' />
                                                </button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p className='font-poppins text-lg'>{draft.length + " words"}</p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        </>
                                        :
                                        <>
                                          <p className="text-blue-500 rounded-xl px-3 py-2 font-poppins text-lg">
                                            {draft.length + " words"}
                                           </p>
                                        </>
                                      }
                                  </div>
                                </div>
                        )   
                    }
                </div>
            </div>
        </div>
        
      </>
    )
}