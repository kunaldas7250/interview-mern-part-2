
import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import "./CSS/Test.css"
// import "./CSS/Quiz.css"

const Quiz = () => {
  const [isShow, setIsShow] = useState(false);

  const handleProfile = () => {
    setIsShow((prev) => !prev);
  };

  return (
    <motion.div className="navparentquizz">
      <motion.div className="navchild"
      animate={{ height: isShow ? 170 : 90 }} 
        transition={{ duration: 0.4 }}>
        <nav className="navbox">
          <p>Welcome to Quiz</p>
          <div className="profile">
            <motion.button onClick={handleProfile}>Profile</motion.button>

            {/* AnimatePresence for smooth toggle */}
            <AnimatePresence>
              {isShow && (
                <motion.div
                  className="profiletext"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <p>Username</p>
                  <div className="logout">
                    <motion.button whileHover={{ scale: 1.1 }}>
                      Logout
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
      </motion.div>
    </motion.div>
  );
};

export default Quiz;
