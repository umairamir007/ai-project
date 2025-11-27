import { google, slack, atlassian, dropbox, shopify } from "./imports";
import "./brand.css";

const brands = [google, slack, atlassian, dropbox, shopify];

const Brand = () => (
  <div className="flex flex-wrap justify-center items-center gap-16 sm:gap-12 xs:gap-6 py-12 ">
    {brands.map((logo, index) => (
      <div
        key={index}
        className="h-[35px] w-[140px] sm:w-[110px] xs:w-[80px] flex items-center justify-center"
      >
        <img
          src={logo}
          alt={`brand-${index}`}
          className="max-h-full max-w-full object-contain"
        />
      </div>
    ))}
  </div>
);

export default Brand;
