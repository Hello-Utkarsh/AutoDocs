import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import './App.css'
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'

function App() {

  const user = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (user.isSignedIn) {
      navigate('/main')
    }
  })

  return (
    <div className='text-xl text-start w-full h-screen mt-32'>
      <div className='h-[24vh]'>
        <h1 className='text-7xl text-[#024643] mx-auto text-center text-pretty font-bold leading-[1]'>Notes Management <br /> Made Simple</h1>
        <p className='mx-auto text-center text-[#FAFAFA] mt-16'>Effortlessly capture your Ideas, Thoughts, and To-Dos with style — Note-Taking made Simple and Beautiful.</p>
        <div className='flex mx-auto justify-center mt-6'>
          <button className='px-4 py-2 h-fit bg-[#714DFF] rounded-3xl mx-2 text-[#FAFAFA] text-base font-medium'>Start Free Trial</button>
          <button className='px-4 py-2 h-fit border border-white text-white rounded-3xl mx-2 text-base font-medium'>Contact Sales</button>
        </div>
        <div className='mt-10 relative flex justify-center items-center'>
          <img className='h-80 mx-auto' src="/laptop.png" alt="" />
          <img className='bg-black w-[425px] h-[280px] rounded-lg absolute mx-auto top-[9px]' src='/demo.png'/>
        </div>
      </div>

      <div className='bg-[#024643] pt-52 h-3/4' />

      <div className='pt-24 pb-12'>
        <h2 className='mx-auto text-[40px] font-bold text- text-center'>Explore Our Amazing Features</h2>
        <div className='mt-12 flex flex-wrap justify-between w-[86%] mx-auto'>
          <div className=' text-black w-96 rounded-2xl px-6 py-6 mx-4 border border-gray-200 hover:bg-white transition duration-300'>
            <div className='relative'>
              <div className='h-12 w-12 rounded-full bg-[#024643] z-0' />
              <img className='h-8 absolute top-2 left-3 z-10' src="/notes.png" alt="" />
            </div>
            <h4 className='font-medium text-lg tracking-tight mt-2'>Streamline Your Note-Taking</h4>
            <p className='text-base'>Our note-taking app offers a range of features to help you stay organized and productive.</p>
            <span className='rounded-full bg-[#714DFF] flex items-center justify-center w-10 h-10 hover:-rotate-[25deg] transition duration-150 hover:scale-125 ml-[90%] mt-1 hover:drop-shadow-lg'><span className='-mt-1'>&#x2192;</span></span>
          </div>

          <div className=' text-black w-96 rounded-2xl px-6 py-6 mx-4 border border-gray-200 hover:bg-white transition duration-300'>
            <div className='relative'>
              <div className='h-12 w-12 rounded-full bg-[#024643] z-0' />
              <img className='h-8 absolute top-2 left-2 z-10' src="/innovation.png" alt="" />
            </div>
            <h4 className='font-medium text-lg tracking-tight mt-2'>AI Support</h4>
            <p className='text-base'>Gemini is always ready to assist you, ensuring that you have the support you need, whenever you need it.</p>
            <span className='rounded-full bg-[#714DFF] flex items-center justify-center w-10 h-10 hover:-rotate-[25deg] transition duration-150 hover:scale-125 ml-[90%] mt-1 hover:drop-shadow-lg'><span className='-mt-1'>&#x2192;</span></span>
          </div>

          <div className=' text-black w-96 rounded-2xl px-6 py-6 mx-4 border border-gray-200 hover:bg-white transition duration-300'>
            <div className='relative'>
              <div className='h-12 w-12 rounded-full bg-[#024643] z-0' />
              <img className='h-8 absolute top-2 left-2 z-10' src="/code.png" alt="" />
            </div>
            <h4 className='font-medium text-lg tracking-tight mt-2'>Markdown Support</h4>
            <p className='text-base'>Format your notes with Markdown for a clean, organized look.</p>
            <span className='rounded-full bg-[#714DFF] flex items-center justify-center w-10 h-10 hover:-rotate-[25deg] transition duration-150 hover:scale-125 ml-[90%] mt-1 hover:drop-shadow-lg'><span className='-mt-1'>&#x2192;</span></span>
          </div>
        </div>
        <div className='mt-20 relative h-80'>
          <img className='w-full h-96 absolute object-cover opacity-20' src="/background.jpg" alt="" />
          <div className='w-[50%] left-[25%] top-[30%] absolute'>
            <h1 className='text-4xl font-extrabold text-center text-[#191818]'>Post to your Favorite platform<br />in just one click</h1>
            <p className='text-lg mt-6 text-center text-pretty px-4 text-[#191818]'>Connect your AutoDocs account to Hashnode, Medium, X or Dev.to<br />and post all your blogs in just one click</p>
          </div>
          <img className='h-10 left-[28%] absolute animate-float' src="/hashnode.png" alt="" />
          <img className='h-10 left-[16%] top-[64%] absolute animate-float' src="/dev-to.svg" alt="" />
          <img className='h-10 left-[75%] top-[20%] absolute animate-float' src="/medium.png" alt="" />
          <img className='h-10 left-[69%] top-[95%] absolute animate-float' src="/x.png" alt="" />
        </div>
      </div>
      <div className='py-12'>
        <h1 className='text-3xl font-bold text-center'>Choose Your Plan</h1>
        <p className='text-center text-lg mt-2'>Our plans are designed to be affordable, flexible and tailored to your unique needs.</p>
        <div className='flex justify-center mt-8'>
          <button className='px-4 py-2 h-fit bg-[#714DFF] rounded-3xl mx-2 text-[#FAFAFA] text-base font-medium'>Monthly</button>
          <button className='px-4 py-2 h-fit bg-[#FAFAFA] text-[#191818] rounded-3xl mx-2 border border-black text-base font-medium'>Yearly</button>
        </div>
        <div className='flex-col mt-16'>
          <div className='flex justify-between w-[65%] mx-auto'>
            <div className='flex-col items-start justify-start w-[25%] px-4 py-6 rounded-lg bg-gray-100'>
              <h2 className='text-3xl font-bold text-black'>Have<br />Question?</h2>
              <button className='text-base font-bold text-[#714DFf] mt-3'>Contact Us, Now &#x2192;</button>
            </div>
            <div className='flex justify-between w-4/6 text-[#191818]'>
              <div className='flex-col items-start justify-start w-[15vw]'>
                <h2 className='text-base font-bold w-fit'>Starter</h2>
                <p className='text-base mt-4 w-fit'><span className='text-4xl font-bold'>$0</span>/Month</p>
                  <button className='py-2 rounded-3xl w-4/6 text-center text-base border-2 border-black text-black mt-4'>Start Free Trial</button>
              </div>
              <div className='flex-col items-start justify-start w-[15vw]'>
                <h2 className='text-base font-bold'>Starter</h2>
                <p className='text-base mt-4'><span className='text-4xl font-bold'>$29</span>/Month</p>
                <button className='py-2 rounded-3xl w-4/6 text-center text-base border-2 border-black text-black mt-4'>Start Free Trial</button>
              </div>
              <div className='flex-col items-start justify-start w-[15vw]'>
                <h2 className='text-base font-bold'>Starter</h2>
                <p className='text-base mt-4'><span className='text-4xl font-bold'>$59</span>/Month</p>
                <button className='py-2 rounded-3xl w-4/6 text-center text-base border-2 border-black text-black mt-4'>Start Free Trial</button>
              </div>
            </div>
          </div>
          <div className='flex w-[65%] mx-auto bg-[#E1F7DD] rounded-[48px] mt-8 px-8 py-3'>
            <div className='flex flex-col divide-y-2 divide-slate-300 h-full w-1/4'>
              <p className='py-4 text-[#191818] text-lg'>Feature</p>
              <p className='py-4 text-[#191818] text-lg'>Feature</p>
              <p className='py-4 text-[#191818] text-lg'>Feature</p>
              <p className='py-4 text-[#191818] text-lg'>Feature</p>
              <p className='py-4 text-[#191818] text-lg'>Feature</p>
              <p className='py-4 text-[#191818] text-lg'>Feature</p>
              <p className='py-4 text-[#191818] text-lg'>Feature</p>
            </div>
            <div className='flex flex-col divide-y-2 divide-slate-300 bg-[#FAFAFA] rounded-3xl h-full w-3/4'>
              <div className='flex w-full justify-around items-center py-5'>
                <div className='bg-[#714DFf] rounded-full w-5 h-5 text-sm text-center'>&#x2714;</div>
                <div className='bg-[#714DFf] rounded-full w-5 h-5 text-sm text-center'>&#x2714;</div>
                <div className='bg-[#714DFf] rounded-full w-5 h-5 text-sm text-center'>&#x2714;</div>
              </div>
              <div className='flex w-full justify-around items-center py-5'>
                <div className='bg-[#714DFf] rounded-full w-5 h-5 text-sm text-center'>&#x2714;</div>
                <div className='bg-[#714DFf] rounded-full w-5 h-5 text-sm text-center'>&#x2714;</div>
                <div className='bg-[#714DFf] rounded-full w-5 h-5 text-sm text-center'>&#x2714;</div>
              </div>
              <div className='flex w-full justify-around items-center py-5'>
                <div className='bg-[#714DFf] rounded-full w-5 h-5 text-sm text-center'>&#x2714;</div>
                <div className='bg-[#714DFf] rounded-full w-5 h-5 text-sm text-center'>&#x2714;</div>
                <div className='bg-[#714DFf] rounded-full w-5 h-5 text-sm text-center'>&#x2714;</div>
              </div>
              <div className='flex w-full justify-around items-center py-5'>
                <div className='bg-gray-400 text-[#FAFAFA] rounded-full w-5 h-5 text-sm text-center'>X</div>
                <div className='bg-[#714DFf] rounded-full w-5 h-5 text-sm text-center'>&#x2714;</div>
                <div className='bg-[#714DFf] rounded-full w-5 h-5 text-sm text-center'>&#x2714;</div>
              </div>
              <div className='flex w-full justify-around items-center py-5'>
                <div className='bg-gray-400 text-[#FAFAFA] rounded-full w-5 h-5 text-sm text-center'>X</div>
                <div className='bg-[#714DFf] rounded-full w-5 h-5 text-sm text-center'>&#x2714;</div>
                <div className='bg-[#714DFf] rounded-full w-5 h-5 text-sm text-center'>&#x2714;</div>
              </div>
              <div className='flex w-full justify-around items-center py-5'>
                <div className='bg-gray-400 text-[#FAFAFA] rounded-full w-5 h-5 text-sm text-center'>X</div>
                <div className='bg-gray-400 text-[#FAFAFA] rounded-full w-5 h-5 text-sm text-center'>X</div>
                <div className='bg-[#714DFf] rounded-full w-5 h-5 text-sm text-center'>&#x2714;</div>
              </div>
              <div className='flex w-full justify-around items-center py-5'>
                <div className='bg-gray-400 text-[#FAFAFA] rounded-full w-5 h-5 text-sm text-center'>X</div>
                <div className='bg-gray-400 text-[#FAFAFA] rounded-full w-5 h-5 text-sm text-center'>X</div>
                <div className='bg-[#714DFf] rounded-full w-5 h-5 text-sm text-center'>&#x2714;</div>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-12 w-9/12 bg-[#024643] h-80 rounded-3xl mx-auto flex flex-col justify-center'>
          <h1 className='text-3xl font-bold text-[#FAFAFA] text-center'>Get Started With AutoDocs Right Away!</h1>
          <p className='text-lg mt-2 text-[#547B79] text-center'>Simplify, Automate, and Elevate Your Workflow<br />AutoDocs Is Your Companion in Turning Documentation from a Chore Into a Breeze</p>
          <button className='px-4 py-2 mt-4 w-fit text-base mx-auto rounded-3xl text-[#FAFAFA] bg-[#714DFF]'>Start Free Trial</button>
        </div>
      </div>
    </div>
  )
}

export default App