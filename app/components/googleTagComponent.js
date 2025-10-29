"use client"
import react , {useEffect} from 'react'
import { useStatus } from "@/context/contextStatus";
import parse from "html-react-parser";
import TagManager from "react-gtm-module";




const MetaPixel = () => {

    const { settingsData, rsleftMenuRef, setSideCategory } = useStatus();

    
 useEffect(() => {
   function handleClickOutside() {
     if (
       rsleftMenuRef.current &&
       !rsleftMenuRef.current.contains(event.target)
     ) {
       setSideCategory(false);
     }
   }
   document.addEventListener("mousedown", handleClickOutside);
   return () => {
     document.removeEventListener("mousedown", handleClickOutside);
   };
 }, [rsleftMenuRef]);


    const tagManagerArgs = {
        gtmId: settingsData?.allScript?.googleScript?.tagManager || "",
        // gtmId: "GTM-WSXGSWC6",

      };
     
       
      useEffect(()=>{
          TagManager.initialize(tagManagerArgs);
      },[settingsData])


  return <></>
};

export default MetaPixel;