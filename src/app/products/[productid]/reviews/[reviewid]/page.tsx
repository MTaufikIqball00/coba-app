import { notFound } from "next/navigation";

export default async function ProductReviewDetails({
    params,
}: {
    params: Promise<{productid: string; reviewid: string}>;
}) {
    const {productid, reviewid} = await params;
    if(parseInt(reviewid) > 500){
        notFound();
    }
  return <h1>Review {reviewid} for product {productid}</h1>
}