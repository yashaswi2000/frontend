import { getSession } from '../session.server'
import SidebarWithHeader from '~/components/SidebarWithHeader';
import Chat from '~/chat/Chat';

export let loader = async ({ request }) => {

  const session = await getSession(request.headers.get('Cookie'));
  const accountEmail = session.data.user.email
  return ({});

};

export default function IvsChat() {
  return (
    <SidebarWithHeader hasAccess={1}>
    <Chat />
    </SidebarWithHeader>
  );
}
  