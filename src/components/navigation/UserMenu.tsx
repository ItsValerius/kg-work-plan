"use client";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import SignOutButton from "../auth/SignOutButton";
import { User } from "lucide-react";

const UserMenu = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <User className="h-4 w-4" />
          <span className="sr-only">Konto</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="flex flex-col gap-1">
          <SignOutButton />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserMenu;

