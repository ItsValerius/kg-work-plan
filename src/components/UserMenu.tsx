"use client";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import Link from "next/link";
import SignOutButton from "./SignOutButton";

const UserMenu = ({ isAdmin }: { isAdmin: boolean }) => {
  return (
    <div className="absolute right-4 top-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button>Konto</Button>
        </PopoverTrigger>
        <PopoverContent className="w-56">
          <div className="flex flex-col gap-1">
            <Button asChild variant="ghost" className="justify-start">
              <Link href={"/profile"}>Profil</Link>
            </Button>
            <Button asChild variant="ghost" className="justify-start">
              <Link href={"/meine-aufgaben"}>Meine Aufgaben</Link>
            </Button>
            {isAdmin && (
              <Button asChild variant="ghost" className="justify-start">
                <Link href={"/dashboard"}>Admin Liste</Link>
              </Button>
            )}
            <div className="border-t my-1" />
            <SignOutButton />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default UserMenu;
