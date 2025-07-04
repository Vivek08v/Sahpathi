import faceImg from '../assets/home-img.jpeg'
import lineBg from '../assets/line-bg.jpg'
import heroSecImg from '../assets/heroSecImg.png'
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
        <div className="flex flex-col md:flex-row items-center justify-between mt-24 px-4 sm:px-6 md:px-10 lg:px-16 gap-12">
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
    </div>
  );
};

export default Home;

// const Home = () => {
//   return (
//     <div className='min-h-screen flex flex-col'>
//       <div className='h-screen bg-cover bg-center pt-10 px-6 text-white'
//         style={{ backgroundImage: `url(${lineBg})` }}
//       >
//         {/* Navbar */}
//         <div className="w-full flex justify-center px-16">
//           <Navbar />
//         </div>

//         {/* Hero Section */}
//         <div className="flex flex-col md:flex-row items-center justify-between mt-24 px-6 md:px-16 gap-12">
//           {/* Left Text Content */}
//           <div className="flex-1 max-w-xl">
//             <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg text-left">
//               Collaborative Learning Redefined
//             </h1>
//             <p className="text-lg md:text-xl mb-8 text-white/90 drop-shadow-md text-left">
//               Sahpathi brings together passionate learners and mentors in real-time interactive classrooms. Whether you're preparing for exams or just exploring new topics — Sahpathi is your space to grow.
//             </p>
//             <div className="flex gap-4">
//               <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-all">
//                 Start Learning
//               </button>
//               <button className="bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-lg border border-white/20 backdrop-blur-sm shadow-md transition-all">
//                 Become a Mentor
//               </button>
//             </div>
//           </div>

//           {/* Right Image */}
//           <div className="flex-1 flex justify-center">
//             <img
//               src={heroSecImg} // Replace with your imported image or local asset path
//               alt="Collaboration Illustration" 
//               className="max-w-2xl w-full object-contain drop-shadow-lg"
//             />
//           </div>
//         </div>
//       </div>

//       {/* <div className='h-screen bg-cover bg-center bg-amber-300'
//       style={{backgroundImage: `url(${faceImg})`}}>
//         Home 2
//       </div> */}
//     </div>
//   )
// }

// export default Home;