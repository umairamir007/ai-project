import { google, slack, atlassian, dropbox, shopify } from "./imports";
import "./brand.css";
import PageContainer from "../layout/page-container";

const brands = [google, slack, atlassian, dropbox, shopify];

const Brand = () => (
    <div className="flex flex-wrap justify-center items-center gap-8   sm:gap-12 xs:gap-6   py-10 ">
      {brands.map((logo, index) => (
        <div
          key={index}
          className="h-[35px] w-[100px] sm:w-[150px] xs:w-[80px] 2xl:w-[210px] flex items-center justify-center"
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
