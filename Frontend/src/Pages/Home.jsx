import React from 'react'

const Home = () => {
  const handleLogout = () => {
    window.location.href = '/users/logout';
  };

  return (
    <div>
      <button onClick={handleLogout} className='p-2 cursor-pointer font-bold border-2 bg-red-500 text-white rounded-4xl px-3'> Logout </button>
    </div>
  )
}

export default Home