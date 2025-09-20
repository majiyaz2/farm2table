import { getPayload } from "payload";
import configPromise from "@payload-config";

import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { SearchFilters } from "./search-filters";


interface Props {
    children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
    const payload = await getPayload({
        config: configPromise,
    });

    const data = await payload.find({
        collection: "categories",
        where: {
            parent: {
                exists: false,
            },
        },
        depth: 1,
    });
    
    return (
        <div className="flex flex-col min-h-screen">
           <Navbar />
           <SearchFilters data={data}/>
           <div className="flex-1 bg-[#F4F4F0]">
                {children}
           </div>
           <Footer />
        </div>
    );
};

export default Layout;