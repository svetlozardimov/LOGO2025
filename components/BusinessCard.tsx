import React from 'react';
import { CardData } from '../types';

interface BusinessCardProps {
  data: CardData;
  scale?: number;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ data, scale = 1 }) => {
  const firstLetter = data.companyNameMain.charAt(0);
  const restOfName = data.companyNameMain.slice(1);

  return (
    <div 
      id="card-download-area"
      className="relative mx-auto"
      style={{
        width: '2243px',
        height: '341px',
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}
    >
      {/* Main Card Container with Gradient and Border */}
      <div 
        className="w-full h-full relative overflow-hidden border border-gray-400 rounded-[30px]"
        style={{
           background: 'linear-gradient(to bottom, #fff0e5 0%, #ffeadb 50%, #fa8072 100%)',
        }}
      >
        {/* Content Area */}
        <div className="flex h-full py-2 px-4 items-center">
          
          {/* Left Side: Logo Area - 40% width */}
          <div className="w-[40%] flex flex-col relative h-full justify-center pl-10 flex-shrink-0">
            
            {/* Logo Row: [D] [Stack] */}
            <div className="flex flex-row items-start relative mt-2">
               
               {/* Big Letter (D) - Scaled to 246px for 341px height */}
               <div className="text-[246px] leading-[0.8] font-oswald font-bold text-[#ed1c24] mr-5 tracking-tighter relative top-0">
                  {firstLetter}
               </div>
               
               {/* Right Stack: CONSTRUCTION / imo row */}
               <div className="flex flex-col justify-center">
                  {/* Company Suffix (CONSTRUCTION) */}
                  <div className="text-[#ed1c24] font-oswald font-bold text-[82px] leading-[1] tracking-[0.08em] whitespace-nowrap relative top-1">
                      {data.companyNameSuffix}
                  </div>
                  
                  {/* Name Rest (imo) + V Shape + OOD */}
                  <div className="flex items-end mt-1"> 
                      {/* imo */}
                      <span className="text-[130px] leading-[0.8] font-oswald font-bold text-[#ed1c24] -ml-1">
                          {restOfName}
                      </span>
                      
                      {/* The V Shape (Chevron) - Reduced width to 220px and adjusted path */}
                      <div className="ml-6 mr-4 self-end mb-3">
                           <svg width="220" height="65" viewBox="0 0 220 65" className="fill-[#ed1c24]">
                              {/* Compact V shape ending near N of CONSTRUCTION */}
                               <path d="M0 0 L70 0 L110 45 L150 0 L220 0 L140 65 L80 65 Z" />
                           </svg>
                      </div>

                      {/* OOD and Stars Group */}
                      <div className="flex flex-col items-center justify-end mb-0 relative top-1 min-w-[120px]">
                          {/* Stars - Scaled to 28px */}
                          <div className="flex gap-[4px] text-[#ed1c24] mb-1 justify-center w-full">
                               {[1,2,3,4,5].map(i => (
                                   <svg key={i} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                   </svg>
                               ))}
                          </div>
                          {/* Type (OOD) */}
                          <span className="text-[73px] font-oswald font-bold text-[#ed1c24] leading-[0.75] tracking-normal text-center w-full">
                              {data.companyType}
                          </span>
                      </div>
                  </div>
               </div>
            </div>
            
            {/* Slogan - Scaled to 43px */}
             <div className="mt-5 relative pl-1">
                <h2 className="text-[#ed1c24] font-condensed font-bold text-[43px] leading-tight uppercase tracking-normal whitespace-nowrap">
                    {data.slogan}
                </h2>
             </div>
          </div>

          {/* Right Side: Contact Info - 60% width - Right Aligned Block Position */}
          <div className="w-[60%] flex flex-col justify-center pr-12 text-[#1a1a1a] items-end">
              {/* Inner Container: Left Aligned Content, Auto Width to hug content */}
              <div className="font-condensed text-[34px] leading-snug text-black flex flex-col items-start w-fit">
                  {/* Address - Left Aligned */}
                  <div className="mb-2 whitespace-nowrap tracking-tight text-left">
                      {data.address}
                  </div>
                  
                  {/* Emails & Web - Vertical Stack - Left Aligned */}
                  <div className="flex flex-col items-start mb-3 gap-y-1 w-full">
                      <div className="flex gap-x-3 items-baseline justify-start w-full">
                          <span className="font-normal text-[36px]">email:</span>
                          <a href={`mailto:${data.email1}`} className="text-[#2a3b90] underline decoration-2 underline-offset-4">{data.email1}</a>
                      </div>
                      
                      <div className="flex gap-x-3 items-baseline justify-start w-full">
                          <span className="font-normal text-[36px]">web:</span>
                          <a href={`https://${data.website}`} target="_blank" rel="noreferrer" className="text-[#2a3b90] underline decoration-2 underline-offset-4">{data.website}</a>
                      </div>
                  </div>
                  
                  {/* Phone Numbers Grid - Left Aligned */}
                  <div className="grid grid-cols-[auto_auto] gap-y-1 gap-x-3 text-left w-fit">
                      <span className="font-bold tabular-nums text-left">{data.phone1}</span>
                      <span className="text-[34px] whitespace-nowrap text-left">- {data.person1}</span>
                      
                      <span className="font-bold tabular-nums text-left">{data.phone2}</span>
                      <span className="text-[34px] whitespace-nowrap text-left">- {data.person2}</span>
                      
                      <span className="font-bold tabular-nums text-left">{data.phone3}</span>
                      <span className="text-[34px] whitespace-nowrap text-left">- {data.person3}</span>
                  </div>
              </div>
          </div>
        </div>
      </div>

      {/* Cutout Corners - Reduced to 72px / offset 36px */}
      <div className="absolute -top-[36px] -left-[36px] w-[72px] h-[72px] bg-[#f3f4f6] rounded-full border-r border-b border-gray-400 box-content z-10 transform rotate-0"></div>
      <div className="absolute -top-[36px] -right-[36px] w-[72px] h-[72px] bg-[#f3f4f6] rounded-full border-l border-b border-gray-400 box-content z-10"></div>
      <div className="absolute -bottom-[36px] -left-[36px] w-[72px] h-[72px] bg-[#f3f4f6] rounded-full border-r border-t border-gray-400 box-content z-10"></div>
      <div className="absolute -bottom-[36px] -right-[36px] w-[72px] h-[72px] bg-[#f3f4f6] rounded-full border-l border-t border-gray-400 box-content z-10"></div>

    </div>
  );
};