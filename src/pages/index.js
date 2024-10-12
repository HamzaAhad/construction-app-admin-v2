import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/login"); // Redirect to login if not authenticated
  }, [router]);
  return (
    <Head>
      <title>Landing Page</title>
      <meta name="description" content="Landing Page" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
