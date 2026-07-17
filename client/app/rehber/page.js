"use client";

import { Suspense } from "react";
import RehberView from "./rehberView";
import RoleGuard from "../components/RoleGuard";

export default function RehberPage() {
    return (
        <RoleGuard allowedRoles={['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE']}>
            <main style={{ padding: 24, backgroundColor: "#F5F5F5", minHeight: "100vh" }}>
                <Suspense fallback={null}>
                    <RehberView />
                </Suspense>
            </main>
        </RoleGuard>
    );
}
