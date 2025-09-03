import { Metadata } from "next";

type Props = {
    params: Promise<{productid: string}>;
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const productid = (await params).productid;
    const title = await new Promise((resolve) => {
        setTimeout(() => {
            resolve(`Iphone ${productid}`);
        }, 100);
    });
    return {
        title: `Product ${title}`,
    };
}

export default async function ProductDetails({
    params,
}: {
    params: Promise<{productid: string}>;
}) {
    const productid = (await params).productid;
  return <div>Detail About Product {productid}</div>
}