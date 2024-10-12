import * as React from "react";
import {Moon,Sun} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type modes="theme-light"|"dark"|"system"
export function ModeToggle() {
    const [theme,setThemeState]=React.useState<modes>("theme-light");

    // Almacena el tema en localStorage
    React.useEffect(() => {
        const storedTheme=localStorage.getItem("theme") as modes;
        const isDarkMode=document.documentElement.classList.contains("dark");
        setThemeState(storedTheme||(isDarkMode? "dark":"theme-light"));
    },[]);

    // Cambia el tema basado en el estado
    React.useEffect(() => {
        const isDark=theme==="dark"||(theme==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);
        document.documentElement.classList[isDark? "add":"remove"]("dark");

        // Almacena el tema seleccionado en localStorage
        localStorage.setItem("theme",theme);
    },[theme]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setThemeState("theme-light")}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setThemeState("dark")}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setThemeState("system")}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
