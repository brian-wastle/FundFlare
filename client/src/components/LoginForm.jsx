import { useState } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../utils/auth';
import { useMutation } from '@apollo/client';
import { motion, AnimatePresence } from "framer-motion"
import { LOGIN_USER } from '../utils/mutations';


const LoginForm = () => {
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [failedLoginOpen, setfailedLoginOpen] = useState(false);
  const [validated] = useState(false);
  const [login, { error }] = useMutation(LOGIN_USER);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const mutationResponse = await login({
        variables: { email: userFormData.email, password: userFormData.password },
      });
      const token = mutationResponse.data.login.token;
      Auth.login(token);
    } catch (err) {
      console.error(err);

      setfailedLoginOpen(true)

      setInterval(() => {
        setfailedLoginOpen(false)
      }, 4000);
    }

    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <>
      <div className='md:container 2xl:w-1/4 xl:w-1/3 lg:w-1/2 md:w-2/3 p-8 my-40 mx-auto bg-light-2 drop-shadow-2xl md:rounded-md'>

        <form onSubmit={handleFormSubmit} className='form login-form flex flex-col justify-center items-center'>

          <input
            className='font-secondary form-input text-center p-2 m-2 focus:outline-none rounded-lg bg-light-1 shadow-xl'
            type='email'
            placeholder='email'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />

          <input
            className='font-secondary form-input text-center p-2 m-2 focus:outline-none rounded-lg bg-light-1 shadow-xl'
            type='password'
            placeholder='password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />

          <button
            className='font-secondary py-2 px-6 m-2 rounded-lg bg-primary hover:bg-secondary text-light-1 transition-all disabled:opacity-30 hover:scale-105 hover:shadow-2xl'
            disabled={!(userFormData.email && userFormData.password)}
            type='submit'
            variant='success'>
            Submit
          </button>

        </form>

        <Link to="/signup" onClick={() => setLoginOpen(false)}><h1
          className='text-lg text-gray-400 text-center pt-2'
        >Don't have an account?</h1></Link>

        <AnimatePresence>
          {failedLoginOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { ease: "easeOut", duration: 0.4 } }}
              exit={{ opacity: 0, transition: { ease: "easeIn", duration: 0.4 } }}>
              <h1 className='text-center text-text-light p-2 my-2 bg-red-400 rounded-xl opacity-75'>incorrect login</h1>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </>
  );
};

export default LoginForm;
