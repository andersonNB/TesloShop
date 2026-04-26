"use client"
import { changeUserRole } from '@/actions/user/change-user-role'
import { User } from '@/interfaces'

interface Props {
    users: User[]
}

export const UsersTable = ({ users }: Readonly<Props>) => {



    return (
        <table className="min-w-full">
            <thead className="bg-gray-200 border-b">
                <tr className='h-10'>
                    <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-0 text-left">
                        Email
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-0 text-left">
                        Nombre completo
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-0 text-left">
                        Rol
                    </th>
                </tr>
            </thead>
            <tbody>

                {
                    users.map(user => (
                        <tr key={user.id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">

                            <td className="px-6 py-0 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
                            <td className="text-sm text-gray-900 font-light px-6 py-0 whitespace-nowrap">
                                {user?.name ?? "Sin nombre"}
                            </td>
                            <td className="py-3">
                                <select value={user.role} className='w-full px-5 py-1 border rounded-md text-sm text-gray-900' onChange={(e) => changeUserRole(user.id, e.target.value as "admin" | "user")}>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>
                            </td>

                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}
