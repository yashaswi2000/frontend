import { Link, Form, useActionData, useNavigation, json, useLoaderData } from '@remix-run/react';
import { getSession } from '../session.server'
import SidebarWithHeader from '~/components/SidebarWithHeader';
import { Suspense, lazy } from "react";

const sportsList = ['Football', 'Badminton'];

export async function loader({ request }) {
    const session = await getSession(request.headers.get('Cookie'));
    if (!session) {
        return {
            redirect: '/login',
        };
    }
    const url = new URL(request.url);
    const q = url.searchParams.get("play_back_url");
    return json({ q });
}



const ClientComponent = lazy(() => import("../VideoPlayer.client"));

export default function ViewStream() {
    const { q } = useLoaderData();
    const streamUrl = q;
    const navigation = useNavigation();

  return (
    <SidebarWithHeader>
      <Suspense fallback={<div>Loading...</div>}>
        {navigation.state === "idle" && <ClientComponent streamUrl={streamUrl} />}
      </Suspense>
    </SidebarWithHeader>
  );
}