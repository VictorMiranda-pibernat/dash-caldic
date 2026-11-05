
export default function Home() {
    return (
        <main className="min-h-[calc(100vh-72px)] bg-[#101116] p-6">
            <section className="relative flex min-h-[calc(100vh-104px)] overflow-hidden bg-white shadow-xl">

                {/* Forma azul principal */}
                <div
                    className="relative flex min-h-[calc(100vh-104px)] w-[74%] items-center bg-[#EC5800] shadow-[12px_0_24px_rgba(255,92,0,0.25)]"
                    style={{
                        borderBottomRightRadius: "27% 100%",
                    }}
                >
                    <div className="ml-[12%] -mt-2">
                        <h1 className="text-[64px] font-extrabold leading-[1.08] tracking-tight text-white">
                            Dashboard
                            <br />
                            <span className="text-[#FFA84D]">Caldic - KPI</span>
                        </h1>
                    </div>

                    <p className="absolute bottom-6 left-[12%] text-[17px] font-bold text-white">
                        BI de Gerenciamento | KPI
                    </p>
                </div>

                {/* Identidade Caldic */}
                <div className="absolute bottom-6 right-8 flex items-center">
                    <img
                        src="/images/caldic_logo.png"
                        alt="Logo Caldic"
                        className="h-20 w-auto"
                    />
                </div>

            </section>
        </main>
    );
}
