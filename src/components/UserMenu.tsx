"use client";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import Link from "next/link";
import SignOutButton from "./SignOutButton";

const UserMenu = ({ isAdmin }: { isAdmin: boolean }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="absolute right-4 top-4">Konto</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col">
          <Button asChild variant="link">
            <Link href={"/profile"}>Profil</Link>
          </Button>
          <Button asChild variant="link">
            <Link href={"/meine-aufgaben"}>Meine Aufgaben</Link>
          </Button>
          {isAdmin && (
            <Button asChild variant="link">
              <Link href={"/dashboard"}>Admin Liste</Link>
            </Button>
          )}
          <SignOutButton />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserMenu;
