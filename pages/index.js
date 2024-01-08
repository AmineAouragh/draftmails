import Link from 'next/link'
import draft_editor from '../public/images/draft_editor.png'
import Image from 'next/image'

export default function Home() {
  
  return (
    <div className="min-h-screen py-4 px-2 absolute w-full flex flex-col justify-center items-center">
      <h3 className="text-2xl font-bold text-center text-blue-600">Draftmails</h3>
      <h1 className="text-8xl text-center mt-6 xl:w-1/2 font-bold text-blue-600">Draft and organize your newsletter emails</h1>
      <h2 className="text-2xl mt-4 font-semibold hidden text-center xl:w-1/2 text-blue-600">The most simple & straightforward tool to Elevate Your Draft Organization, Progress Tracking.</h2>
      <Link href="/new-draft">
        <button type="button" className="bg-blue-600 mt-12 rounded-xl shadow-md px-5 py-4 font-bold text-4xl text-gray-50">Get started</button>
      </Link>
    </div>
  )
}
