import Navbar from "@/components/Navbar";
import { Fira_Sans } from "next/font/google";
import "./globals.css";
import { UserContextProvider } from "./context/UserContext";

const inter = Fira_Sans({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: "MP4",
  description: "Live stream,shorts and videos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#333333]`}>
        <UserContextProvider>
          <div className="fixed w-full">
            <Navbar />
          </div>
          <div className="w-full h-[45px] bg-[#333333]"></div>
          {children}
        </UserContextProvider>
      </body>
    </html>
  );
}
