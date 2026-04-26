import { verifyAdminSession } from "@/actions"
import { redirect } from "next/navigation"


export default async function AdminLayout({ children }: { children: React.ReactNode }) {


    const isAdmin = await verifyAdminSession()

    if (!isAdmin.ok) {
        redirect("/auth/login")
    }

    return (
        <div>
            {children}
        </div>
    )
}