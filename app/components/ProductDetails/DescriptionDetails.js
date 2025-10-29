"use client"

import React from 'react'
import ReactPlayer from 'react-player';
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

const DescriptionDetails = ({info}) => {
 


  return (
    <div>
      <div className="shadow-md w-full rounded-md bg-white mb-5 mt-4 p-5 xls:p-3 xms:p-3 xs:p-3">
        <div className="pb-5">
          <Tabs>
            <div className="tab">
              <TabList>
                <Tab>
                  {" "}
                  <span className="text-black">Description</span>
                </Tab>
                <Tab>
                  {" "}
                  <span className="text-black">Guideline</span>{" "}
                </Tab>
              </TabList>
            </div>

            <TabPanel>
              <div className="pt-3">
                <span
                  className="text-black"
                  dangerouslySetInnerHTML={{ __html: info?.description }}
                ></span>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="pt-3">
                <span
                  className="text-black"
                  dangerouslySetInnerHTML={{ __html: info?.guideline }}
                ></span>
              </div>
            </TabPanel>
          </Tabs>
        </div>

        {info?.videoUrl ? (
          <div className="border-t border-gray-300">
            <div className="flex justify-center py-10  max-w-[40rem] mx-auto">
              <ReactPlayer
                url={`${info?.videoUrl}`}
                width="100%"
                height="400px"
                volume={1}
                controls
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default DescriptionDetails