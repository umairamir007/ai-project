import React from 'react'
import { facebook, insta, logo, twitter } from '../../images'

const Footer = () => {
    return (
        <div className="bg-black p-8 flex flex-col sm:flex-row sm:justify-around gap-10 sm:gap-0">
            <div className="flex flex-col items-center sm:items-start justify-center">
                <img
                    src={logo}
                    alt=""
                    className="h-12 w-12 sm:h-16 sm:w-16"
                />
                <p className="text-white font-bold text-3xl sm:text-4xl mt-4">
                    Isais
                </p>
            </div>

            <div className="flex justify-center sm:justify-start">
                <ul className="text-white flex flex-col gap-4 sm:gap-6 text-center sm:text-left">
                    <li className="text-xl sm:text-2xl font-bold">Main</li>
                    <li className="text-base sm:text-xl">Content made Easy</li>
                    <li className="text-base sm:text-xl">Why Choose Us</li>
                    <li className="text-base sm:text-xl">Why love ISAI</li>
                    <li className="text-base sm:text-xl">Use Cases</li>
                    <li className="text-base sm:text-xl">Pricing</li>
                </ul>
            </div>

            <div className="flex justify-center sm:justify-start">
                <ul className="text-white flex flex-col gap-4 sm:gap-6 text-center sm:text-left">
                    <li className="text-lg sm:text-xl">Get in touch</li>
                    <li className="text-base sm:text-xl">jhonny@jmaroun.com</li>
                    <li className="text-base sm:text-xl">www.jmaroun.com</li>

                    <li>
                        <div className="flex gap-4 sm:gap-6 justify-center sm:justify-start">
                            <img src={facebook} alt="" className="h-5 w-5 sm:h-6 sm:w-6" />
                            <img src={insta} alt="" className="h-5 w-5 sm:h-6 sm:w-6" />
                            <img src={twitter} alt="" className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                    </li>
                </ul>
            </div>

        </div>
    )
}

export default Footer
