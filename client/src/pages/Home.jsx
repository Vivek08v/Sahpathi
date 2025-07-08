import Navbar from '../components/Navbar';

import lineBg from '../assets/line-bg.jpg'
import heroSecImg from '../assets/heroSecImg.png'
import testiImg from '../assets/img4.jpg'
import featBg from '../assets/feat-bg.jpg'
import img1 from '../assets/useCase_Images/1.png'
import img2 from '../assets/useCase_Images/2.png'
import img3 from '../assets/useCase_Images/3.png'
import img4 from '../assets/useCase_Images/4.jpg'
import img5 from '../assets/useCase_Images/5.jpg'
import img6 from '../assets/useCase_Images/6.jpg'

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div
        className="h-screen bg-cover bg-center pt-10 px-4 sm:px-6 md:px-10 lg:px-16 text-white"
        style={{ backgroundImage: `url(${lineBg})` }}
      >
        {/* Navbar */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-7xl">
            <Navbar />
          </div>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-12 sm:mt-24 md:mt-24 lg:mt-36 px-4 sm:px-6 md:px-10 lg:px-16 gap-4 sm:gap-6 lg:gap-12">
          <div className="flex-1 max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg text-left">
              Collaborative Learning Redefined
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90 drop-shadow-md text-left">
              Sahpathi brings together passionate learners and mentors in real-time interactive classrooms. Whether you're preparing for exams or just exploring new topics — Sahpathi is your space to grow.
            </p>
            <div className="flex gap-4 flex-wrap">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-all">
                Start Learning
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-lg border border-white/20 backdrop-blur-sm shadow-md transition-all">
                Become a Mentor
              </button>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <img
              src={heroSecImg}
              alt="Collaboration Illustration"
              className="max-w-2xl w-full object-contain drop-shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className='h-full pb-16 bg-cover bg-center bg-amber-300'
        style={{backgroundImage: `url(${featBg})`}}>
        {/* <div className="w-full h-full bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center px-4"> */}
        <div className="max-w-6xl mx-auto -mt-8 sm:-mt-8 md:-mt-16 lg:-mt-24 mb-8 px-4 py-12 pb-18 bg-white/80 backdrop-blur-sm rounded-4xl shadow-xl flex flex-col items-center justify-center z-20 relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Supercharge Your Learning</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
            <div className="bg-yellow-100 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200">
              <p className="text-sm font-semibold text-yellow-800 mb-2">Live Classrooms</p>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Collaborate in Real-Time</h3>
              <p className="text-sm text-gray-600 mb-4">Join audio-based sessions with mentors and peers to learn and teach collaboratively.</p>
              <button className="text-sm font-medium text-yellow-800 hover:underline">Join Now →</button>
            </div>

            <div className="bg-blue-100 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200">
              <p className="text-sm font-semibold text-blue-800 mb-2">Mentorship Model</p>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Learn from the Best</h3>
              <p className="text-sm text-gray-600 mb-4">Anyone can become a mentor or learn from experts in different fields.</p>
              <button className="text-sm font-medium text-blue-800 hover:underline">Become a Mentor →</button>
            </div>

            <div className="bg-purple-100 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200">
              <p className="text-sm font-semibold text-purple-800 mb-2">Smart Scheduling</p>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Plan Your Sessions</h3>
              <p className="text-sm text-gray-600 mb-4">View upcoming sessions, schedules, and never miss a class again.</p>
              <button className="text-sm font-medium text-purple-800 hover:underline">Check Schedule →</button>
            </div>

            <div className="bg-green-100 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200">
              <p className="text-sm font-semibold text-green-800 mb-2">Explore Topics</p>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Broaden Your Knowledge</h3>
              <p className="text-sm text-gray-600 mb-4">Browse and join learning rooms based on your favorite subjects.</p>
              <button className="text-sm font-medium text-green-800 hover:underline">Explore Now →</button>
            </div>
          </div>
        </div>

      </div>

      {/* How it Works */}
      <div className="h-full bg-cover bg-center px-6 py-22 flex flex-col items-center text-white"
        style={{ backgroundImage: `url(${featBg})` }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 drop-shadow-lg">
          How Sahpathi Works
        </h2>
        <p className="text-sm md:text-base text-center text-white/90 mb-12 drop-shadow-sm">
          Join, Learn, Teach — all in a few clicks
        </p>
        <div className="w-full max-w-6xl my-8 flex flex-col md:flex-row justify-between items-start gap-12">
          {/* Step 1 */}
          <div className="relative flex-1 text-center md:text-left">
            <div className="w-10 h-10 rounded-full bg-white text-blue-600 font-bold flex items-center justify-center mx-auto md:mx-0 mb-4 shadow z-10 relative">
              1
            </div>
            <div className="hidden md:block absolute top-5 left-1/8 w-full h-0.5 bg-white/40 -z-0"></div>
            <h3 className="text-xl font-semibold mb-2">Join a Classroom</h3>
            <p className="text-sm text-white/90">
              Browse or create a classroom instantly. All you need is a topic and curiosity to learn or teach.
            </p>
          </div>
          {/* Step 2 */}
          <div className="relative flex-1 text-center md:text-left">
            <div className="w-10 h-10 rounded-full bg-white text-blue-600 font-bold flex items-center justify-center mx-auto md:mx-0 mb-4 shadow z-10 relative">
              2
            </div>
            <div className="hidden md:block absolute top-5 left-1/8 w-full h-0.5 bg-white/40 -z-0"></div>
            <h3 className="text-xl font-semibold mb-2">Collaborate Live</h3>
            <p className="text-sm text-white/90">
              Use real-time audio and canvas tools to ask questions, explain concepts, and learn together.
            </p>
          </div>
          {/* Step 3 */}
          <div className="relative flex-1 text-center md:text-left">
            <div className="w-10 h-10 rounded-full bg-white text-blue-600 font-bold flex items-center justify-center mx-auto md:mx-0 mb-4 shadow z-10 relative">
              3
            </div>
            <div className="hidden md:block absolute top-5 left-1/8 w-full h-0.5 bg-white/40 -z-0"></div>
            <h3 className="text-xl font-semibold mb-2">Grow & Repeat</h3>
            <p className="text-sm text-white/90">
              Build connections, gain experience, and continue your journey of learning and mentoring every day.
            </p>
          </div>
        </div>
        <button className="mt-12 bg-white text-blue-600 font-semibold px-6 py-3 rounded-md hover:bg-white/90 transition">
          Start Learning
        </button>
      </div>

      {/* Testimonials */}
      <div className='h-full bg-cover bg-center bg-amber-300'
        style={{backgroundImage: `url(${testiImg})`}}>
        <div className="py-20 px-4 text-center">
          <h2 className="text-white text-3xl font-bold mb-4">Real learning. Real collaboration. Real impact.</h2>
          <p className="text-gray-400 mb-12">
            Experience the moments that make Sahpathi more than just a platform — 
            it’s a community of learners in action.
          </p>

          <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
            {[
              { src: img1, caption: "Live Classroom in Session" },
              { src: img3, caption: "Collaborative Whiteboard" },
              { src: img4, caption: "Interactive Chat with Peers" },
              { src: img5, caption: "Mentor Profiles & Scheduling" },
              { src: img2, caption: "Student Learning Dashboard" },
              { src: img6, caption: "Feedback from Mentors" },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-lg overflow-hidden shadow hover:scale-105 transition-transform duration-300 bg-gray-50"
              >
                <img
                  src={item.src}
                  alt={item.caption}
                  className="w-full h-56 object-cover"
                />
                <p className="mt-2 text-sm text-gray-600">{item.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Call To Action */}
      <div className='h-full bg-cover bg-center bg-amber-300'
        style={{backgroundImage: `url(${lineBg})`}}>
        <div className="text-white py-12 text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to start your journey?</h2>
          <p className="mb-6 text-lg">Join Sahpathi today as a learner or mentor and make every session count.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100">Get Started</button>
            <button className="bg-white/10 border border-white px-6 py-3 rounded-md font-medium hover:bg-white/20">Learn More</button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className='h-full bg-cover bg-center bg-amber-300'
        style={{backgroundImage: `url(${featBg})`}}>
        <div className="text-white py-10 px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">
            <div>
              <h3 className="text-xl font-bold mb-2">Sahpathi</h3>
              <p className="text-sm text-white/80">Empowering collaborative learning for everyone.</p>
            </div>
            <div className="flex flex-col gap-2">
              <a href="#" className="hover:underline">About</a>
              <a href="#" className="hover:underline">Contact</a>
              <a href="#" className="hover:underline">Terms</a>
              <a href="#" className="hover:underline">Privacy</a>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;