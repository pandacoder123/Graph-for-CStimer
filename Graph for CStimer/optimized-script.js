(async () => {
    const dbName = "cstimer";
    const objectStoreName = "sessions";
    let lastDataHash = null;
    let canvas;
    let currentSession;
    let previousSessionValue;

    const style = document.createElement("style");
    style.textContent = `
        @font-face {
            font-family: 'lcd';
            src: url('data:application/x-font-woff;charset=utf-8;base64,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') format('woff');
            font-weight: normal;
            font-style: normal;
        }
    `;
    document.head.appendChild(style);

    function getCurrentSession() {
        const myData = JSON.parse(localStorage.getItem("properties"));
        const sessionNum = myData?.session || 1;
        return `session_${String(sessionNum).padStart(2, '0')}_00`;
    }

    function createOrUpdateChart(times) {
        const currentDataHash = JSON.stringify(times);
        if (currentDataHash === lastDataHash) return;
        
        lastDataHash = currentDataHash;
        
        if (!canvas) {
            canvas = document.createElement("canvas");
            canvas.id = "chartCanvas";
            canvas.style.cssText = `
                background-color: transparent;
                width: 100%;
                position: absolute;
                bottom: 0;
                margin-left: 13.5rem;
                z-index: 1000;
                height: 12rem;
            `;
            document.body.appendChild(canvas);

            const ctx = canvas.getContext("2d");
            window.chart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: [],
                    datasets: [{
                        label: "Times (seconds)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        backgroundColor: "rgb(255, 255, 255)",
                        borderWidth: 2,
                        data: []
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                color: "#ffffff",
                                font: { size: 16 },
                                text: "Attempt Number"
                            },
                            ticks: { color: "grey" },
                            grid: { color: "black" }
                        },
                        y: {
                            title: {
                                display: true,
                                color: "#ffffff",
                                font: { size: 16 },
                                text: "Time (sec)"
                            },
                            ticks: { color: "grey" },
                            grid: { color: "black" }
                        }
                    }
                }
            });
        }

        window.chart.data.datasets[0].data = times;
        window.chart.data.labels = times.map((_, index) => index + 1);
        window.chart.update();
    }

    async function fetchDataFromDatabase() {
        const db = await new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });

        const transaction = db.transaction([objectStoreName], "readonly");
        const objectStore = transaction.objectStore(objectStoreName);
        const sessionKey = getCurrentSession();
        
        try {
            const result = await new Promise((resolve, reject) => {
                const request = objectStore.get(sessionKey);
                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve(request.result);
            });

            const times = result?.map(solve => solve[0][1] / 1000) || [];
            createOrUpdateChart(times);
        } catch (error) {
            console.error("Error reading data from sessions:", error);
        }
    }

    // Revert back to the original visibility checking logic
    setInterval(() => {
        const scrambleDiv = document.getElementById("scrambleDiv");
        if (scrambleDiv.style.display === "none") {
            console.log("HIDDEN");
            document.getElementById("chartCanvas").style.display = "none";
        }
    }, 75);

    setInterval(() => {
        const scrambleDiv = document.getElementById("scrambleDiv");
        if (scrambleDiv.style.display === "block") {
            console.log("VISIBLE");
            document.getElementById("chartCanvas").style.display = "block";
            return;
        }
    }, 75);

    setInterval(fetchDataFromDatabase, 1000);
})();
