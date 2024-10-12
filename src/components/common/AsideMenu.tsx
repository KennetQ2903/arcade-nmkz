import {Home,Joystick,LineChart,LogOut,Package,Package2,User,Store} from "lucide-react"

import {Tooltip,TooltipContent,TooltipProvider,TooltipTrigger} from "@/components/ui/tooltip"
import {useCallback} from "react"

export const AsideMenu=() => {

    const handleLogout=useCallback((e: React.MouseEvent<HTMLAnchorElement,MouseEvent>) => {
        e.preventDefault();
        fetch("/api/auth/signout")
            .then(() => {
                location.replace('/');
            });
    },[])

    return (
        <TooltipProvider>
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                    <a
                        href="/dashboard"
                        className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                    >
                        <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                        <span className="sr-only">NMKZ Arcades</span>
                    </a>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <a
                                href="/dashboard"
                                className="group flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                            >
                                <Home className="h-5 w-5 transition-all group-hover:scale-110" />
                                <span className="sr-only">Resumen</span>
                            </a>
                        </TooltipTrigger>
                        <TooltipContent side="right">Resumen</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <a
                                href="/users"
                                className="group flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                            >
                                <User className="h-5 w-5 transition-all group-hover:scale-110" />
                                <span className="sr-only">Usuarios</span>
                            </a>
                        </TooltipTrigger>
                        <TooltipContent side="right">Usuarios</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <a
                                href="/arcades"
                                className="group flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                            >
                                <Joystick className="h-5 w-5 transition-all group-hover:scale-110" />
                                <span className="sr-only">Maquinas</span>
                            </a>
                        </TooltipTrigger>
                        <TooltipContent side="right">Maquinas</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <a
                                href="/providers"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                            >
                                <Package className="h-5 w-5" />
                                <span className="sr-only">Proveedores</span>
                            </a>
                        </TooltipTrigger>
                        <TooltipContent side="right">Proveedores</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <a
                                href="/shops"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                            >
                                <Store className="h-5 w-5" />
                                <span className="sr-only">Comercios</span>
                            </a>
                        </TooltipTrigger>
                        <TooltipContent side="right">Comercios</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <a
                                href="/analytics"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                            >
                                <LineChart className="h-5 w-5" />
                                <span className="sr-only">Informes</span>
                            </a>
                        </TooltipTrigger>
                        <TooltipContent side="right">Informes</TooltipContent>
                    </Tooltip>
                </nav>
                <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <a
                                href="/signout"
                                data-astro-prefetch="false"
                                rel="nofollow noopener"
                                onClick={handleLogout}
                                className="group flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                            >
                                <LogOut className="h-5 w-5 transition-all group-hover:scale-110" />
                                <span className="sr-only">Cerrar Sesión</span>
                            </a>
                        </TooltipTrigger>
                        <TooltipContent side="right">Cerrar Sesión</TooltipContent>
                    </Tooltip>
                </nav>
            </aside>
        </TooltipProvider>
    )
}