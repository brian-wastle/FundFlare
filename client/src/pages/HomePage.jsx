
import { Link } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar'
import ForMe from '../components/ForMe'
import Auth from '../utils/auth';
import { GET_ORGANIZATIONS } from '../utils/queries'
import { useQuery } from '@apollo/client';
import { motion, AnimatePresence } from "framer-motion"



const HomePage = () => {
  const { loading, data } = useQuery(GET_ORGANIZATIONS);
  const organizations = data?.getOrganizations || {};
  console.log(organizations)
  if (loading) {
    return <p>Still Loading...</p>
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Generate a random index
      // Swap array[i] and array[j]
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  const mutableOrganizations = [...organizations]
  shuffleArray(mutableOrganizations);
  const firstFewElements = mutableOrganizations.slice(0, 20);
  console.log(firstFewElements)

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { ease: "easeOut", duration: 0.6 } }}
        exit={{ opacity: 0, transition: { ease: "easeIn", duration: 0.6 } }}>

        {Auth.loggedIn() && (
          <>
            {/* for you carousel */}
            <ForMe organizations={organizations} />
          </>
        )}

        <div className='md:container 2xl:w-2/3 mx-auto'>
          <h2 className='font-main text-primary text-2xl pt-8 md:pt-12 text-center'>More from the community</h2>
        </div>

        <div className='md:container 2xl:w-2/3 mx-auto flex flex-wrap justify-center items-center'>
          {firstFewElements.map((organization) => {
            return (
              <div key={organization._id}>
                <Link to={`/organization/${organization._id}`}>
                  <div className='relative m-4 md:m-6 w-80 bg-light-1 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-black/10 hover:shadow-2xl'>
                    <img className='w-full rounded-t-lg'
                      src={organization.image} alt="organization profile image" />

                    <div className="absolute bottom-12 w-full">
                      <ProgressBar instance={organization._id} goal={organization.fundraisingGoal} amount={organization.fundraisingAmount} />
                    </div>

                    <h2 className='font-main text-text-dark text-center pt-4'
                    >{organization.name}</h2>

                    <h3 className='font-secondary text-text-dark text-center pb-1'
                    ><span className='font-main text-xl text-secondary'
                    >${organization.fundraisingAmount}</span> Raised of <span className='font-main text-xl text-secondary'
                    >${organization.fundraisingGoal}</span> Goal</h3>

                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </motion.div>
    </>
  );
};

export default HomePage;
