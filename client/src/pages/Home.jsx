import faceImg from '../assets/home-img.jpeg'
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div className='min-h-screen flex flex-col p-6'>
        <div className='bg-cover bg-center p-6' 
        style={{backgroundImage: `url(${faceImg})`}}>
          <div className="w-full flex justify-center mt-10 p-6">
            <div className="w-[90%] max-w-6xl p-6">
              <Navbar />
            </div>
          </div>
          Home
        </div>
        <div className='h-[100vh] bg-cover bg-center bg-amber-300'
        style={{backgroundImage: `url(${faceImg})`}}>
          Home 2
        </div>
    </div>
  )
}

export default Home;