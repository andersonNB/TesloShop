export const revalidate = 0;

import { getPaginatedUser } from '@/actions';
import { Pagination, Title } from '@/components';
import { redirect } from 'next/navigation';
import { UsersTable } from './ui/UsersTable';

interface Props {
    searchParams: Promise<{ page?: string }>;
}

export default async function UsersPage({ searchParams }: Props) {

    const { page } = await searchParams;
    const currentPage = Number(page ?? 1);

    const { ok, users = [], totalPages = 1 } = await getPaginatedUser({ page: currentPage });

    if (!ok) {
        redirect("/auth/login")
    }

    return (
        <>
            <Title title="Mantenimiento de usuarios" />

            <div className="mb-10">
                <UsersTable users={users} />
                <Pagination totalPages={totalPages} />
            </div>
        </>
    );
}