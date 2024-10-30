"use client";
import {
  UserCircle,
  Wallet,
  Plus,
  Cloud,
  Menu,
  RefreshCcw,
  Home,
  Gamepad2,
  Sword,
  Brain,
  ChevronRight,
  LogOut,
  MinusCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function GamesDisplay() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [balance, setBalance] = useState(1000);

  const refreshBalance = () => {
    // Simulating a balance refresh
    setBalance((prevBalance) => prevBalance + Math.floor(Math.random() * 100));
  };

  return (
    <div className="flex min-h-screen bg-[#19191D] text-[#EDEDF0]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#252529] transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-[#EDEDF0]/10">
            <div className="flex items-center space-x-3">
              <UserCircle className="w-10 h-10 text-[#FD366E]" />
              <p className="font-semibold">John Doe</p>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Wallet in Sidebar */}
          <div className="p-4 border-b border-[#EDEDF0]/10">
            <div className="bg-[#2A2A2E] rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Wallet className="w-6 h-6 text-[#FD366E]" />
                <div>
                  <p className="text-sm text-[#EDEDF0]/60">Balance</p>
                  <p className="font-semibold">${balance.toFixed(2)}</p>
                </div>
              </div>
              <button
                onClick={refreshBalance}
                className="p-1 hover:bg-[#FD366E]/10 rounded-full transition-colors"
                aria-label="Refresh balance"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-4 flex justify-center space-x-4">
              <button
                className="bg-[#FD366E] hover:bg-[#FD366E]/80 transition-colors text-[#EDEDF0] px-3 py-2 rounded-md flex items-center"
                aria-label="Add Money"
              >
                <Plus className="w-5 h-5 mr-1" />
                <span className="text-sm">Add</span>
              </button>
              <button
                className="bg-[#2A2A2E] hover:bg-[#2A2A2E]/80 transition-colors text-[#EDEDF0] px-3 py-2 rounded-md flex items-center"
                aria-label="Withdraw Money"
              >
                <MinusCircle className="w-5 h-5 mr-1" />
                <span className="text-sm">Withdraw</span>
              </button>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-2 px-3">
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-[#FD366E]/10 transition-colors"
                >
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-[#FD366E]/10 text-[#FD366E] transition-colors"
                >
                  <Gamepad2 className="w-5 h-5" />
                  <span>All Games</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-[#FD366E]/10 transition-colors"
                >
                  <Sword className="w-5 h-5" />
                  <span>Action</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-[#FD366E]/10 transition-colors"
                >
                  <Brain className="w-5 h-5" />
                  <span>Puzzle</span>
                </a>
              </li>
            </ul>
          </nav>
          <div className="p-4 border-t border-[#EDEDF0]/10">
            <button className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg hover:bg-[#FD366E]/10 transition-colors">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto p-6">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden mb-4 p-2 rounded-lg"
          >
            <Menu className="w-10 h-10 mb-5 text-[#FD366E]" />
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 p-5">
            {/* CloudSweeper Game Card */}
            <Link href={"/games/cloudsweeper"}>
              <div className="bg-[#252529] rounded-lg overflow-hidden shadow-lg">
                <img
                  src="/logo.png?height=200&width=400"
                  alt="CloudSweeper game preview"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">CloudSweeper</h3>
                  <p className="text-[#EDEDF0]/80 mb-4">
                    Navigate through cloud formations, avoiding obstacles and
                    collecting power-ups in this thrilling aerial adventure.
                  </p>
                  <span className="inline-block bg-[#FD366E] text-[#EDEDF0] px-3 py-1 rounded-full text-sm font-semibold">
                    Arcade
                  </span>
                </div>
              </div>
            </Link>

            {/* Contribute More Games Card */}
            <div className="bg-[#252529] rounded-lg overflow-hidden shadow-lg flex flex-col items-center justify-center p-6 text-center h-full">
              <Plus className="w-16 h-16 text-[#FD366E] mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Contribute More Games
              </h3>
              <p className="text-[#EDEDF0]/80 mb-4">
                Help grow the BaasGames community by adding your own game
                creations.
              </p>
              <button className="bg-[#FD366E] text-[#EDEDF0] px-4 py-2 rounded-lg font-semibold hover:bg-[#FD366E]/80 transition-colors">
                Add Your Game
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
