import faceImg from '../assets/home-img.jpeg'
import lineBg from '../assets/line-bg.jpg'
import heroSecImg from '../assets/heroSecImg.png'
import featBg from '../assets/feat-bg.jpg'
import Navbar from '../components/Navbar';

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
          {/* Left Text Content */}
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

          {/* Right Image */}
          <div className="flex-1 flex justify-center">
            <img
              src={heroSecImg}
              alt="Collaboration Illustration"
              className="max-w-2xl w-full object-contain drop-shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className='h-screen bg-cover bg-center bg-amber-300'
        style={{backgroundImage: `url(${featBg})`}}>
        {/* <div className="w-full h-full bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center px-4"> */}
        <div className="max-w-6xl mx-auto -mt-8 sm:-mt-8 md:-mt-16 lg:-mt-24 mb-8 px-4 py-12 pb-18 bg-white/80 backdrop-blur-sm rounded-4xl shadow-xl flex flex-col items-center justify-center z-20 relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Supercharge Your Learning</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
            {/* Feature 1 */}
            <div className="bg-yellow-100 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200">
              <p className="text-sm font-semibold text-yellow-800 mb-2">Live Classrooms</p>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Collaborate in Real-Time</h3>
              <p className="text-sm text-gray-600 mb-4">Join audio-based sessions with mentors and peers to learn and teach collaboratively.</p>
              <button className="text-sm font-medium text-yellow-800 hover:underline">Join Now →</button>
            </div>

            {/* Feature 2 */}
            <div className="bg-blue-100 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200">
              <p className="text-sm font-semibold text-blue-800 mb-2">Mentorship Model</p>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Learn from the Best</h3>
              <p className="text-sm text-gray-600 mb-4">Anyone can become a mentor or learn from experts in different fields.</p>
              <button className="text-sm font-medium text-blue-800 hover:underline">Become a Mentor →</button>
            </div>

            {/* Feature 3 */}
            <div className="bg-purple-100 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200">
              <p className="text-sm font-semibold text-purple-800 mb-2">Smart Scheduling</p>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Plan Your Sessions</h3>
              <p className="text-sm text-gray-600 mb-4">View upcoming sessions, schedules, and never miss a class again.</p>
              <button className="text-sm font-medium text-purple-800 hover:underline">Check Schedule →</button>
            </div>

            {/* Feature 4 */}
            <div className="bg-green-100 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200">
              <p className="text-sm font-semibold text-green-800 mb-2">Explore Topics</p>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Broaden Your Knowledge</h3>
              <p className="text-sm text-gray-600 mb-4">Browse and join learning rooms based on your favorite subjects.</p>
              <button className="text-sm font-medium text-green-800 hover:underline">Explore Now →</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;