import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const CardTop = ({
    onClick,
    topTitle,
    mainTitle,
    icon,
    iconBgColor = 'bg-slate-100',
    iconTextColor = 'text-slate-600',
}) => {
    return (
        <div className="p-5 border border-slate-200 rounded-2xl shadow-sm flex justify-between items-start w-full bg-white transition-all duration-300 hover:border-sky-400 hover:shadow-md">
            <div className='flex flex-col gap-2 w-full'>
                <h3 className="text-slate-500 font-medium text-sm">{topTitle}</h3>
                <p className="text-2xl font-bold text-slate-800">{mainTitle}</p>
                <hr className="my-2 border-slate-100 w-full" />
                <button
                    className="flex items-center font-semibold gap-2 text-sm text-sky-600 cursor-pointer transition-transform duration-300 hover:translate-x-1 w-fit"
                    onClick={onClick}
                >
                    Lihat detail
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </div>
            {icon && (
                <div className={`flex-shrink-0 ml-4 w-12 h-12 rounded-lg flex items-center justify-center ${iconBgColor} ${iconTextColor}`}>
                    <FontAwesomeIcon icon={icon} className="text-xl" />
                </div>
            )}
        </div>
    );
}

export default CardTop;