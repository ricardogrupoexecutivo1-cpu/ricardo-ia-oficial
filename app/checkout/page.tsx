import CheckoutClient from "./checkout-client";

type CheckoutPageProps = {
  searchParams?: Promise<{
    plan?: string;
  }>;
};

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const params = await searchParams;
  const plan = String(params?.plan || "pro")
    .trim()
    .toLowerCase();

  return <CheckoutClient plan={plan === "premium" ? "premium" : "pro"} />;
}