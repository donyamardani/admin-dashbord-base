import React, { useState } from 'react';
import FirstStep from './FirstStep';
import LoginWithOtp from './LoginWithOtp';
import LoginWithPass from './LoginWithPass';
import ForgetPass from './ForgetPass';

export default function Auth() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pageType, setPageType] = useState("first-step");

  const handlePageType = (page) => setPageType(page);
  const handlePhoneNumber = (num) => setPhoneNumber(num);

  return (
    <>
      {
        pageType === 'first-step' ? (
          <FirstStep phoneNumber={phoneNumber} handlePageType={handlePageType} handlePhoneNumber={handlePhoneNumber} />
        ) : pageType === 'otp' ? (
          <LoginWithOtp phoneNumber={phoneNumber} handlePageType={handlePageType} handlePhoneNumber={handlePhoneNumber}/>
        ) : pageType === 'password' ? (
          <LoginWithPass phoneNumber={phoneNumber} handlePageType={handlePageType} />
        ) : (
          <ForgetPass phoneNumber={phoneNumber} handlePageType={handlePageType} />
        )
      }
    </>
  );
}