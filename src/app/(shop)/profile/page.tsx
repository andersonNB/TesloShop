import { auth } from '@/auth.config'
import { Title } from '@/components'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {

    const session = await auth()

    if (!session?.user) {
        redirect("/auth/login?returnTo=/profile")
    }

    return (
        <div>
            <Title title='Perfil' />
            {
                <pre>
                    {
                        JSON.stringify(session, null, 2)
                    }
                </pre>

            }
        </div>
    )
}
