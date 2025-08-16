"use client";
import React, { useState } from "react";
import Sidebar from "@/app/components/layout/Sidebar/Sidebar/Sidebar";
import Navbar from "@/app/components/layout/Navbar/page";
import themeStore from "@/app/zustandData/theme.zustand";
import Breadcrumbs from "@/app/components/layout/Breadcrumbs/page";
import useStore from "@/app/hooks/useStore";
import { Card } from "@material-tailwind/react";

interface LayoutProps {
  children: React.ReactNode;
}

const HomeLayout = ({ children }: LayoutProps) => {
  const themeMode = useStore(themeStore, (state) => state);
  const [openSidebar, setOpenSidebar] = useState(false);
  return (
    <main className="w-screen h-screen flex">
      <Sidebar isOpen={openSidebar} />
      <section
        className={`${
          !themeMode || themeMode?.stateMode ? "themeDark contentDark" : "themeLight contentLight"
        } ContentStyle flex-1 overflow-auto ease-out duration-[0.35s] flex flex-col `}
      >
        <Navbar toggleSidebar={() => setOpenSidebar((open) => !open)} />
        <Breadcrumbs />

        <section className="flex-1 overflow-auto">
          <section className="mx-auto h-full">
            <section className="flex flex-row h-full justify-center items-center p-3">
              <Card
                className={`min-h-full scroll-auto w-full h-full ${
                  !themeMode || themeMode?.stateMode ? "breadDark" : "breadLight"
                }`}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                {React.Children.map(children, (child) => (
                  <div className="h-full overflow-auto p-2">{child}</div>
                ))}
              </Card>
            </section>
          </section>
        </section>
      </section>
    </main>
  );
};

export default HomeLayout;
