import configPromise from "@payload-config";
import { getPayload } from "payload";

export default async function Home() {
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
   <div>
    {JSON.stringify(data)}
   </div>
  );
}
 