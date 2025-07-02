import { NavLink } from 'react-router-dom';
import logo from '../assets/sahpathi-logo.png';

const Navbar = () => {
  return (
    <div className="bg-white shadow-xl border border-gray-200 rounded-xl px-8 py-6">
      <div className="flex items-center justify-around">
        {/* Logo + Links */}
        <div className="flex items-center gap-12">
          <NavLink to="/">
            <img
              src={logo}
              alt="Logo"
              className="w-[120px] hover:scale-105 transition-transform duration-300"
            />
          </NavLink>

          <div className="hidden md:flex items-center gap-4">
            {['Classrooms', 'Explore', 'Schedule', 'About'].map((text) => (
              <NavLink
                key={text}
                to={`/${text.toLowerCase()}`}
                className="px-5 py-2 rounded-md shadow-sm text-[15px] font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
              >
                {text}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-3 text-gray-700 text-lg">
          {['S', '🤍', '👤'].map((icon, i) => (
            <button
              key={i}
              className="px-4 py-2 bg-white shadow-sm rounded-md hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;





// import { NavLink } from 'react-router-dom'
// import logo from '../assets/sahpathi-logo.png' // update path as needed

// const Navbar = () => {
//   return (
//     <div className="bg-white shadow-lg border border-gray-200 rounded-xl px-5 py-3">
//         <div className="flex items-center justify-around px-8 py-4">
//             <div className="flex items-center gap-8">
//                 <NavLink to="/">
//                   <img src={logo} alt="Logo" className="w-[120px]" />
//                 </NavLink>
//                 <NavLink to="/classrooms" className="text-sm font-medium text-gray-700 hover:text-blue-600">Classrooms</NavLink>
//                 <NavLink to="/explore" className="text-sm font-medium text-gray-700 hover:text-blue-600">Explore</NavLink>
//                 <NavLink to="/schedule" className="text-sm font-medium text-gray-700 hover:text-blue-600">Schedule</NavLink>
//                 <NavLink to="/about" className="text-sm font-medium text-gray-700 hover:text-blue-600">About</NavLink>
//                 {/* <NavLink to="/more" className="text-sm font-medium text-gray-700 hover:text-blue-600">More</NavLink> */}
//             </div>
    
//             <div className="flex items-center gap-6 text-sm text-gray-600">
//                 {/* <div className="flex items-center gap-1">
//                   <span className="text-lg">📍</span>
//                   <span>Your store for 66204</span>
//                   <span className="font-semibold text-black">Kansas City</span>
//                 </div> */}
//                 <div className="cursor-pointer text-lg">S</div>  {/* My Session */}
//                 <div className="cursor-pointer text-lg">🤍</div>  {/* Notification */}
//                 <div className="cursor-pointer text-lg">👤</div>  {/* Profile */}
//             </div>
//         </div>
  
//         {/* Search Bar */}
//         {/* <div className="w-full px-8 py-3">
//           <input
//             type="text"
//             placeholder="Search by make, model, or keyword"
//             className="w-full py-3 px-5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
//           />
//         </div> */}

//     </div>
//   )
// }

// export default Navbar;