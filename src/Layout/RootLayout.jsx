import { Outlet } from "react-router";
import Footer from "../footer/Footer";
import { useRouteLoaderData } from "react-router";


export default function RootLayout() {
  const token = useRouteLoaderData()

  console.log(token)

  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
}
