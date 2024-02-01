import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../api/supabase'
import Link from 'next/link'

export default function EditDraft() {

    const router = useRouter()
    const { draft_id } = router.query

    const [ loading, setLoading ] = useState(false)
    const [ subjectLine, setSubjectLine ] = useState('')
    const [ emailText, setEmailText ] = useState('')
    const [ drafts, setDrafts ] = useState([])
    const [ wordCount, setWordCount ] = useState()
    const [ readingTime, setReadingTime ] = useState(0)
    const [ status, setStatus ] = useState('')

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

    async function editDraft(){
        
      if (subjectLine == '') {
        let subject_line = ''
        if (drafts.length == 0) {
          subject_line = "Email #1"
        } else {
          subject_line = drafts[0].writer_id.newsletter + " email #" + drafts.length+1 
        }
        setSubjectLine(subject_line)
        const { data, error } = await supabase
        .from('drafts')
        .update({ subject_line: subjectLine, text: emailText, length: wordCount, status: status })
        .eq('id', draft_id)
      } else {
        const { data, error } = await supabase
        .from('drafts')
        .update({ subject_line: subjectLine, text: emailText, length: wordCount, status: status })
        .eq('id', draft_id)
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

    async function getDraftData() {
        let { data: drafts, error } = await supabase
        .from('drafts')
        .select('subject_line, text, length, status')
        .eq('id', draft_id)
        setEmailText(drafts[0].text)
        setSubjectLine(drafts[0].subject_line)
        setWordCount(drafts[0].length)
        setStatus(drafts[0].status)
    }

    useEffect(() => {
      getDrafts()
    }, [])

    useEffect(() => {
        getDraftData()
    }, [])

    function addNewDraft() {
      if (emailText.length >= 2) {
        setLoading(true)
        editDraft()
        setTimeout(() => setLoading(false), 2000)
        setTimeout(() => router.push("/my-drafts"), 2000)
      }
    }

    return (
        <div className="h-full py-4 px-2 relative w-full flex flex-col justify-center items-center">
            <h1 className="text-6xl font-bold text-blue-600">Draftmails</h1>
            <p className="text-lg font-bold text-blue-800">by Amine</p>
            <div className="2xl:w-1/2 mx-auto flex flex-col">
              <div className="flex flex-row items-center justify-between w-full mt-8">
                <div className="flex flex-row items-center mr-2 justify-between py-2 w-3/4 px-4 bg-blue-700 rounded-xl">
                  <label htmlFor="subject_line" className="text-xl text-gray-50 font-bold mr-2 w-1/4">My subject line:</label>
                  <input type="text" value={subjectLine} onChange={e => setSubjectLine(e.target.value)} id="subject_line" className="w-3/4 rounded-lg outline-none px-2 py-1 text-xl" />
                </div>
                <Link href="/my-drafts" className="2xl:w-1/4">
                  <button type="button" className="rounded-xl w-full px-5 py-2 font-semibold text-blue-500 bg-blue-50 text-lg">My drafts</button>
                </Link>
              </div>
              <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center justify-start">
              {
                wordCount < 1 &&
                
                  <p className="bg-blue-50 font-semibold rounded-md px-5 py-3 text-blue-500 my-2 mr-2">Email length: 0 words</p>
              }
              {
                wordCount >= 1 && <p className="bg-blue-50 font-semibold rounded-md px-5 py-3 text-blue-500 my-2 mr-2">Email length: {wordCount} words</p>
              }
              {
                readingTime < 1 &&
                <p className="bg-blue-50 font-semibold rounded-md px-5 py-3 text-blue-500 my-2 mr-2">Reading time: Less than a minute</p>
              }
              { readingTime >= 1 && <p className="bg-blue-50 font-semibold rounded-md px-5 py-3 text-blue-500 my-2">Reading time: About {readingTime} minutes</p> }
              </div>
              <div className="rounded-md py-2">
                <label htmlFor="status" className="font-semibold text-xl text-blue-600 mr-2">Status</label> 
                <select 
                  id="status" 
                  value={status} 
                  onChange={e => setStatus(e.target.value)} 
                  className="outline-none bg-blue-500 text-gray-50 font-semibold text-lg px-2 py-1 rounded-md">
                  <option value="planning" className="font-semibold">Idea/Planning</option>
                  <option value="drafting" className="font-semibold">Drafting</option>
                  <option value="finished" className="font-semibold">Finished</option>
                </select>
              </div>
              </div>
              
              <div className="flex flex-col border-4 border-blue-600 rounded-lg">
                <textarea 
                  value={emailText} 
                  placeholder='What are you thinking about today?' 
                  onChange={handleEmailText} 
                  className="text-xl font-semibold text-blue-900 rounded-lg px-3 pt-2 outline-none scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-50" rows={20} cols={24}>
                </textarea>
                <div className="bg-blue-50 border-t-2 flex flex-row justify-start border-blue-100 px-2 py-4 rounded-bl-lg rounded-br-lg">
                  {
                    loading
                    ?
                    <div className="flex flex-row items-center border-2 border-blue-700 px-3 py-2 bg-blue-700 rounded-lg">
                        <svg role="status" className="w-8 h-8 text-gray-50 animate-spin fill-blue-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <p className="text-xl text-gray-50 font-bold ml-2">Saving...</p>
                    </div> 
                    :
                    <button type="button" onClick={addNewDraft} className="bg-blue-600 text-gray-50 border-4 transition duration-600 hover:bg-blue-700 hover:border-blue-700 border-blue-600 text-xl font-bold rounded-lg px-3 py-2">
                      Edit draft
                    </button>
                  }
                </div>
              </div>
            </div>
        </div>
    )
}