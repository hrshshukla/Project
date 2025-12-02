import React , {createContext} from 'react'
import { useState } from 'react'

const UserDataContext = createContext()

const UserContext = ({children}) => {

    const [user, setUser] = useState({
        email: '',
        fullname: {
            firstname: '',
            lastname: ''
        }
    })

  return (
    <UserDataContext.Provider value={[user, setUser]}>
      {children}
    </UserDataContext.Provider>
  )


}

export default UserContext