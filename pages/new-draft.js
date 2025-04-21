import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from './api/supabase'
import Link from 'next/link'
import Head from 'next/head'
import { CiCircleInfo } from "react-icons/ci";
import { IoCloseCircleOutline } from "react-icons/io5";
import EmojiPicker from 'emoji-picker-react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function NewDraft() {

    const router = useRouter()

    const [ subjectLine, setSubjectLine ] = useState('')
    const [ emailText, setEmailText ] = useState('')
    const [ drafts, setDrafts ] = useState([])
    const [ wordCount, setWordCount ] = useState(0)
    const [ readingTime, setReadingTime ] = useState(0)
    const [ status, setStatus ] = useState('planning')
    const [ loading, setLoading ] = useState(false)
    const [ zenModeActive, setZenModeActive ] = useState(false)

    function handleEmailText(e) {
      setEmailText(e.target.value)
      let word_count = emailText.split(/\s/).filter(Boolean).length
      setWordCount(word_count)
      calculateReadingTime()
    }


    function calculateReadingTime(){
      let wpm = 180
      let reading_time = (wordCount / wpm).toFixed(2)
      setReadingTime(reading_time)
    }

    async function insertNewDraft(){
      if (subjectLine == '') {
        let subject_line = "Untitled"
        const { data, error } = await supabase
        .from('drafts')
        .insert([
          { subject_line: subject_line, text: emailText, status: status, length: wordCount, writer_id: 1 }
        ])
      } else {
        const { data, error } = await supabase
        .from('drafts')
        .insert([
          { subject_line: subjectLine, text: emailText, status: status, length: wordCount, writer_id: 1 }
        ])
      }
    }

    

    async function getDrafts() {
      let { data: drafts, error } = await supabase
      .from('drafts')
      .select(`
        writer_id(
          newsletter
        )
      `)
      setDrafts(drafts)
    }

    useEffect(() => {
      getDrafts()
    }, [])

    function addNewDraft() {
      if (emailText.length >= 2) {
        setLoading(true)
        insertNewDraft()
        setTimeout(() => setLoading(false), 2000)
        setTimeout(() => router.push('/my-drafts'), 2000)
      }
    }

    const emojis = ['🔥', '🎉', '✨', '😱', '😂', '🤣', '🤦‍♂️', '🤑', '🚀', '🙂', '❤', '👋'];

    function copyEmojiToClipboard(emoji){
      navigator.clipboard.writeText(emoji).then(() => {
        console.log(`${emoji} copied!`)
      }).catch(err => {
        console.error('Failed to copy!', err)
      });
    }

    return (
      <>
        <Head>
          <link href="https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Cairo:wght@200..1000&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500&family=Rubik+Doodle+Shadow&display=swap" rel="stylesheet" />
          <title>Draftmails</title>
        </Head>
        <div className="bg-gradient-to-b from-indigo-700 via-blue-700 to-blue-600 h-screen py-4 px-2 w-full flex flex-col justify-center items-center">
            <div className='w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto flex flex-row top-2 absolute items-center justify-end'>
            <button type='button' onClick={() => setZenModeActive(!zenModeActive)} className='text-lg flex flex-row items-center text-white font-Inter'>
              <span className='mr-2 font-bold'>Zen Mode</span>
              <input type='checkbox' onChange={() => setZenModeActive(!zenModeActive)} className='rounded-full' />
            </button>
            </div>
            <h1 className={`${zenModeActive ? "hidden" : ""} mt-8 text-5xl font-bold font-poppins text-white`}>Draftmails</h1>
            <p className={`${zenModeActive ? "hidden" : ""} font-Inter mt-4 text-white text-center`}>Breathe In. Write Out.</p>
            <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto mt-12 flex flex-col">
              <div className='flex flex-row w-full items-center justify-between'>
                <input 
                  type="text" 
                  placeholder='Subject line' 
                  value={subjectLine} 
                  onChange={e => setSubjectLine(e.target.value)} 
                  id="subject_line" 
                  maxLength={60}
                  className="bg-transparent text-3xl font-bold placeholder-gray-200 text-white outline-none font-Inter" 
                />
                <div>
                  <Popover>
                    <PopoverTrigger className='bg-blue-700 text-white font-Inter text-lg font-bold px-2 py-1 border border-blue-600 rounded-md'>
                      🙂 <span className={`${zenModeActive ? "hidden" : ""}`}>Add an Emoji</span>
                    </PopoverTrigger>
                    <PopoverContent className="grid grid-cols-4 gap-2">
                      {
                        emojis.map(
                          (emoji, index) => (
                            <button title={emoji} key={index} onClick={() => copyEmojiToClipboard(emoji)} type='button' className='rounded-md py-2 text-xl border bg-white'>
                              {emoji}
                            </button>
                          )
                        )
                      }
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className={`${zenModeActive ? "hidden" : ""} flex bg-blue-700 mt-2 flex-row items-center justify-between w-fit py-1 px-2 rounded-sm`}>
                <p className='font-Inter text-sm text-slate-100 mr-2'>Write something they <span className='font-bold'>*have*</span> to click. Recommended length: 30 to 60 characters</p>
                <IoCloseCircleOutline className='text-white text-xl' />
              </div>
              <div className="flex w-full flex-col mt-6 rounded-lg">
                <textarea 
                  value={emailText} 
                  placeholder='What are you thinking about today? No pressure - just start.' 
                  onChange={handleEmailText} 
                  className={`${zenModeActive ? "bg-transparent placeholder-gray-200 text-white" : "rounded-tr-xl rounded-tl-xl p-4"} text-xl font-Inter outline-none scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-50`} rows={16} cols={24}>
                </textarea>
                <div className={`${zenModeActive ? "hidden" : ""} flex flex-row items-center rounded-br-xl rounded-bl-xl py-2 border-t border-slate-200 bg-gray-50 justify-end`}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                          <CiCircleInfo size={42} className='text-blue-700 font-bold mx-4' />
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-700">
                        <p className='font-poppins text-lg'>
                        { wordCount < 1 && <p className="font-semibold text-slate-200 text-sm font-Inter my-2 mr-2">Email length: 0 words</p> }
                        { wordCount >= 1 && <p className="font-semibold text-sm font-Inter text-slate-200 my-2 mr-2">Email length: {wordCount} words</p> }
                        { readingTime < 1 && <p className="font-semibold text-sm text-slate-200 font-Inter my-2 mr-2">Reading time: Less than a minute</p> }
                        { readingTime >= 1 && <p className="font-semibold text-sm font-Inter text-slate-200 my-2">Reading time: About {readingTime} minutes</p> }
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <div className='mt-6 w-full flex flex-row items-center justify-between'>
                <button type="button" onClick={addNewDraft} className={`${zenModeActive ? "hidden" : ""} w-3/4 mr-4 bg-white font-poppins text-blue-600 text-xl font-bold rounded-full px-8 py-3`}>
                  {
                        loading 
                        ? 
                        <div className="flex flex-row items-center border-2 border-blue-700 px-3 py-2 bg-blue-700 rounded-lg">
                          <svg role="status" className="w-8 h-8 text-gray-50 animate-spin fill-blue-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                          </svg>
                          <p className="text-xl font-poppins text-blue-800 font-bold ml-2">Saving...</p>
                        </div>
                        :
                        <span>Save new draft</span>
                  }
                </button>
                <div className={`${zenModeActive ? "hidden" : ""} rounded-md py-4 flex flex-row items-center`}>
                  <label htmlFor="status" className="font-semibold text-xl text-white font-Inter mr-2">Status</label> 
                  <Select onValueChange={value => setStatus(value)} className="font-bold">
                    <SelectTrigger className=" bg-white text-xl font-bold border-white border outline-none font-Inter">
                      <SelectValue placeholder="Select a draft status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="planning" className="font-poppins font-semibold">Planning</SelectItem>
                        <SelectItem value="drafting" className="font-poppins font-semibold">Drafting</SelectItem>
                        <SelectItem value="finished" className="font-poppins font-semibold">Finished</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                
                </div>
              </div> 
             
            </div>
        </div>
      </>
    )
}