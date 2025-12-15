import React from 'react';
import '../styles/globals.css'
import Script from "next/script";
import { useRouter } from "next/router";
import protectedRoute from "../components/ProtectedRoute";

const openRoutes = ["/login", "/signup"]; // not protected

import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isOpenRoute = openRoutes.includes(router.pathname);

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Toaster position="top-right" />
      {isOpenRoute ? (
        <Component {...pageProps} />
      ) : (
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      )}
    </>
  );
}

export default MyApp;

