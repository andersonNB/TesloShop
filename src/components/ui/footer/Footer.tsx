import { titleFont } from "@/config/font"
import Link from "next/link"

export const Footer = () => {
    return (
        <div className="flex w-full justify-center items-center text-xs p-5 gap-1">
            <Link href={"/"}>
                <span className={`${titleFont.className} antialiased font-bold`}>Teslo </span>
                <span>| shop </span>
                <span> {new Date().getFullYear()}  </span>
            </Link>

            <Link href={"/"}>
                |  Privacy Policy
            </Link>
            <Link href={"/"}>
                |  Terms and Conditions
            </Link>
        </div>
    )
}