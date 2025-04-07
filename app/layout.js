import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from '../components/ui/sonner'

const inter = Inter({ subsets: ["latin"] });


export const metadata = {
  title: "Finance APP",
  description: "Non stop finance app",
};

export default function RootLayout({ children }) {
  return (

    <ClerkProvider>


      <html lang="en">
        <body className={`${inter.className}`}>
          {/*header*/}
          <Header />

          <main className="container mx-auto px-4 py-8 min-h-screen">{children}</main>

          <Toaster richColors />

          {/*footer*/}
          <footer className=" bg-blue-50  py-12 ">
            <div className="container mx-auto px-4 text-center text-grey-600">
              <p>© 2025 💵💲Finance App by sahil kapase</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
