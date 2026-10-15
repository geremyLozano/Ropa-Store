'use client'

import { FaCcVisa, FaCcMastercard, FaCcAmex } from 'react-icons/fa';
import { SiDinersclub } from 'react-icons/si';

export default function CardIcons() {
    return (
        <div className="flex items-center gap-4 text-4x1 text-muted-foreground">
            <FaCcVisa className="hover:text-blue-600 transition-colors" />
            <FaCcMastercard className="hover:text-red-500 transition-colors" />
            <FaCcAmex className="hover:text-sky-500 transition-colors" />
            <SiDinersclub className="hover:text-indigo-600 transition-colors" />
        </div>
    )
}