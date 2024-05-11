// app/routes/client-route/route.jsx
import { Suspense, lazy } from "react";
import { useNavigation } from "@remix-run/react";


const ClientComponent = lazy(() => import("../ivsutils.client"));

export default function ClientRoute() {
  const navigation = useNavigation();

  return (
    <div>
      <h1>Client Route</h1>
      <Suspense fallback={<div>Loading...</div>}>
        {navigation.state === "idle" && <ClientComponent />}
      </Suspense>
    </div>
  );
}