
export default function Home() {
    return (
        <main className="min-h-[calc(100vh-72px)] bg-[#101116] p-6">
            <section className="relative flex min-h-[calc(100vh-104px)] overflow-hidden bg-white shadow-xl">

                {/* Forma azul principal */}
                <div
                    className="relative flex min-h-[calc(100vh-104px)] w-[70%] items-center bg-[#EC5800] shadow-[12px_0_24px_rgba(255,92,0,0.25)]"
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
                <section className="absolute left-[63%] right-[3%] top-1/2 z-20 flex -translate-y-1/2 flex-col items-center justify-center gap-10 max-md:left-1/2 max-md:right-auto max-md:top-auto max-md:bottom-[5%] max-md:w-[55%] max-md:-translate-x-1/2 max-md:translate-y-0 max-md:gap-5 max-md:rounded-xl max-md:bg-white max-md:p-4">
                    <img src="/images/caldic_logo.png" alt="Caldic" className="block h-auto w-[72%] max-w-[280px] object-contain max-md:w-[85%]" />
                    <img src="/images/piber_logo.png" alt="Pibernat" className="block h-auto w-[72%] max-w-[280px] object-contain max-md:w-[85%]" />
                </section>

            </section>
        </main>
    );
}
