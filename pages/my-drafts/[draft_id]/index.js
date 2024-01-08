import { supabase } from '../../api/supabase'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Draft(){

    const router = useRouter()
    const { draft_id } = router.query

    const [ subjectLine, setSubjectLine ] = useState('')
    const [ emailText, setEmailText ] = useState('')
    const [ writerName, setWriterName ] = useState('')
    const [ wordCount, setWordCount ] = useState('')
    const [ status, setStatus ] = useState('')

    async function getDraftData(){
        let { data: drafts, error } = await supabase
        .from('drafts')
        .select(`
          subject_line, 
          text,
          length,
          status,
          writer_id(
            name
          )
        `)
        .eq('id', draft_id)
        setSubjectLine(drafts[0].subject_line)
        let formatted_text = drafts[0].text.replace(/\n/g, '<br />')
        setEmailText(formatted_text)
        setWriterName(drafts[0].writer_id.name)
        setWordCount(drafts[0].length)
        setStatus(drafts[0].status)

    }

    useEffect(() => {
        getDraftData()
    }, [])

    function buildDraftLink(){
      let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      let code = ""
      while (code.length < 15) {
        code += Math.random(numbers)
      }

      let formatted_name = ""
      if (writerName.split(" ").length > 1) {
        formatted_name = writerName.split(" ").join("-").toLowerCase()
      } else {
        formatted_name = writerName
      }
      let formatted_subject_line = ""
      if (subjectLine.split(" ").length > 1) {
        formatted_subject_line = subjectLine.split(" ").join("-").toLowerCase()
      } else {
        formatted_subject_line = subjectLine
      }
      let draft_link = `${formatted_name}/secret-draft-${code}`
      console.log(draft_link)
      alert("Your secret draft link was created. Anybody who has the secret draft link can view the draft." + "\n" +draft_link)
    }

    function handleCopyClick(text) {
        // Create a temporary textarea element to execute the copy command
        const tempTextArea = document.createElement('textarea');
        const formattedText = text.replace(/<br \/>/g, '\n')
        tempTextArea.value = formattedText;
      
        // Set the position to be off-screen
        tempTextArea.style.position = 'absolute';
        tempTextArea.style.left = '-9999px';
      
        // Append the textarea to the DOM
        document.body.appendChild(tempTextArea);
      
        // Select the text inside the textarea
        tempTextArea.select();
      
        // Execute the copy command
        document.execCommand('copy');
      
        // Remove the temporary textarea from the DOM
        document.body.removeChild(tempTextArea);
      
        // You can also provide feedback to the user, e.g., using a tooltip or alert
        alert('Text copied to clipboard!');
    }

    async function deleteDraft() {
      const { error } = await supabase
      .from('drafts')
      .delete()
      .eq('id', draft_id)
      router.push('/my-drafts')
    }

    async function editDraft() {
      router.push(`/my-drafts/${draft_id}/edit`)
    }

    return (
        <div className="flex flex-col justify-center items-center relative w-full h-full px-2 py-8">
            <h2 className="text-6xl font-bold text-blue-600">
              <Link href="/new-draft">
              Draftmails
              </Link>
            </h2>
            <p className="text-lg font-bold text-blue-800">by Amine</p>
            
            <div className="2xl:w-1/2 rounded-md px-6 py-3 mt-8">
              <h1 className="text-4xl text-gray-50 bg-blue-600 rounded-md px-3 py-2 font-bold text-center">{subjectLine}</h1>
              <div className="flex flex-row items-center justify-between mt-8">
                <p className="rounded-2xl py-2 text-blue-500 text-xl font-bold mr-8">{writerName}</p>
                <div>
                <button type="button" onClick={() => handleCopyClick(emailText)} className="rounded-2xl bg-gray-100 text-gray-900 font-semibold text-xl px-5 py-2 mr-2">Copy</button>
                <button type="button" onClick={editDraft} className="rounded-2xl bg-yellow-50 text-yellow-700 font-semibold text-xl px-5 py-2 mr-2">Edit</button>
                <button type="button" onClick={buildDraftLink} className="rounded-2xl bg-green-50 text-green-600 font-semibold text-xl px-5 py-2 mr-2">Share</button>
                <button type="button" onClick={deleteDraft} className="rounded-2xl bg-red-50 text-red-600 font-semibold text-xl px-5 py-2 mr-2">Delete</button>
                <button type="button" onClick={() => router.push("/my-drafts")} className="text-blue-600 font-semibold text-lg px-5 py-2 hover:bg-blue-50 rounded-2xl duration-700 transition">Drafts</button>
                </div>
              </div>
              <div className="flex flex-row justify-start items-center">
                <p className="rounded-2xl px-2 py-1 bg-gray-600 text-gray-50 font-semibold mr-2">{wordCount} words</p>
                <p className="rounded-2xl px-2 py-1 bg-gray-100 text-gray-600 font-semibold">{status}</p>
              </div>
              <p className="text-xl rounded-md p-2 bg-blue-50 mt-4" dangerouslySetInnerHTML={{ __html: emailText }}></p>
            </div>
        </div>
    )
}