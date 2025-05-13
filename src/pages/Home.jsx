import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Banner from '../assets/Images/banner.mp4'
import CTAButton from '../components/core/HomePage/Button'
import HighlightText from '../components/core/HomePage/HighlightText'
import CodeBlocks from '../components/core/HomePage/CodeBlocks'
import TimelineSection from '../components/core/HomePage/TimelineSection'
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection'

function Home() {
    return (
        <div>

            {/* section 1 */}
            <div className='relative mx-auto flex flex-col w-11/12 items-center text-white justify-between'>
                <Link to="signup">
                    <div className='group  mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-105 w-fit'>  {/* ye div create kiya hamne button ke liye... */}
                        <div className='flex flex-row rounded-full items-center gap-2 px-10 py-[5px] 
                            transition-all duration-200 group-hover:bg-richblack-900'> {/* ye div create kiya hamne button ke content ke liye... */}
                            <p>Become an Instructor</p>
                            <FaArrowRight />
                        </div>
                    </div>
                </Link>

                <div className='text-center text-4xl font-semibold mt-7'>
                    Empower Your Future with
                    <HighlightText text={"Coding Skills"} />
                </div>

                <div className=' mt-4 w-[90%] text-center text-lg font-bold text-richblack-300'>
                    With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
                </div>

                <div className='flex flex-row gap-7 mt-8'> {/*hamen button ka component bana liya... taki.. easy ho reuse karna*/}
                    <CTAButton active={true} linkto={"/signup"}>
                        Learn More
                    </CTAButton> {/* button me parameter honge--> active, link, children */}

                    <CTAButton active={false} linkto={"/login"}>
                        Book a Demo
                    </CTAButton>
                </div>

                <div className='mx-3 my-12 shadow-blue-200'>
                    <video
                        muted
                        loop
                        autoPlay>
                        <source src={Banner} type="video/mp4" />
                    </video>

                </div>

                {/* Code Section 1 */}
                <div>
                    <CodeBlocks
                        position={"lg:flex-row"}
                        headline={
                            <div className='text-4xl font-semibold'>
                                Learn to Code with
                                <HighlightText text={"StudyNotion"} />
                            </div>
                        }
                        subheadline={
                            "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                        }
                        ctabtn1={{
                            active: true,
                            linkto: "/signup",
                            btnText: "try it yourself",
                        }}

                        ctabtn2={
                            {
                                btnText: "learn more",
                                linkto: "/login",
                                active: false,
                            }
                        }

                        codeblock={`<<!DOCTYPE html>\n<html>\n<head><title>Example</title><linkrel="stylesheet"href="styles.css">\n</head>\n`}
                        codeColor={"text-yellow-25"}

                    >

                    </CodeBlocks>
                </div>
                {/* Code Section 1 */}

                {/* Code Section 2 */}
                <div>
                    <CodeBlocks
                        position={"lg:flex-row-reverse"}
                        headline={
                            <div className='text-4xl font-semibold'>
                                Learn to Code with
                                <HighlightText text={"StudyNotion"} />
                            </div>
                        }
                        subheadline={
                            "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                        }
                        ctabtn1={{
                            active: true,
                            linkto: "/signup",
                            btnText: "try it yourself",
                        }}

                        ctabtn2={
                            {
                                btnText: "learn more",
                                linkto: "/login",
                                active: false,
                            }
                        }

                        codeblock={`<<!DOCTYPE html>\n<html>\n<head><title>Example</title><linkrel="stylesheet"href="styles.css">\n</head>\n`}
                        codeColor={"text-yellow-25"}

                    >

                    </CodeBlocks>
                </div>
                {/* Code Section 2 */}



            </div>
            {/* section 1 */}

            {/* section 2 */}
            <div className='flex flex-col gap-4 mt-16 bg-pure-greys-5'>

                <div className='homepage_dg h-[310px] '>  {/*isme background image set kiya, aur hamne apna design ko sirf ek chote se place record kar diya*/}
                    <div className='w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto'> {/*isme ham 2 button dalenge*/}
                        <div className='h-[150px]'></div>
                        <div className='flex flex-row gap-5 text-white'>
                            <CTAButton active={true} linkto={"/signup"}>
                                <div className='flex flex-row items-center gap-2'> {/* isme ham button aur arrow denge*/}
                                    Explore Full Catalog
                                    <FaArrowRight />
                                </div>
                            </CTAButton>
                            <CTAButton active={false} linkto={"/signup"}>
                                Learn More
                            </CTAButton>
                        </div>
                    </div>
                </div>

                <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7'>
                    <div className='flex flex-row gap-5 mb-10 mt-[95px]'>
                        <div className='text-4xl w-[45%] font-semibold'>
                            Get the Skills you need for a
                            <HighlightText text={"Job that is in demand"} />
                        </div>
                        <div className='w-[40%] gap-10 flex flex-col items-start'>
                            <div className='text-[16px]'>
                                The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                            </div>
                            <CTAButton active={true} linkto={"/login"}>
                                <div>
                                    Learn More
                                </div>
                            </CTAButton>
                        </div>
                    </div>
                </div>

                <TimelineSection/>

                <LearningLanguageSection/> 
                

            </div>
            {/* section 2 */}

            {/* section 3 */}

            {/* section 3 */}

            {/* footer */}

            {/* footer */}

        </div>
    )
}

export default Home
