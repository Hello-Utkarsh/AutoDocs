import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import './App.css'
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'

function App() {

  const user = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    // if (user.isSignedIn) {
    //   navigate('/main')
    // }
    console.log("object")
  })


  return (
    <div className='text-white text-xl text-start'>
      <div className="flex flex-col min-h-[100dvh] bg-[#1A120B] text-[#D5CEA3]">
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-[#3C2A21]">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                <div className="flex flex-col justify-center text-start space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-['Yeseva_One'] font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-[#D5CEA3]">
                      Take Notes with Ease
                    </h1>
                    <p className="max-w-[600px] font-['Prata'] text-[#E5E5CB] md:text-xl dark:text-[#E5E5CB]">
                      Our note-taking app makes it simple to capture your ideas, thoughts, and to-dos. Access your notes
                      from anywhere, anytime.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <Link
                      href="#"
                      className="inline-flex h-10 items-center justify-center rounded-md border border-[#D5CEA3] bg-[#1A120B] px-8 text-sm font-medium shadow-sm transition-colors hover:bg-[#3C2A21] hover:text-[#D5CEA3] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3C2A21] disabled:pointer-events-none disabled:opacity-50"
                      prefetch={false}
                    >
                      SignIn
                    </Link>
                  </div>
                </div>
                <img
                  src="/placeholder.svg"
                  width="550"
                  height="550"
                  alt="Hero"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                />
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-[#1A120B]">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-[#3C2A21] px-3 py-1 text-sm text-[#D5CEA3]">
                    Key Features
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#D5CEA3]">
                    Streamline Your Note-Taking
                  </h2>
                  <p className="max-w-[900px] text-[#E5E5CB] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Our note-taking app offers a range of features to help you stay organized and productive.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
                <div className="flex flex-col justify-center space-y-4">
                  <ul className="grid gap-6">
                    <li>
                      <div className="grid gap-1">
                        <h3 className="text-xl font-bold text-[#D5CEA3]">Seamless Sync</h3>
                        <p className="text-[#E5E5CB]">Access your notes from any device, anywhere.</p>
                      </div>
                    </li>
                    <li>
                      <div className="grid gap-1">
                        <h3 className="text-xl font-bold text-[#D5CEA3]">AI Support</h3>
                        <p className="text-[#E5E5CB]">Gemini always ready to assist you.</p>
                      </div>
                    </li>
                    <li>
                      <div className="grid gap-1">
                        <h3 className="text-xl font-bold text-[#D5CEA3]">Markdown Support</h3>
                        <p className="text-[#E5E5CB]">Format your notes with Markdown for a clean, organized look.</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <img
                  src="/placeholder.svg"
                  width="550"
                  height="310"
                  alt="Image"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                />
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-[#3C2A21]">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-[#1A120B] px-3 py-1 text-sm text-[#D5CEA3]">
                    Deployment Platforms
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#D5CEA3]">Deploy Anywhere</h2>
                  <p className="max-w-[900px] text-[#E5E5CB] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Our note-taking app can be easily deployed to a variety of platforms, including Hashnode, Medium, and
                    Twitter.
                  </p>
                </div>
              </div>
              {/* <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <img
                    src="/placeholder.svg"
                    width="100"
                    height="100"
                    alt="Hashnode"
                    className="aspect-square overflow-hidden rounded-xl object-contain object-center"
                  />
                  <h3 className="text-xl font-bold text-[#D5CEA3]">Hashnode</h3>
                </div>
                <div className="flex flex-col items-center justify-center space-y-4">
                  <img
                    src="/placeholder.svg"
                    width="100"
                    height="100"
                    alt="Medium"
                    className="aspect-square overflow-hidden rounded-xl object-contain object-center"
                  />
                  <h3 className="text-xl font-bold text-[#D5CEA3]">Medium</h3>
                </div>
                <div className="flex flex-col items-center justify-center space-y-4">
                  <img
                    src="/placeholder.svg"
                    width="100"
                    height="100"
                    alt="Twitter"
                    className="aspect-square overflow-hidden rounded-xl object-contain object-center"
                  />
                  <h3 className="text-xl font-bold text-[#D5CEA3]">Twitter</h3>
                </div>
              </div> */}
            </div>
          </section>
        </main>
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-[#3C2A21]">
          <p className="text-xs text-[#E5E5CB]">&copy; 2024 Note Taker. All rights reserved.</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link href="#" className="text-xs hover:underline underline-offset-4 text-[#D5CEA3]" prefetch={false}>
              Terms of Service
            </Link>
            <Link href="#" className="text-xs hover:underline underline-offset-4 text-[#D5CEA3]" prefetch={false}>
              Privacy
            </Link>
          </nav>
        </footer>
      </div>
    </div>
  )
}

export default App