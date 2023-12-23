import Link from 'next/link'

export default function Home() {
  
  return (
    <div className="h-full py-4 px-2 absolute w-full flex flex-col justify-center items-center">
      <h1 className="text-6xl 2xl:text-8xl font-bold text-blue-600">Draftmails</h1>
      <h2 className="text-4xl text-center mt-4 font-bold text-blue-800">Draft and organize your newsletter emails</h2>
      <Link href="/new-draft">
        <button type="button" className="bg-blue-600 mt-12 rounded-md shadow-md px-5 py-3 font-bold text-2xl text-gray-50">Get started</button>
      </Link>
    </div>
  )
}
