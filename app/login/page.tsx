import LoginForm from "./LoginForm";
import type { PortalRole } from "@/lib/session";

/** `/login` defaults to student access; middleware supplies roles for portal URL rewrites. */
export default function LoginPage({searchParams}:{searchParams:{role?:string}}){const requested=searchParams.role;const role:PortalRole=requested==="supervisor"||requested==="coordinator"?requested:"student";return <LoginForm role={role}/>}
