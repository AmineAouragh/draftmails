import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../api/supabase'
import Link from 'next/link'

export default function EditDraft() {

    const router = useRouter()
    const { draft_id } = router.query

    const [ subjectLine, setSubjectLine ] = useState('')
    const [ emailText, setEmailText ] = useState('')
    const [ drafts, setDrafts ] = useState([])
    const [ wordCount, setWordCount ] = useState(0)
    const [ readingTime, setReadingTime ] = useState(0)
    const [ status, setStatus ] = useState('writing')

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
        .update({ subject_line: subjectLine, text: emailText })
        .eq('id', draft_id)
      } else {
        const { data, error } = await supabase
        .from('drafts')
        .update({ subject_line: subjectLine, text: emailText })
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
        .select('subject_line, text')
        .eq('id', draft_id)
        setEmailText(drafts[0].text)
        setSubjectLine(drafts[0].subject_line)
    }

    useEffect(() => {
      getDrafts()
    }, [])

    useEffect(() => {
        getDraftData()
    }, [])

    function addNewDraft() {
      if (emailText.length >= 2) {
        editDraft()
      }
    }

    return (
        <div className="h-full py-4 px-2 relative w-full flex flex-col justify-center items-center">
            <h1 className="text-6xl font-bold text-blue-600">Draftmails 📝</h1>
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
                readingTime <= 1 &&
                <p className="bg-blue-50 font-semibold rounded-md px-5 py-3 text-blue-500 my-2 mr-2">Reading time: Less than a minute</p>
              }
              { readingTime >= 1 && <p className="bg-blue-50 font-semibold rounded-md px-5 py-3 text-blue-500 my-2">Reading time: About {readingTime} minutes</p> }
              </div>
              <div className="rounded-md py-2">
                <label htmlFor="status" className="font-semibold text-xl text-blue-400 mr-2">Status</label> 
                <select 
                  id="status" 
                  value={status} 
                  onChange={e => setStatus(e.target.value)} 
                  className="outline-none font-semibold bg-blue-500 text-lg px-2 py-1 rounded-md">
                  <option value="planning">Idea/Planning</option>
                  <option value="drafting">Drafting</option>
                  <option value="finished">Finished</option>
                </select>
              </div>
              </div>
              <textarea 
                value={emailText} 
                placeholder='What are you thinking about today?' 
                onChange={handleEmailText}
                className=" px-3 py-2 text-xl border-2 border-blue-600 outline-none rounded-lg" rows={22} cols={24}>
              </textarea>
              <button type="button" onClick={addNewDraft} className="bg-blue-600 text-gray-50 border-4 transition duration-600 hover:scale-110 active:scale-100 border-blue-600 text-xl font-bold rounded-lg px-3 py-2 mt-4">Save</button>
            </div>
        </div>
    )
}