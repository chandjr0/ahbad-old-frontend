"use client"
import { useStatus } from '@/context/contextStatus';
import React from 'react'
import { RxHamburgerMenu } from 'react-icons/rx';

const NavHamburg = () => {

const {setSideCategory} = useStatus();
  return (
    <div
      onClick={() => {
        setSideCategory(true);
      }}
      
    >
      <RxHamburgerMenu size={20} />
    </div>
  );
}

export default NavHamburg