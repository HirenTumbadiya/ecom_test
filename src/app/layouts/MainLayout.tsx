import { ReactNode } from "react";
import Header from "shared/components/layout/Header";

type Props = {
    children: ReactNode;
};

const MainLayout = ({ children }: Props) => {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Header />

            <main
                style={{
                    flex: 1,
                }}
            >
                {children}
            </main>
        </div>
    );
};

export default MainLayout;