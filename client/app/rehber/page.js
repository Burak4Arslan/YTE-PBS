import { Suspense } from "react";
import RehberView from "./rehberView";

export default function RehberPage() {
    return (
        <main style={{ padding: 24, backgroundColor: "#F5F5F5", minHeight: "100vh" }}>
            <Suspense fallback={null}>
                <RehberView />
            </Suspense>
        </main>
    );
}
