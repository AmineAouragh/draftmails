import Link from 'next/link'
import draft_editor from '../public/images/draft_editor.png'
import Image from 'next/image'
import Head from 'next/head'

import { WiStars } from "react-icons/wi"
import preview from '../public/images/dashboard_preview.png'
import editor_preview from '../public/images/editor_preview.png'


export default function Home() {
  
  return (
    <>
    <Head>
    <link href="https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Cairo:wght@200..1000&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500&family=Rubik+Doodle+Shadow&display=swap" rel="stylesheet" />
            <title>Draftmails</title>
    </Head>
    <div className="h-full py-4 bg-gradient-to-b from-indigo-700 via-blue-700 to-blue-600 px-2 w-full flex flex-col justify-center items-center">
      <section id="hero" className='w-full'>
        <div className='w-2/3 mx-auto flex flex-col justify-center items-center py-20'>
          <h3 className="text-2xl font-bold font-poppins text-center text-white">Draftmails</h3>
          <h1 className="text-6xl text-center font-poppins mt-6 font-bold text-white">Your Dedicated Space <br />for Newsletter Creation</h1>
          <p className='mt-6 font-Cairo text-slate-100 font-bold text-lg'>Write, Edit, and Organize All Your Newsletter Drafts in One Place</p>
          <Link href="/new-draft">
            <button type="button" className="mt-12 rounded-3xl shadow-lg shadow-blue-400 px-8 py-4 bg-white font-semibold font-poppins text-2xl text-blue-600">
              Start a Draft
            </button>
          </Link>
          <div className='mt-14 mx-auto flex flex-col justify-center items-center'>
            <p className='font-Inter text-xl text-white'>Used by <span className='font-extrabold'>The #1 Comedy Newsletter on the Internet</span></p>
            <Link href="https://amineaouragh.substack.com/ref=draftmails_landing" className='flex flex-row items-center mt-6 justify-center w-fit'>
              <WiStars size={46} className='text-white' /> 
              <p className='mx-4 font-poppins text-2xl text-white text-center font-bold'>The Stupid Newsletter</p>
              <WiStars size={46} className='text-white' />
            </Link>
          </div>
          <div className='w-3/4 flex flex-row justify-center items-stretch mx-auto mt-12'>
           <Image
             objectFit='cover'
             quality={100}
             height={300}
             width={700}
             src={preview}
             alt=''
             className='mr-4 rounded-xl object-cover shadow-xl shadow-blue-900' 
           />
           <Image
             objectFit='cover'
             quality={100}
             height={300}
             width={700}
             src={editor_preview}
             alt=''
             className='rounded-xl object-cover shadow-xl shadow-blue-900' 
           />
          </div>
          
        </div>
      </section>
      <section id='alternatives'>
        Draftmails
        Notion 
        Google Docs 
      </section>
    </div>
    </>
  )
}
