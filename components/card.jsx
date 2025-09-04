import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Card = ({ onClick, text, icon, subText }) => {
  return (
    <div
      onClick={onClick}
      className="group relative bg-white border border-slate-200 rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col gap-4 text-center items-center"
    >
      {/* Icon container */}
      {icon && (
        <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center transition-colors duration-300 group-hover:bg-sky-500 group-hover:text-white">
          <FontAwesomeIcon
            icon={icon}
            className="text-3xl"
          />
        </div>
      )}

      {/* Text content */}
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-bold text-slate-800">{text}</h3>
        {subText && <p className="text-sm text-slate-500 mt-1 leading-relaxed">{subText}</p>}
      </div>

      {/* Arrow icon for affordance */}
      <FontAwesomeIcon 
        icon={faArrowRight} 
        className="absolute top-4 right-4 text-slate-300 transition-all duration-300 group-hover:text-sky-500 group-hover:translate-x-1"
      />
    </div>
  );
};

export default Card;